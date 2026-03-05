import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function Payment() {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load order");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePay = async () => {
    try {
      setPaying(true);
      await axiosSecure.patch(`/orders/${id}/pay`);
      toast.success("Payment successful ✅");
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#8B5E3C]">Payment</h2>

      <div className="mt-4 space-y-2">
        <p className="font-semibold">
          Book: <span className="font-normal">{order.bookName}</span>
        </p>
        <p className="font-semibold">
          Amount: <span className="font-normal">৳ {order.price}</span>
        </p>
        <p className="font-semibold">
          Status: <span className="font-normal">{order.status}</span>
        </p>
        <p className="font-semibold">
          Payment: <span className="font-normal">{order.paymentStatus}</span>
        </p>
      </div>

      <button
        disabled={paying || order.paymentStatus === "paid"}
        onClick={handlePay}
        className="mt-6 w-full bg-[#8B5E3C] text-white py-2 rounded-md font-medium hover:bg-[#A47148] transition"
      >
        {order.paymentStatus === "paid"
          ? "Already Paid"
          : paying
          ? "Processing..."
          : "Pay Now"}
      </button>
    </div>
  );
}