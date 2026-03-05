/* eslint-disable no-unused-vars */
// ✅ src/pages/dashboard/Invoices.jsx (RESPONSIVE + DATE FILTER + ANIMATIONS + GORGEOUS TOAST)
import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, RefreshCw, Receipt, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

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

const formatDateTime = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "—";
  }
};

// YYYY-MM-DD from Date
const toYMD = (d) => {
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

const StatusPill = ({ value }) => {
  const cls =
    value === "delivered"
      ? "bg-green-100 text-green-700"
      : value === "shipped"
      ? "bg-blue-100 text-blue-700"
      : value === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
      {value || "—"}
    </span>
  );
};

const PaymentPill = ({ value }) => {
  const cls =
    value === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
      {value || "paid"}
    </span>
  );
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // date filter
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/invoices/my");
      setInvoices(res.data || []);
      // optional nice toast on refresh
      // showToast.success("Invoices updated", "Latest invoices loaded.");
    } catch (err) {
      console.log(err);
      showToast.error("Failed to load invoices", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    if (!selectedDate) return invoices || [];
    return (invoices || []).filter((inv) => toYMD(inv?.date) === selectedDate);
  }, [invoices, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-4 sm:p-6 rounded-2xl shadow-lg">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#8B5E3C]">Invoices</h1>
          <p className="text-sm text-base-content/60 mt-1">
            View your paid invoices and filter by date.
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
            onClick={loadInvoices}
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
                <p className="font-bold text-[#8B5E3C]">Filter invoices</p>
                <button
                  className="h-9 w-9 rounded-xl hover:bg-base-200 grid place-items-center"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-base-content/70">
                  Select date
                </label>
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

      {/* empty */}
      {filteredInvoices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base-content/60 bg-base-100 rounded-2xl p-6"
        >
          {selectedDate ? (
            <p>
              No invoices found on{" "}
              <span className="font-semibold">{selectedDate}</span>.
            </p>
          ) : (
            <p>No invoices found.</p>
          )}
        </motion.div>
      ) : (
        <>
          {/* ✅ Desktop / Tablet Table */}
          <div className="hidden lg:block overflow-x-auto">
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

              <motion.tbody
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {filteredInvoices.map((inv) => (
                  <motion.tr
                    key={inv._id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                    }}
                    className="hover"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={inv.bookImage}
                          alt={inv.bookName}
                          className="w-12 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-semibold">{inv.bookName}</p>
                          {inv.bookAuthor ? (
                            <p className="text-xs text-gray-500">{inv.bookAuthor}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold text-[#8B5E3C]">
                      ৳ {inv.amount ?? inv.price ?? 0}
                    </td>

                    <td>
                      <StatusPill value={inv.orderStatus} />
                    </td>

                    <td>
                      <PaymentPill value={inv.paymentStatus || "paid"} />
                    </td>

                    <td className="text-sm">{inv.paymentId || "—"}</td>

                    <td className="text-sm">{formatDateTime(inv.date)}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>

          {/* ✅ Mobile: Card list */}
          <div className="lg:hidden space-y-3">
            <AnimatePresence>
              {filteredInvoices.map((inv) => (
                <motion.div
                  key={inv._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200"
                >
                  <div className="flex gap-3">
                    <img
                      src={inv.bookImage}
                      alt={inv.bookName}
                      className="w-16 h-20 rounded-xl object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base-content truncate">
                        {inv.bookName}
                      </p>
                      {inv.bookAuthor ? (
                        <p className="text-xs text-base-content/60 truncate">
                          {inv.bookAuthor}
                        </p>
                      ) : null}

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#8B5E3C]">
                          ৳ {inv.amount ?? inv.price ?? 0}
                        </span>
                        <StatusPill value={inv.orderStatus} />
                        <PaymentPill value={inv.paymentStatus || "paid"} />
                      </div>

                      <div className="mt-2 text-xs text-base-content/60 space-y-1">
                        <p className="truncate">
                          <span className="font-semibold">Payment ID:</span>{" "}
                          {inv.paymentId || "—"}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {formatDateTime(inv.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* small footer badge */}
                  <div className="mt-4 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-2 text-sm font-semibold inline-flex items-center gap-2">
                    <Receipt size={16} />
                    Invoice generated
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ✅ toast animations */}
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