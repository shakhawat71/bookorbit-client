import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders/my");
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

  const handleCancel = async (orderId) => {
    const ok = window.confirm("Cancel this order?");
    if (!ok) return;

    try {
      setActionLoadingId(orderId);
      await axiosSecure.patch(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  };

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
        <h1 className="text-2xl font-bold text-[#8B5E3C]">My Orders</h1>

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
                <th>Order Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const isPending = order.status === "pending";
                const isUnpaid = order.paymentStatus !== "paid";
                const isCancelled = order.status === "cancelled";
                const busy = actionLoadingId === order._id;

                return (
                  <tr key={order._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        {order.bookImage ? (
                          <img
                            src={order.bookImage}
                            alt={order.bookName || "Book"}
                            className="w-12 h-16 object-cover rounded-lg"
                          />
                        ) : null}

                        <div>
                          <p className="font-semibold">
                            {order.bookName || order.bookTitle || "Untitled"}
                          </p>
                          <p className="text-sm text-gray-500">
                            ৳ {order.price ?? order.bookPrice ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-sm">{formatDate(order.orderDate)}</td>

                    <td>
                      <span
                        className={[
                          "px-3 py-1 rounded-full text-sm font-medium",
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700",
                        ].join(" ")}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={[
                          "px-3 py-1 rounded-full text-sm font-medium",
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700",
                        ].join(" ")}
                      >
                        {order.paymentStatus || "unpaid"}
                      </span>
                    </td>

                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Cancel: only when pending */}
                        {isPending && !isCancelled && (
                          <button
                            disabled={busy}
                            onClick={() => handleCancel(order._id)}
                            className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                          >
                            {busy ? "Cancelling..." : "Cancel"}
                          </button>
                        )}

                        {/* Pay Now: only when pending + unpaid */}
                        {isPending && isUnpaid && !isCancelled && (
                          <button
                            disabled={busy}
                            onClick={() => navigate(`/dashboard/payment/${order._id}`)}
                            className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148]"
                          >
                            Pay Now
                          </button>
                        )}

                        {/* Paid/Delivered states */}
                        {!isUnpaid && (
                          <span className="text-sm text-green-700 font-medium">
                            Paid ✅
                          </span>
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