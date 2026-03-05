import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/invoices/my");
        setInvoices(res.data || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

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
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        Invoices
      </h1>

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-[#8B5E3C] text-white">
                <th>Book</th>
                <th>Price</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Payment ID</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.bookImage}
                        alt={inv.bookName}
                        className="w-12 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{inv.bookName}</p>
                        {inv.bookAuthor && (
                          <p className="text-xs text-gray-500">
                            {inv.bookAuthor}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="font-semibold text-[#8B5E3C]">
                    ৳ {inv.amount ?? inv.price ?? 0}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inv.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : inv.orderStatus === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : inv.orderStatus === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {inv.orderStatus || "—"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inv.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inv.paymentStatus || "paid"}
                    </span>
                  </td>

                  <td className="text-sm">{inv.paymentId || "—"}</td>

                  <td className="text-sm">{formatDate(inv.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}