/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  User2,
  Phone,
  MapPin,
  ShoppingBag,
  Loader2,
} from "lucide-react";

// ---------- Toast ----------
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

// ---------- Modal ----------
function ConfirmModal({
  open,
  title = "Confirm",
  description = "Proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close overlay"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 left-1/2 -translate-x-1/2 top-24 w-[92vw] max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#8B5E3C]/10 grid place-items-center">
                  <ShoppingBag size={20} className="text-[#8B5E3C]" />
                </div>

                <div className="flex-1">
                  <p className="text-lg font-extrabold text-base-content">{title}</p>
                  <p className="text-sm text-base-content/60 mt-1">{description}</p>
                </div>

                <button
                  onClick={onClose}
                  className="h-9 w-9 rounded-xl hover:bg-base-200 grid place-items-center"
                  aria-label="Close"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  className="btn flex-1 btn-outline border-base-300 hover:bg-base-200"
                  onClick={onClose}
                  disabled={loading}
                  type="button"
                >
                  {cancelText}
                </button>

                <button
                  className="btn flex-1 border-0 text-white bg-[#8B5E3C] hover:bg-[#A47148]"
                  onClick={onConfirm}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Placing..." : confirmText}
                </button>
              </div>
            </div>

            <div className="h-1 w-full bg-base-200">
              <div className="h-full w-full bg-[#8B5E3C]" />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default function BuyBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [placing, setPlacing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // form state (nicer UX than reading from DOM)
  const [customerName, setCustomerName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (e) {
        console.error(e);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  // keep name updated if user loads late
  useEffect(() => {
    if (user?.displayName && !customerName) setCustomerName(user.displayName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const validate = () => {
    if (!book?._id) return showToast.error("Book not found", "Please go back and try again.");

    if (!user?.email) return showToast.error("Login required", "Please login to place an order.");

    if (!customerName.trim()) return showToast.error("Name required", "Please enter your full name.");

    // basic BD phone validation
    const p = phone.trim();
    const ok = /^01\d{9}$/.test(p);
    if (!ok) return showToast.error("Invalid phone", "Use format: 01XXXXXXXXX");

    if (address.trim().length < 8)
      return showToast.error("Address too short", "Please enter full delivery address.");

    return true;
  };

  const openConfirm = (e) => {
    e.preventDefault();
    const ok = validate();
    if (ok === true) setConfirmOpen(true);
  };

  const placeOrder = async () => {
    if (!book?._id) return;

    const orderPayload = {
      bookId: book._id,
      bookName: book.name,
      bookImage: book.image,
      price: book.price,
      librarianEmail: book.librarianEmail,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      buyerEmail: user?.email,
    };

    try {
      setPlacing(true);
      await axiosSecure.post("/orders", orderPayload);

      showToast.success("Order placed!", "You can track it from My Orders.");
      setConfirmOpen(false);

      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error(err);
      showToast.error("Order failed", err?.response?.data?.message || "Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-base-200 p-8 rounded-3xl shadow text-center">
          <h2 className="text-2xl font-bold text-[#8B5E3C]">Book not found</h2>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2 rounded-xl bg-[#8B5E3C] text-white hover:bg-[#A47148]"
          >
            <ArrowLeft size={16} />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* confirm modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Confirm your order?"
        description={`You are ordering "${book.name}" for ৳ ${book.price}.`}
        confirmText="Yes, Place Order"
        cancelText="Not now"
        loading={placing}
        onClose={() => (placing ? null : setConfirmOpen(false))}
        onConfirm={placeOrder}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="grid lg:grid-cols-[1.1fr_.9fr] gap-6"
      >
        {/* LEFT: Summary Card */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="bg-base-200 rounded-3xl shadow-xl overflow-hidden border border-base-300"
        >
          <div className="p-5 sm:p-6 flex items-center justify-between gap-3">
            <Link
              to={`/books/${book._id}`}
              className="inline-flex items-center gap-2 text-sm text-[#8B5E3C] hover:underline"
            >
              <ArrowLeft size={16} /> Back
            </Link>

            <span className="text-xs px-3 py-1 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] font-semibold">
              Secure Checkout
            </span>
          </div>

          <div className="px-5 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.img
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                src={book.image}
                alt={book.name}
                className="w-full sm:w-44 h-56 sm:h-56 object-cover rounded-2xl border bg-base-100"
              />

              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-[#8B5E3C]">
                  {book.name}
                </h2>
                <p className="text-sm text-base-content/60 mt-1">
                  by <span className="font-semibold">{book.author}</span>
                </p>

                <div className="mt-4 bg-base-100 rounded-2xl p-4 border border-base-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/60">Price</span>
                    <span className="text-lg font-extrabold text-[#8B5E3C]">
                      ৳ {book.price}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-base-content/60">Delivery</span>
                    <span className="text-sm font-semibold">Standard</span>
                  </div>

                  <div className="mt-3 border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-xl font-extrabold text-[#8B5E3C]">
                      ৳ {book.price}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-base-content/60">
                  Your order will appear in <span className="font-semibold">My Orders</span> after confirmation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.05 }}
          className="bg-base-200 rounded-3xl shadow-xl border border-base-300 overflow-hidden"
        >
          <div className="p-5 sm:p-6 border-b border-base-300 bg-base-100">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#8B5E3C]">
              Delivery Details
            </h3>
            <p className="text-sm text-base-content/60 mt-1">
              Please fill in the delivery information carefully.
            </p>
          </div>

          <form onSubmit={openConfirm} className="p-5 sm:p-6 space-y-4">
            {/* Name */}
            <label className="block">
              <span className="text-xs font-semibold text-base-content/60">
                Your Name
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
                <User2 size={16} className="text-[#8B5E3C]" />
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </label>

            {/* Phone */}
            <label className="block">
              <span className="text-xs font-semibold text-base-content/60">
                Phone
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
                <Phone size={16} className="text-[#8B5E3C]" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  inputMode="numeric"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <p className="text-[11px] text-base-content/50 mt-1">
                Example: 01712345678
              </p>
            </label>

            {/* Address */}
            <label className="block">
              <span className="text-xs font-semibold text-base-content/60">
                Address
              </span>
              <div className="mt-1 flex items-start gap-2 rounded-2xl border bg-base-100 px-3 py-2">
                <MapPin size={16} className="text-[#8B5E3C] mt-1" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-transparent outline-none text-sm resize-none"
                  placeholder="Your delivery address"
                />
              </div>
            </label>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={placing}
              type="submit"
              className="w-full btn border-0 bg-[#8B5E3C] text-white hover:bg-[#A47148] rounded-2xl"
            >
              {placing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </span>
              ) : (
                "Confirm Order"
              )}
            </motion.button>

            <div className="text-xs text-base-content/60 text-center pt-1">
              By confirming, you agree to our order policy.
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* toast animations */}
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