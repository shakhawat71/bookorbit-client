/* eslint-disable no-unused-vars */
// ✅ src/pages/dashboard/ManageBooks.jsx (SaaS-style Admin Panel - Responsive + Animated + Gorgeous Toast + Modal Confirm + Filters)
import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  RefreshCw,
  Search,
  Filter,
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
  BadgeCheck,
  EyeOff,
  Trash2,
  Mail,
  DollarSign,
} from "lucide-react";

// ---------- Gorgeous toast helpers ----------
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

// ---------- Confirm Modal (NO window.confirm) ----------
function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  danger = false,
  loading = false,
  onClose,
  onConfirm,
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
            className="fixed z-50 left-1/2 -translate-x-1/2 top-24 w-[92vw] max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.22 }}
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold text-[#8B5E3C]">{title}</p>
                  {description ? (
                    <p className="text-sm text-base-content/60 mt-1">{description}</p>
                  ) : null}
                </div>
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-2xl hover:bg-base-200 grid place-items-center"
                  aria-label="Close"
                >
                  <X />
                </button>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button onClick={onClose} className="btn btn-outline rounded-2xl" disabled={loading}>
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`btn rounded-2xl border-0 ${
                    danger ? "bg-red-600 text-white hover:bg-red-700" : "bg-[#8B5E3C] text-white hover:bg-[#A47148]"
                  }`}
                >
                  {loading ? "Please wait..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

// ---------- helpers ----------
const normalize = (s) => String(s || "").toLowerCase().trim();

const statusPill = (status) =>
  status === "published"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // filters
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | published | unpublished
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  // confirmState: { type: "delete"|"toggle", bookId, name, currentStatus, newStatus }

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/books");
      setBooks(res.data || []);
    } catch (err) {
      console.log(err);
      showToast.error("Failed to load books", err?.response?.data?.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return (books || []).filter((b) => {
      const matchesStatus = statusFilter === "all" || (b?.status || "unpublished") === statusFilter;
      if (!matchesStatus) return false;

      if (!q) return true;

      const name = normalize(b?.name);
      const author = normalize(b?.author);
      const email = normalize(b?.librarianEmail);
      return name.includes(q) || author.includes(q) || email.includes(q);
    });
  }, [books, query, statusFilter]);

  const stats = useMemo(() => {
    const all = books?.length || 0;
    const pub = (books || []).filter((b) => b?.status === "published").length;
    const unpub = all - pub;
    return { all, pub, unpub };
  }, [books]);

  const openToggleModal = (bookId, currentStatus, name) => {
    const newStatus = currentStatus === "published" ? "unpublished" : "published";
    setConfirmState({ type: "toggle", bookId, name, currentStatus, newStatus });
    setConfirmOpen(true);
  };

  const openDeleteModal = (bookId, name) => {
    setConfirmState({ type: "delete", bookId, name });
    setConfirmOpen(true);
  };

  const doToggleStatus = async (bookId, newStatus) => {
    try {
      setActionId(bookId);
      await axiosSecure.patch(`/admin/books/${bookId}/status`, { status: newStatus });

      setBooks((prev) => prev.map((b) => (b._id === bookId ? { ...b, status: newStatus } : b)));
      showToast.success("Updated", `Book marked as ${newStatus}.`);
    } catch (err) {
      console.log(err);
      showToast.error("Update failed", err?.response?.data?.message || "Try again.");
    } finally {
      setActionId(null);
    }
  };

  const doDeleteBook = async (bookId) => {
    try {
      setActionId(bookId);
      await axiosSecure.delete(`/books/${bookId}`);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      showToast.success("Deleted", "Book removed successfully.");
    } catch (err) {
      console.log(err);
      showToast.error("Delete failed", err?.response?.data?.message || "Try again.");
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

  const confirmTitle =
    confirmState?.type === "delete"
      ? "Delete this book?"
      : confirmState?.type === "toggle"
      ? "Change publish status?"
      : "";

  const confirmDesc =
    confirmState?.type === "delete"
      ? `This will delete the book "${confirmState?.name || "—"}". (Orders for this book will also be deleted in your backend logic.)`
      : confirmState?.type === "toggle"
      ? `Book: "${confirmState?.name || "—"}"\nStatus: ${confirmState?.currentStatus} → ${confirmState?.newStatus}`
      : "";

  const confirmDanger = confirmState?.type === "delete" || confirmState?.newStatus === "unpublished";

  return (
    <div className="bg-base-200 p-4 sm:p-6 rounded-3xl shadow-lg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B5E3C]">Manage Books</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Admin controls: publish/unpublish and delete books.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="sm:hidden btn btn-sm btn-outline rounded-2xl"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>

          <button
            onClick={loadBooks}
            className="btn btn-sm rounded-2xl bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {[
          { label: "Total Books", value: stats.all, icon: <BookOpen size={18} /> },
          { label: "Published", value: stats.pub, icon: <BadgeCheck size={18} /> },
          { label: "Unpublished", value: stats.unpub, icon: <EyeOff size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-base-100 rounded-3xl border border-base-300 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center">
                {s.icon}
              </div>
              <p className="text-2xl font-extrabold">{s.value}</p>
            </div>
            <p className="mt-2 text-xs text-base-content/60 font-semibold">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters (desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
        className="mt-5 hidden sm:block bg-base-100 rounded-3xl border border-base-300 p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="relative">
            <span className="text-xs font-semibold text-base-content/60">Search (name / author / librarian email)</span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
              <Search size={16} className="text-[#8B5E3C]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search…"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </label>

          <label className="relative">
            <span className="text-xs font-semibold text-base-content/60">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 w-full rounded-2xl border bg-base-100 px-3 py-2 text-sm outline-none"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
              }}
              className="btn btn-sm w-full md:w-auto rounded-2xl border border-base-300 hover:bg-base-200"
            >
              Clear
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-base-content/60">
              <Mail size={14} className="text-[#8B5E3C]" />
              <span>{filtered.length} result(s)</span>
            </div>
          </div>
        </div>

        <div className="mt-3 md:hidden text-xs text-base-content/60">{filtered.length} result(s)</div>
      </motion.div>

      {/* Mobile filters modal */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close overlay"
            />
            <motion.div
              className="fixed z-50 left-1/2 -translate-x-1/2 top-24 w-[92vw] max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.22 }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-[#8B5E3C]">Filters</p>
                  <button
                    className="h-10 w-10 rounded-2xl hover:bg-base-200 grid place-items-center"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-base-content/60">Search</label>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
                      <Search size={16} className="text-[#8B5E3C]" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Name / author / email…"
                        className="w-full bg-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-base-content/60">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="mt-1 w-full rounded-2xl border bg-base-100 px-3 py-2 text-sm outline-none"
                    >
                      <option value="all">All</option>
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn flex-1 rounded-2xl bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Apply
                    </button>
                    <button
                      className="btn flex-1 rounded-2xl btn-outline"
                      onClick={() => {
                        setQuery("");
                        setStatusFilter("all");
                        setMobileFiltersOpen(false);
                      }}
                    >
                      Clear
                    </button>
                  </div>

                  <p className="text-xs text-base-content/60">{filtered.length} result(s)</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="mt-5">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-base-100 rounded-3xl p-6">
            <p className="text-base-content/60">No books available.</p>
          </motion.div>
        ) : (
          <>
            {/* ✅ Mobile Cards */}
            <div className="grid gap-3 sm:hidden">
              <AnimatePresence>
                {filtered.map((book, idx) => {
                  const busy = actionId === book._id;

                  return (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: idx * 0.015 }}
                      className="bg-base-100 border border-base-300 rounded-3xl p-4 shadow-sm"
                    >
                      <div className="flex gap-3">
                        <img
                          src={book.image}
                          alt={book.name}
                          className="w-16 h-24 object-cover rounded-2xl border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold truncate">{book.name}</p>
                          <p className="text-sm text-base-content/60 truncate">{book.author}</p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-[#8B5E3C]">
                              <DollarSign size={14} />
                              ৳ {book.price}
                            </span>

                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPill(book.status)}`}>
                              {book.status}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-base-content/60 truncate">
                            <span className="inline-flex items-center gap-1">
                              <Mail size={12} />
                              {book.librarianEmail || "—"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          disabled={busy}
                          onClick={() => openToggleModal(book._id, book.status, book.name)}
                          className={`btn btn-sm rounded-2xl flex-1 border-0 ${
                            book.status === "published"
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {busy ? "Updating..." : book.status === "published" ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          disabled={busy}
                          onClick={() => openDeleteModal(book._id, book.name)}
                          className="btn btn-sm rounded-2xl bg-red-600 text-white hover:bg-red-700 border-0"
                        >
                          <Trash2 size={16} className="mr-1" />
                          {busy ? "..." : "Delete"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ✅ Desktop Table */}
            <div className="hidden sm:block overflow-x-auto bg-base-100 rounded-3xl border border-base-300">
              <table className="table w-full">
                <thead>
                  <tr className="bg-[#8B5E3C] text-white">
                    <th>Book</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Librarian</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((book, idx) => {
                    const busy = actionId === book._id;

                    return (
                      <motion.tr
                        key={book._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.015 }}
                        className="hover"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <img
                              src={book.image}
                              alt={book.name}
                              className="w-14 h-20 object-cover rounded-2xl"
                            />
                            <div>
                              <p className="font-bold">{book.name}</p>
                              <p className="text-xs text-base-content/60">ID: {book._id}</p>
                            </div>
                          </div>
                        </td>

                        <td>{book.author}</td>

                        <td className="font-bold text-[#8B5E3C]">৳ {book.price}</td>

                        <td>
                          <button
                            disabled={busy}
                            onClick={() => openToggleModal(book._id, book.status, book.name)}
                            className={`px-3 py-1 rounded-full text-sm font-semibold disabled:opacity-60 ${statusPill(
                              book.status
                            )}`}
                            title="Toggle publish status"
                          >
                            {busy ? "Updating..." : book.status}
                          </button>
                        </td>

                        <td className="text-sm text-base-content/70">
                          {book.librarianEmail || "—"}
                        </td>

                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={busy}
                              onClick={() => openToggleModal(book._id, book.status, book.name)}
                              className={`btn btn-sm rounded-2xl border-0 ${
                                book.status === "published"
                                  ? "bg-red-600 text-white hover:bg-red-700"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              {book.status === "published" ? (
                                <>
                                  <EyeOff size={16} className="mr-1" /> Unpublish
                                </>
                              ) : (
                                <>
                                  <BadgeCheck size={16} className="mr-1" /> Publish
                                </>
                              )}
                            </button>

                            <button
                              disabled={busy}
                              onClick={() => openDeleteModal(book._id, book.name)}
                              className="btn btn-sm rounded-2xl bg-red-600 text-white hover:bg-red-700 border-0"
                            >
                              <Trash2 size={16} className="mr-1" />
                              {busy ? "Deleting..." : "Delete"}
                            </button>
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
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        confirmText={confirmState?.type === "delete" ? "Yes, delete" : "Yes, change"}
        danger={confirmDanger}
        loading={!!actionId && actionId === confirmState?.bookId}
        onClose={() => {
          setConfirmOpen(false);
          setConfirmState(null);
        }}
        onConfirm={async () => {
          const s = confirmState;
          setConfirmOpen(false);
          setConfirmState(null);

          if (!s?.bookId) return;

          if (s.type === "toggle") {
            await doToggleStatus(s.bookId, s.newStatus);
          } else if (s.type === "delete") {
            await doDeleteBook(s.bookId);
          }
        }}
      />

      {/* toast animation styles */}
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