/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Search, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

// ----------  toast ----------
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

const safeText = (v) => String(v || "").toLowerCase();

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // search filter (mobile friendly)
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/wishlist/my");
      setItems(res.data || []);
      // showToast.success("Wishlist updated", "Latest wishlist items loaded.");
    } catch (err) {
      console.log(err);
      showToast.error("Failed to load wishlist", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const filteredItems = useMemo(() => {
    const term = safeText(q).trim();
    if (!term) return items || [];
    return (items || []).filter((w) => {
      const hay = `${safeText(w.bookName)} ${safeText(w.bookAuthor)}`;
      return hay.includes(term);
    });
  }, [items, q]);

  const removeItem = async (id) => {
    try {
      setActionId(id);
      await axiosSecure.delete(`/wishlist/${id}`);
      showToast.success("Removed", "Item removed from wishlist.");
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      console.log(err);
      showToast.error("Remove failed", "Please try again.");
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
    <div className="bg-base-200 p-4 sm:p-6 rounded-2xl shadow-lg">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#8B5E3C] flex items-center gap-2">
            <Heart size={20} />
            My Wishlist
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Tap any item to open its Book Details page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* search */}
          <div className="relative flex-1 sm:flex-none min-w-55">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name/author..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <button
            onClick={loadWishlist}
            className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* empty */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl p-6 text-base-content/60"
        >
          {q ? (
            <p>
              No results for <span className="font-semibold">“{q}”</span>.
            </p>
          ) : (
            <p>No wishlist items yet.</p>
          )}
        </motion.div>
      ) : (
        <>
          {/*  Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredItems.map((w) => (
                <motion.div
                  key={w._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-base-100 rounded-2xl p-4 flex gap-4 shadow hover:shadow-xl transition cursor-pointer"
                  onClick={() => navigate(`/books/${w.bookId}`)}
                  whileHover={{ y: -3 }}
                >
                  <img
                    src={w.bookImage}
                    alt={w.bookName}
                    className="w-20 h-28 object-cover rounded-xl"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{w.bookName}</h3>
                    <p className="text-sm text-base-content/60 truncate">{w.bookAuthor}</p>

                    <p className="mt-1 font-semibold text-[#8B5E3C]">৳ {w.price}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(w._id);
                      }}
                      disabled={actionId === w._id}
                      className="mt-3 btn btn-sm bg-red-600 text-white hover:bg-red-700 border-0"
                    >
                      <Trash2 size={16} className="mr-2" />
                      {actionId === w._id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile list (cards) */}
          <div className="md:hidden space-y-3">
            <AnimatePresence>
              {filteredItems.map((w) => (
                <motion.div
                  key={w._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200"
                >
                  <div
                    className="flex gap-3 cursor-pointer"
                    onClick={() => navigate(`/books/${w.bookId}`)}
                  >
                    <img
                      src={w.bookImage}
                      alt={w.bookName}
                      className="w-16 h-20 rounded-xl object-cover"
                      loading="lazy"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{w.bookName}</p>
                      <p className="text-xs text-base-content/60 truncate">{w.bookAuthor}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold text-[#8B5E3C]">৳ {w.price}</span>
                        <span className="text-xs text-base-content/50">Tap to open</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(w._id);
                    }}
                    disabled={actionId === w._id}
                    className="mt-3 w-full btn btn-sm bg-red-600 text-white hover:bg-red-700 border-0"
                  >
                    <Trash2 size={16} className="mr-2" />
                    {actionId === w._id ? "Removing..." : "Remove"}
                  </button>
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