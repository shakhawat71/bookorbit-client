// ✅ src/pages/dashboard/Orders.jsx (CREATE THIS FILE)
// Librarian/Admin Orders Management Page
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/librarian/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const nextStatus = (status) => {
    if (status === "pending") return "shipped";
    if (status === "shipped") return "delivered";
    return status;
  };

  const canMoveNext = (status) => status === "pending" || status === "shipped";

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setActionId(orderId);
      await axiosSecure.patch(`/librarian/orders/${orderId}/status`, {
        status: newStatus,
      });

      toast.success(`Order marked as ${newStatus}`);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (orderId) => {
    const ok = window.confirm("Cancel this order?");
    if (!ok) return;

    try {
      setActionId(orderId);
      await axiosSecure.patch(`/librarian/orders/${orderId}/cancel`);
      toast.success("Order cancelled");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to cancel");
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  };

  const badgeClass = (status) => {
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "shipped") return "bg-blue-100 text-blue-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700"; // pending
  };

  const payBadgeClass = (paymentStatus) =>
    paymentStatus === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-[#8B5E3C]">Orders</h1>

        <button
          onClick={loadOrders}
          className="btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-[#8B5E3C] text-white">
                <th>Book</th>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const busy = actionId === o._id;
                const status = o.status || "pending";
                const paymentStatus = o.paymentStatus || "unpaid";

                const moveNext = canMoveNext(status);
                const next = nextStatus(status);

                return (
                  <tr key={o._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        {o.bookImage ? (
                          <img
                            src={o.bookImage}
                            alt={o.bookName || "Book"}
                            className="w-12 h-16 object-cover rounded-lg"
                          />
                        ) : null}

                        <div>
                          <p className="font-semibold">{o.bookName}</p>
                          <p className="text-sm text-gray-500">
                            ৳ {o.bookPrice ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-sm">
                      <p className="font-medium">
                        {o.customerName || "—"}
                      </p>
                      <p className="text-gray-600">{o.userEmail}</p>
                      <p className="text-gray-600">{o.phone || ""}</p>
                    </td>

                    <td className="text-sm">{formatDate(o.orderDate)}</td>

                    <td>
                      <span
                        className={[
                          "px-3 py-1 rounded-full text-sm font-medium",
                          badgeClass(status),
                        ].join(" ")}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={[
                          "px-3 py-1 rounded-full text-sm font-medium",
                          payBadgeClass(paymentStatus),
                        ].join(" ")}
                      >
                        {paymentStatus}
                      </span>
                    </td>

                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {moveNext && status !== "cancelled" && (
                          <button
                            disabled={busy}
                            onClick={() => handleUpdateStatus(o._id, next)}
                            className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148]"
                          >
                            {busy
                              ? "Updating..."
                              : status === "pending"
                              ? "Mark Shipped"
                              : "Mark Delivered"}
                          </button>
                        )}

                        {status !== "delivered" && status !== "cancelled" && (
                          <button
                            disabled={busy}
                            onClick={() => handleCancel(o._id)}
                            className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                          >
                            {busy ? "Cancelling..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}