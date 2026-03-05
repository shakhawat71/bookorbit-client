/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Truck,
  PackageCheck,
  XCircle,
  CalendarDays,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
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

// ---------- helpers ----------
const formatDateTime = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "—";
  }
};

const formatDateOnly = (d) => {
  try {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
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

const nextStatus = (status) => {
  if (status === "pending") return "shipped";
  if (status === "shipped") return "delivered";
  return status;
};

const canMoveNext = (status) => status === "pending" || status === "shipped";

// ---------- Custom Confirm Modal ----------
function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
  tone = "danger", // "danger" | "primary"
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
                <div
                  className={[
                    "h-11 w-11 rounded-2xl grid place-items-center",
                    tone === "danger" ? "bg-rose-50" : "bg-[#8B5E3C]/10",
                  ].join(" ")}
                >
                  <AlertTriangle
                    size={20}
                    className={tone === "danger" ? "text-rose-600" : "text-[#8B5E3C]"}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-lg font-extrabold text-base-content">{title}</p>
                  <p className="text-sm text-base-content/60 mt-1 whitespace-pre-line">
                    {description}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="h-9 w-9 rounded-xl hover:bg-base-200 grid place-items-center"
                  aria-label="Close"
                  disabled={loading}
                >
                  <X size={18} />
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
                  className={[
                    "btn flex-1 border-0 text-white",
                    tone === "danger"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-[#8B5E3C] hover:bg-[#A47148]",
                  ].join(" ")}
                  onClick={onConfirm}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Please wait..." : confirmText}
                </button>
              </div>
            </div>

            <div className="h-1 w-full bg-base-200">
              <div
                className={[
                  "h-full w-full",
                  tone === "danger" ? "bg-rose-400" : "bg-[#8B5E3C]",
                ].join(" ")}
              />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // filters
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd

  // cancel modal state
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null); // order object

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/librarian/orders");
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders || []).filter((o) => {
      const matchesQuery =
        !q ||
        String(o?.bookName || "").toLowerCase().includes(q) ||
        String(o?.customerName || "").toLowerCase().includes(q) ||
        String(o?.userEmail || "").toLowerCase().includes(q) ||
        String(o?.phone || "").toLowerCase().includes(q);

      const matchesDate = !date || formatDateOnly(o?.orderDate) === date;

      return matchesQuery && matchesDate;
    });
  }, [orders, query, date]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setActionId(orderId);
      await axiosSecure.patch(`/librarian/orders/${orderId}/status`, { status: newStatus });

      showToast.success("Updated!", `Order marked as ${newStatus}.`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.log(err);
      showToast.error("Update failed", err?.response?.data?.message || "Try again.");
    } finally {
      setActionId(null);
    }
  };

  // open modal
  const openCancelModal = (order) => {
    setCancelTarget(order);
    setCancelOpen(true);
  };

  
  const confirmCancel = async () => {
    if (!cancelTarget?._id) return;

    try {
      setActionId(cancelTarget._id);
      await axiosSecure.patch(`/librarian/orders/${cancelTarget._id}/status`, {
        status: "cancelled",
      });

      showToast.success("Cancelled", "Order has been cancelled.");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === cancelTarget._id ? { ...o, status: "cancelled" } : o
        )
      );

      setCancelOpen(false);
      setCancelTarget(null);
    } catch (err) {
      console.log(err);
      showToast.error("Cancel failed", err?.response?.data?.message || "Try again.");
    } finally {
      setActionId(null);
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
    <div className="bg-base-200 p-4 sm:p-6 rounded-3xl shadow-lg">
      {/* Cancel modal */}
      <ConfirmModal
        open={cancelOpen}
        title="Cancel this order?"
        description={
          cancelTarget
            ? `This will mark the order as cancelled.\n\nBook: ${cancelTarget.bookName || "—"}\nCustomer: ${
                cancelTarget.customerName || "—"
              }`
            : "This action cannot be undone."
        }
        confirmText="Yes, Cancel"
        cancelText="No"
        loading={!!(cancelTarget && actionId === cancelTarget._id)}
        onClose={() => {
          if (cancelTarget && actionId === cancelTarget._id) return; // don't close while busy
          setCancelOpen(false);
          setCancelTarget(null);
        }}
        onConfirm={confirmCancel}
        tone="danger"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B5E3C]">
            Orders
          </h1>
          <p className="text-sm text-base-content/60">Manage orders for your books.</p>
        </div>

        <button
          onClick={loadOrders}
          className="btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
        >
          <RefreshCw size={16} className="mr-1" />
          Refresh
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="bg-base-100 border border-base-300 rounded-3xl p-4 sm:p-5 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="relative">
            <span className="text-xs font-semibold text-base-content/60">
              Search (book / customer / email / phone)
            </span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
              <Search size={16} className="text-[#8B5E3C]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to filter…"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </label>

          <label className="relative">
            <span className="text-xs font-semibold text-base-content/60">
              Filter by date
            </span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
              <CalendarDays size={16} className="text-[#8B5E3C]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDate("");
              }}
              className="btn btn-sm w-full md:w-auto border border-base-300 hover:bg-base-200"
            >
              Clear Filters
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-base-content/60">
              <AlertTriangle size={14} className="text-[#8B5E3C]" />
              <span>{filtered.length} result(s)</span>
            </div>
          </div>
        </div>

        <div className="mt-3 md:hidden text-xs text-base-content/60">
          {filtered.length} result(s)
        </div>
      </motion.div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-base-content/60">
          No orders found.
        </motion.p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid gap-4 md:hidden">
            <AnimatePresence>
              {filtered.map((o, idx) => {
                const busy = actionId === o._id;
                const status = o.status || "pending";
                const paymentStatus = o.paymentStatus || "unpaid";
                const moveNext = canMoveNext(status);
                const next = nextStatus(status);

                return (
                  <motion.div
                    key={o._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.22, delay: idx * 0.02 }}
                    className="bg-base-100 border border-base-300 rounded-3xl p-4 shadow-sm"
                  >
                    <div className="flex gap-3">
                      {o.bookImage ? (
                        <img
                          src={o.bookImage}
                          alt={o.bookName || "Book"}
                          className="w-14 h-20 object-cover rounded-2xl border"
                        />
                      ) : null}

                      <div className="flex-1">
                        <p className="font-bold">{o.bookName || "—"}</p>
                        <p className="text-sm text-base-content/60">৳ {o.bookPrice ?? "—"}</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={["px-3 py-1 rounded-full text-xs font-semibold", badgeClass(status)].join(" ")}>
                            {status}
                          </span>
                          <span className={["px-3 py-1 rounded-full text-xs font-semibold", payBadgeClass(paymentStatus)].join(" ")}>
                            {paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <p className="font-semibold">{o.customerName || "—"}</p>
                      <p className="text-base-content/60">{o.userEmail || "—"}</p>
                      {o.phone ? <p className="text-base-content/60">{o.phone}</p> : null}
                      <p className="text-xs text-base-content/60 mt-1">{formatDateTime(o.orderDate)}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {moveNext && status !== "cancelled" && (
                        <button
                          disabled={busy}
                          onClick={() => handleUpdateStatus(o._id, next)}
                          className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                        >
                          {status === "pending" ? (
                            <Truck size={16} className="mr-1" />
                          ) : (
                            <PackageCheck size={16} className="mr-1" />
                          )}
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
                          onClick={() => openCancelModal(o)}
                          className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-0"
                        >
                          <XCircle size={16} className="mr-1" />
                          {busy ? "Working..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
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
                {filtered.map((o, idx) => {
                  const busy = actionId === o._id;
                  const status = o.status || "pending";
                  const paymentStatus = o.paymentStatus || "unpaid";
                  const moveNext = canMoveNext(status);
                  const next = nextStatus(status);

                  return (
                    <motion.tr
                      key={o._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: idx * 0.02 }}
                      className="hover"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          {o.bookImage ? (
                            <img
                              src={o.bookImage}
                              alt={o.bookName || "Book"}
                              className="w-12 h-16 object-cover rounded-xl"
                            />
                          ) : null}

                          <div>
                            <p className="font-semibold">{o.bookName || "—"}</p>
                            <p className="text-sm text-gray-500">৳ {o.bookPrice ?? "—"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="text-sm">
                        <p className="font-medium">{o.customerName || "—"}</p>
                        <p className="text-gray-600">{o.userEmail || "—"}</p>
                        <p className="text-gray-600">{o.phone || ""}</p>
                      </td>

                      <td className="text-sm">{formatDateTime(o.orderDate)}</td>

                      <td>
                        <span className={["px-3 py-1 rounded-full text-sm font-medium", badgeClass(status)].join(" ")}>
                          {status}
                        </span>
                      </td>

                      <td>
                        <span className={["px-3 py-1 rounded-full text-sm font-medium", payBadgeClass(paymentStatus)].join(" ")}>
                          {paymentStatus}
                        </span>
                      </td>

                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {moveNext && status !== "cancelled" && (
                            <button
                              disabled={busy}
                              onClick={() => handleUpdateStatus(o._id, next)}
                              className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                            >
                              {status === "pending" ? (
                                <Truck size={16} className="mr-1" />
                              ) : (
                                <PackageCheck size={16} className="mr-1" />
                              )}
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
                              onClick={() => openCancelModal(o)}
                              className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-0"
                            >
                              <XCircle size={16} className="mr-1" />
                              {busy ? "Working..." : "Cancel"}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

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