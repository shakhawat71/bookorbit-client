
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function Invoices() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/payments/my");
        setPayments(res.data || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

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
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">Invoices</h1>

      {payments.length === 0 ? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-[#8B5E3C] text-white">
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="hover">
                  <td className="font-medium">{p.paymentId || "—"}</td>
                  <td className="text-sm">{String(p.orderId || "—")}</td>
                  <td className="font-semibold">৳ {p.amount ?? 0}</td>
                  <td className="text-sm">{formatDate(p.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}