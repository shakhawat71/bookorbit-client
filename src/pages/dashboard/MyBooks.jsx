/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  RefreshCw,
  Pencil,
  BadgeCheck,
  BadgeX,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// ----------toast----------
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

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // UX
  const [q, setQ] = useState("");
  const [view, setView] = useState("table"); // "table" | "grid"

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/books/mine");
      setBooks(res.data || []);
      // showToast.success("Updated", "Your books list has been refreshed.");
    } catch (error) {
      console.log(error);
      showToast.error("Failed to load books", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    const term = safeText(q).trim();
    if (!term) return books || [];
    return (books || []).filter((b) => {
      const hay = `${safeText(b.name)} ${safeText(b.author)} ${safeText(b.status)}`;
      return hay.includes(term);
    });
  }, [books, q]);

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
            <BookOpen size={20} />
            My Books
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Manage your uploaded books. Edit any book anytime.
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
              placeholder="Search by name/author/status..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          {/* view toggle */}
          <div className="join">
            <button
              type="button"
              onClick={() => setView("table")}
              className={`btn btn-sm join-item ${
                view === "table"
                  ? "bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                  : "btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
              }`}
              title="Table view"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`btn btn-sm join-item ${
                view === "grid"
                  ? "bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                  : "btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
              }`}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          {/* refresh */}
          <button
            onClick={fetchBooks}
            className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* empty */}
      {filtered.length === 0 ? (
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
            <p>No books added yet.</p>
          )}
        </motion.div>
      ) : (
        <>
          {/* ================== TABLE (desktop) ================== */}
          {view === "table" && (
            <div className="hidden lg:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-[#8B5E3C] text-white">
                    <th>Book</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-right">Edit</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {filtered.map((book) => (
                      <motion.tr
                        key={book._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.22 }}
                        className="hover"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <img
                              src={book.image}
                              alt={book.name}
                              className="w-12 h-16 object-cover rounded-xl"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold truncate max-w-[320px]">
                                {book.name}
                              </p>
                              <p className="text-xs text-base-content/60">
                                ID: {String(book._id).slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="text-sm">{book.author}</td>

                        <td className="font-semibold text-[#8B5E3C]">
                          ৳ {book.price ?? 0}
                        </td>

                        <td>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              book.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {book.status === "published" ? (
                              <BadgeCheck size={16} />
                            ) : (
                              <BadgeX size={16} />
                            )}
                            {book.status}
                          </span>
                        </td>

                        <td className="text-right">
                          <Link
                            to={`/dashboard/edit-book/${book._id}`}
                            className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                          >
                            <Pencil size={16} className="mr-2" />
                            Edit
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* ================== GRID (all screens) ================== */}
          {view === "grid" && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map((b) => (
                  <motion.div
                    key={b._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ y: -3 }}
                    className="bg-base-100 rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={b.image}
                        alt={b.name}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            b.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {b.status === "published" ? (
                            <BadgeCheck size={14} />
                          ) : (
                            <BadgeX size={14} />
                          )}
                          {b.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold truncate">{b.name}</h3>
                      <p className="text-sm text-base-content/60 truncate">
                        {b.author}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="font-semibold text-[#8B5E3C]">
                          ৳ {b.price ?? 0}
                        </p>
                        <Link
                          to={`/dashboard/edit-book/${b._id}`}
                          className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                        >
                          <Pencil size={16} className="mr-2" />
                          Edit
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ================== MOBILE (table-like cards) ================== */}
          {view === "table" && (
            <div className="lg:hidden space-y-3">
              <AnimatePresence>
                {filtered.map((b) => (
                  <motion.div
                    key={b._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200"
                  >
                    <div className="flex gap-3">
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-16 h-20 rounded-xl object-cover"
                        loading="lazy"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{b.name}</p>
                        <p className="text-xs text-base-content/60 truncate">
                          {b.author}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[#8B5E3C]">
                            ৳ {b.price ?? 0}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              b.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {b.status === "published" ? (
                              <BadgeCheck size={14} />
                            ) : (
                              <BadgeX size={14} />
                            )}
                            {b.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/dashboard/edit-book/${b._id}`}
                      className="mt-3 w-full btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit Book
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
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