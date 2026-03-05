/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";

// ---------- toast ----------
const showToast = {
  success: (title, desc) =>
    toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-[92vw] max-w-sm rounded-2xl border border-emerald-200 bg-white shadow-xl ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="p-4 flex gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 grid place-items-center">
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-emerald-700">{title}</p>
              {desc ? <p className="text-sm text-gray-600 mt-0.5">{desc}</p> : null}
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="h-8 w-8 rounded-xl hover:bg-gray-100 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="h-1 w-full bg-emerald-100 overflow-hidden rounded-b-2xl">
            <div className="h-full w-full bg-emerald-500 animate-[toastbar_3s_linear_forwards]" />
          </div>
        </div>
      ),
      { duration: 3000 }
    ),

  error: (title, desc) =>
    toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-[92vw] max-w-sm rounded-2xl border border-rose-200 bg-white shadow-xl ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="p-4 flex gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 grid place-items-center">
              <XCircle className="text-rose-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-rose-700">{title}</p>
              {desc ? <p className="text-sm text-gray-600 mt-0.5">{desc}</p> : null}
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="h-8 w-8 rounded-xl hover:bg-gray-100 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="h-1 w-full bg-rose-100 overflow-hidden rounded-b-2xl">
            <div className="h-full w-full bg-rose-500 animate-[toastbar_3s_linear_forwards]" />
          </div>
        </div>
      ),
      { duration: 3200 }
    ),
};

const formatDateTime = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "—";
  }
};

export default function Payment() {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/orders/${id}`);
        if (mounted) setOrder(res.data);
      } catch (err) {
        console.log(err);
        showToast.error("Failed to load order", "Please try again.");
        if (mounted) setOrder(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const alreadyPaid = useMemo(
    () => order?.paymentStatus === "paid",
    [order?.paymentStatus]
  );

  const canPay = useMemo(() => {
    if (!order) return false;
    if (order?.status === "cancelled") return false;
    if (alreadyPaid) return false;
    return true;
  }, [order, alreadyPaid]);

  const handlePay = async () => {
    if (!canPay) return;

    const ok = window.confirm("Confirm payment for this order?");
    if (!ok) return;

    try {
      setPaying(true);
      await axiosSecure.patch(`/orders/${id}/pay`);

      showToast.success("Payment successful!", "Your invoice is now available.");
      navigate("/dashboard/invoices");
    } catch (err) {
      console.log(err);
      showToast.error("Payment failed", err?.response?.data?.message || "Try again.");
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
    <div className="relative">
      {/* background blobs */}
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-[#8B5E3C] opacity-10 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-[#A47148] opacity-10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="max-w-2xl mx-auto bg-base-200 p-4 sm:p-6 rounded-3xl shadow-xl border border-base-300 relative"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] text-sm font-semibold">
              <ShieldCheck size={16} />
              Secure checkout (simulation)
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#8B5E3C] flex items-center gap-2">
              <CreditCard size={24} />
              Payment
              <Sparkles size={18} className="opacity-70" />
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Review order info and confirm payment.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm border border-base-300 hover:bg-base-100"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
        </div>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mt-6 bg-base-100 rounded-3xl border border-base-300 p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={order.bookImage}
              alt={order.bookName}
              className="w-full sm:w-28 h-44 sm:h-36 object-cover rounded-2xl border"
            />

            <div className="flex-1">
              <p className="text-xs font-semibold text-base-content/60">
                BOOK
              </p>
              <p className="text-lg font-bold">{order.bookName || "—"}</p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-base-200 p-3">
                  <p className="text-xs text-base-content/60 font-semibold">
                    Amount
                  </p>
                  <p className="text-base font-extrabold text-[#8B5E3C]">
                    ৳ {order.price ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-base-200 p-3">
                  <p className="text-xs text-base-content/60 font-semibold">
                    Order Date
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDateTime(order.orderDate)}
                  </p>
                </div>

                <div className="rounded-2xl bg-base-200 p-3">
                  <p className="text-xs text-base-content/60 font-semibold">
                    Status
                  </p>
                  <span
                    className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status || "pending"}
                  </span>
                </div>

                <div className="rounded-2xl bg-base-200 p-3">
                  <p className="text-xs text-base-content/60 font-semibold">
                    Payment
                  </p>
                  <span
                    className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.paymentStatus || "unpaid"}
                  </span>
                </div>
              </div>

              {order?.librarianEmail ? (
                <p className="mt-3 text-xs text-base-content/60">
                  Sold by: <span className="font-semibold">{order.librarianEmail}</span>
                </p>
              ) : null}
            </div>
          </div>

          {/* Warnings */}
          <AnimatePresence>
            {!canPay && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-4 rounded-2xl border border-base-300 bg-base-200 p-4"
              >
                <p className="text-sm font-semibold text-base-content">
                  {alreadyPaid
                    ? "This order is already paid."
                    : order?.status === "cancelled"
                    ? "This order was cancelled — payment is disabled."
                    : "Payment is currently unavailable for this order."}
                </p>
                <p className="text-xs text-base-content/60 mt-1">
                  If you need help, contact support.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            disabled={!canPay || paying}
            onClick={handlePay}
            className={`btn border-0 rounded-2xl text-white ${
              !canPay
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#8B5E3C] hover:bg-[#A47148]"
            }`}
          >
            {paying ? "Processing..." : alreadyPaid ? "Already Paid" : "Pay Now"}
          </button>

          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="btn rounded-2xl border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
          >
            <Receipt size={18} className="mr-1" />
            View Invoices
          </button>
        </div>
      </motion.div>

      {/* toast styles */}
      <style>{`
        @keyframes toastbar { from { transform: translateX(-100%); } to { transform: translateX(0%); } }
        .animate-enter { animation: enter 200ms ease-out; }
        .animate-leave { animation: leave 160ms ease-in forwards; }
        @keyframes enter { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes leave { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(6px) scale(.98); } }
      `}</style>
    </div>
  );
}