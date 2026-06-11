import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  RefreshCw,
  CreditCard,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { OrderSkeleton } from "../../components/ui/Skeleton";

// ---------- Pretty toast helpers ----------
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
      { duration: 3000 }
    ),
};

// FIXED: Safe date formatting
const formatDateTime = (d) => {
  if (!d) return "—";
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString();
  } catch {
    return "—";
  }
};

// YYYY-MM-DD from Date - FIXED
const toYMD = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
};

const StatusPill = ({ value }) => {
  const cls =
    value === "delivered"
      ? "bg-green-100 text-green-700"
      : value === "shipped"
      ? "bg-blue-100 text-blue-700"
      : value === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>{value || "pending"}</span>;
};

const PaymentPill = ({ value }) => {
  const cls = value === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";
  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>{value || "unpaid"}</span>;
};

// Smooth confirm modal
function ConfirmModal({ open, title, message, confirmText, cancelText, tone = "danger", onConfirm, onClose }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-base-100 rounded-2xl shadow-2xl p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-[#8B5E3C] text-lg">{title}</p>
            <p className="text-sm text-base-content/70 mt-1">{message}</p>
          </div>
          <button
            className="h-9 w-9 rounded-xl hover:bg-base-200 grid place-items-center"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className={`btn flex-1 border-0 text-white ${
              tone === "success"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>

          <button
            className="btn flex-1 btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // date filter
  const [selectedDate, setSelectedDate] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // confirm modal state
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: null, // "pay" | "cancel"
    id: null,
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/orders/my");
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
      showToast.error("Failed to load orders", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders || [];
    return (orders || []).filter((o) => toYMD(o?.orderDate) === selectedDate);
  }, [orders, selectedDate]);

  // OPEN modal 
  const askCancel = (id) => setConfirmState({ open: true, type: "cancel", id });
  const askPay = (id) => setConfirmState({ open: true, type: "pay", id });

  const closeConfirm = () => setConfirmState({ open: false, type: null, id: null });

  const runConfirmedAction = async () => {
    const { type, id } = confirmState;
    if (!type || !id) return;

    closeConfirm();

    if (type === "cancel") {
      try {
        setActionId(id);
        await axiosSecure.patch(`/orders/${id}/cancel`);
        showToast.success("Order cancelled", "Your order was cancelled successfully.");
        await loadOrders();
      } catch (err) {
        console.log(err);
        showToast.error("Cancel failed", err?.response?.data?.message || "Try again.");
      } finally {
        setActionId(null);
      }
    }

    if (type === "pay") {
      try {
        setActionId(id);
        await axiosSecure.patch(`/orders/${id}/pay`);
        showToast.success("Payment completed", "Invoice has been created.");
        await loadOrders();
      } catch (err) {
        console.log(err);
        showToast.error("Payment failed", err?.response?.data?.message || "Try again.");
      } finally {
        setActionId(null);
      }
    }
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="bg-base-200 p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <div className="h-8 bg-base-300 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-base-300 rounded w-48 mt-2 animate-pulse"></div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
            <div className="h-10 bg-base-300 rounded-xl w-48 animate-pulse"></div>
            <div className="h-10 bg-base-300 rounded-xl w-24 animate-pulse"></div>
          </div>
        </div>
        <OrderSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-4 sm:p-6 rounded-2xl shadow-lg">
      {/* confirm modal */}
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.type === "pay" ? "Confirm Payment?" : "Cancel Order?"}
        message={
          confirmState.type === "pay"
            ? "Do you want to complete the payment for this order?"
            : "This will cancel the order (only pending & unpaid orders can be cancelled)."
        }
        confirmText={confirmState.type === "pay" ? "Yes, Pay Now" : "Yes, Cancel"}
        cancelText="No"
        tone={confirmState.type === "pay" ? "success" : "danger"}
        onConfirm={runConfirmedAction}
        onClose={closeConfirm}
      />

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#8B5E3C]">My Orders</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Filter by date, pay, or cancel pending orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* desktop date filter */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* mobile filter button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="sm:hidden btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
          >
            <CalendarDays size={16} className="mr-2" />
            Filter
          </button>

          <button
            onClick={loadOrders}
            className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* mobile filter modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close overlay"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="fixed z-50 left-1/2 -translate-x-1/2 top-24 w-[92vw] max-w-md bg-base-100 rounded-2xl shadow-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#8B5E3C]">Filter orders</p>
                <button
                  className="h-9 w-9 rounded-xl hover:bg-base-200 grid place-items-center"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-base-content/70">Select date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-xl border bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="btn flex-1 bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply
                </button>
                <button
                  className="btn flex-1 btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
                  onClick={() => {
                    setSelectedDate("");
                    setMobileFilterOpen(false);
                  }}
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Results count */}
      {filteredOrders.length > 0 && (
        <div className="mb-3 text-sm text-base-content/50">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
          {selectedDate && ` for ${selectedDate}`}
        </div>
      )}

      {/* empty */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base-content/60 bg-base-100 rounded-2xl p-6 text-center"
        >
          {selectedDate ? (
            <p>
              No orders found on <span className="font-semibold">{selectedDate}</span>.
            </p>
          ) : (
            <div>
              <p>No orders found.</p>
              <p className="text-sm mt-2">Browse books and place your first order!</p>
            </div>
          )}
        </motion.div>
      ) : (
        <>
          {/* Desktop / Tablet Table */}
          <div className="hidden lg:block overflow-x-auto">
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
                {filteredOrders.map((o, idx) => (
                  <motion.tr
                    key={o._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    className="border-b border-base-200 hover:bg-base-100/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={o.bookImage}
                          alt={o.bookName}
                          className="w-12 h-16 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-semibold">{o.bookName || o.bookTitle || "—"}</p>
                          <p className="text-xs text-gray-500">{o.librarianEmail || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-[#8B5E3C]">৳ {o.price ?? 0}</td>
                    <td><StatusPill value={o.status} /></td>
                    <td><PaymentPill value={o.paymentStatus} /></td>
                    <td className="text-sm">{formatDateTime(o.orderDate)}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {o.paymentStatus !== "paid" && o.status !== "cancelled" && (
                          <button
                            onClick={() => askPay(o._id)}
                            disabled={actionId === o._id}
                            className="btn btn-sm bg-green-600 text-white hover:bg-green-700 border-0"
                          >
                            <CreditCard size={16} className="mr-1" />
                            {actionId === o._id ? "..." : "Pay"}
                          </button>
                        )}

                        {o.status === "pending" && o.paymentStatus !== "paid" && (
                          <button
                            onClick={() => askCancel(o._id)}
                            disabled={actionId === o._id}
                            className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-0"
                          >
                            <XCircle size={16} className="mr-1" />
                            {actionId === o._id ? "..." : "Cancel"}
                          </button>
                        )}

                        {o.paymentStatus === "paid" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={14} /> Paid
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            <AnimatePresence>
              {filteredOrders.map((o, idx) => (
                <motion.div
                  key={o._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, delay: idx * 0.02 }}
                  className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200"
                >
                  <div className="flex gap-3">
                    <img src={o.bookImage} alt={o.bookName} className="w-16 h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{o.bookName || o.bookTitle || "—"}</p>
                      <p className="text-xs text-base-content/60 truncate">{o.librarianEmail || ""}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#8B5E3C]">৳ {o.price ?? 0}</span>
                        <StatusPill value={o.status} />
                        <PaymentPill value={o.paymentStatus} />
                      </div>

                      <p className="mt-2 text-xs text-base-content/60">{formatDateTime(o.orderDate)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {o.paymentStatus !== "paid" && o.status !== "cancelled" && (
                      <button
                        onClick={() => askPay(o._id)}
                        disabled={actionId === o._id}
                        className="btn btn-sm flex-1 bg-green-600 text-white hover:bg-green-700 border-0"
                      >
                        <CreditCard size={16} className="mr-1" />
                        {actionId === o._id ? "Processing..." : "Pay"}
                      </button>
                    )}

                    {o.status === "pending" && o.paymentStatus !== "paid" && (
                      <button
                        onClick={() => askCancel(o._id)}
                        disabled={actionId === o._id}
                        className="btn btn-sm flex-1 bg-red-600 text-white hover:bg-red-700 border-0"
                      >
                        <XCircle size={16} className="mr-1" />
                        {actionId === o._id ? "Processing..." : "Cancel"}
                      </button>
                    )}

                    {o.paymentStatus === "paid" && (
                      <div className="flex-1 rounded-xl bg-green-50 text-green-700 px-3 py-2 text-sm font-semibold inline-flex items-center gap-2 justify-center">
                        <CheckCircle2 size={16} />
                        Paid ✅
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* toast animations */}
      <style>{`
        @keyframes toastbar {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }
        .animate-enter { animation: enter 200ms ease-out; }
        .animate-leave { animation: leave 160ms ease-in forwards; }
        @keyframes enter {
          from { opacity: 0; transform: translateY(8px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes leave {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(6px) scale(.98); }
        }
      `}</style>
    </div>
  );
}