/* eslint-disable no-unused-vars */
// ✅ src/pages/dashboard/MyOrders.jsx (FULL)
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

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

  const handleCancel = async (id) => {
    const ok = window.confirm("Cancel this order?");
    if (!ok) return;

    try {
      setActionId(id);
      await axiosSecure.patch(`/orders/${id}/cancel`);
      toast.success("Order cancelled ✅");
      loadOrders();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Cancel failed");
    } finally {
      setActionId(null);
    }
  };

  // ✅ Payment simulation (your backend has PATCH /orders/:id/pay)
  const handlePay = async (id) => {
    const ok = window.confirm("Confirm payment for this order?");
    if (!ok) return;

    try {
      setActionId(id);
      await axiosSecure.patch(`/orders/${id}/pay`);
      toast.success("Payment done ✅");
      loadOrders();
      // Optional: go invoices page directly
      // navigate("/dashboard/invoices");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Payment failed");
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "—";
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
      <div className="flex items-center justify-between mb-6">
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
                <th>Price</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={o.bookImage}
                        alt={o.bookName}
                        className="w-12 h-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {o.bookName || o.bookTitle || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {o.librarianEmail || ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="font-semibold text-[#8B5E3C]">
                    ৳ {o.price ?? 0}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        o.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : o.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : o.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        o.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td className="text-sm">{formatDate(o.orderDate)}</td>

                  <td className="text-center space-x-2">
                    {/* ✅ Pay button only if unpaid and not cancelled */}
                    {o.paymentStatus !== "paid" && o.status !== "cancelled" && (
                      <button
                        onClick={() => handlePay(o._id)}
                        disabled={actionId === o._id}
                        className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                      >
                        {actionId === o._id ? "Processing..." : "Pay"}
                      </button>
                    )}

                    {/* ✅ Cancel button only if pending AND unpaid */}
                    {o.status === "pending" && o.paymentStatus !== "paid" && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        disabled={actionId === o._id}
                        className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                      >
                        {actionId === o._id ? "Please wait..." : "Cancel"}
                      </button>
                    )}

                    {/* ✅ If paid show small badge */}
                    {o.paymentStatus === "paid" && (
                      <span className="text-xs font-semibold text-green-700">
                        Paid ✅
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}