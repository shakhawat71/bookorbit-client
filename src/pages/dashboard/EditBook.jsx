/* eslint-disable no-unused-vars */
// ✅ src/pages/dashboard/EditBook.jsx (RESPONSIVE + ANIMATIONS + GORGEOUS TOAST)
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  BadgeX,
  BookOpen,
  CheckCircle2,
  Info,
  Pencil,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
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

// ---------- Sweet confirm (no extra library) ----------
const ConfirmModal = ({ open, title, desc, confirmText, danger, onClose, onConfirm, busy }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-3xl bg-base-100 shadow-2xl border border-base-200 overflow-hidden"
        >
          <div className="p-5 flex items-start gap-3">
            <div
              className={`h-11 w-11 rounded-2xl grid place-items-center ${
                danger ? "bg-rose-50" : "bg-amber-50"
              }`}
            >
              {danger ? (
                <Trash2 className="text-rose-600" size={20} />
              ) : (
                <Info className="text-amber-600" size={20} />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-base-content/70 mt-1">{desc}</p>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl hover:bg-base-200 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-5 pt-0 flex gap-2">
            <button
              onClick={onClose}
              disabled={busy}
              className="btn flex-1 btn-outline border-base-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={busy}
              className={`btn flex-1 border-0 text-white ${
                danger ? "bg-red-600 hover:bg-red-700" : "bg-[#8B5E3C] hover:bg-[#A47148]"
              }`}
            >
              {busy ? "Please wait..." : confirmText}
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes toastbar { from { transform: translateX(-100%); } to { transform: translateX(0%); } }
        .animate-enter { animation: enter 200ms ease-out; }
        .animate-leave { animation: leave 160ms ease-in forwards; }
        @keyframes enter { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes leave { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(6px) scale(.98); } }
      `}</style>
    </div>
  );
};

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  // ✅ Load book (prefer direct by id, fallback to /books + find)
  useEffect(() => {
    let mounted = true;

    const loadBook = async () => {
      try {
        setPageLoading(true);

        // try: get single book
        try {
          const single = await axiosSecure.get(`/books/${id}`);
          if (mounted) setBook(single.data);
        } catch {
          // fallback: fetch all and find
          const res = await axiosSecure.get("/books");
          const found = (res.data || []).find((b) => b?._id === id);
          if (mounted) setBook(found || null);
        }
      } catch (error) {
        console.log(error);
        showToast.error("Failed to load book", "Please refresh and try again.");
        if (mounted) setBook(null);
      } finally {
        if (mounted) setPageLoading(false);
      }
    };

    loadBook();
    return () => {
      mounted = false;
    };
  }, [id]);

  const badge = useMemo(() => {
    const s = book?.status;
    const isPub = s === "published";
    return {
      isPub,
      cls: isPub ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
      icon: isPub ? <BadgeCheck size={16} /> : <BadgeX size={16} />,
      label: s || "—",
    };
  }, [book]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const form = e.target;
    const updatedBook = {
      name: form.name.value,
      author: form.author.value,
      price: form.price.value,
      status: form.status.value,
      description: form.description.value,
    };

    try {
      setSaving(true);
      await axiosSecure.patch(`/books/${id}`, updatedBook);
      showToast.success("Updated!", "Book information saved successfully.");
      navigate("/dashboard/my-books");
    } catch (error) {
      console.log(error);
      showToast.error("Update failed", error?.response?.data?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosSecure.delete(`/books/${id}`);
      showToast.success("Deleted", "Book removed successfully.");
      navigate("/dashboard/my-books");
    } catch (error) {
      console.log(error);
      showToast.error("Delete failed", error?.response?.data?.message || "Please try again.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto bg-base-200 p-6 rounded-2xl shadow-lg">
        <p className="text-base-content/70">Book not found.</p>
        <Link
          to="/dashboard/my-books"
          className="btn btn-sm mt-4 bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to My Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* top bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-[#8B5E3C] flex items-center gap-2">
              Edit Book
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.cls}`}>
                {badge.icon}
                {badge.label}
              </span>
            </h2>
            <p className="text-sm text-base-content/60 truncate max-w-[70vw] sm:max-w-xl">
              {book?.name}
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/my-books"
          className="btn btn-sm btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Link>
      </motion.div>

      {/* content */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="grid lg:grid-cols-2 gap-5"
      >
        {/* preview card */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden"
        >
          <div className="relative">
            <img
              src={book.image}
              alt={book.name}
              className="w-full h-72 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white text-xl font-bold">{book.name}</p>
              <p className="text-white/80 text-sm mt-1">{book.author}</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-white text-sm">
                ৳ {book.price ?? 0}
              </p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm text-base-content/70 whitespace-pre-line">
              {book.description || "—"}
            </p>
          </div>
        </motion.div>

        {/* form */}
        <div className="bg-base-200 rounded-3xl shadow-lg p-5 sm:p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-[#8B5E3C]">Book Name</label>
              <input
                defaultValue={book.name}
                name="name"
                required
                className="w-full px-4 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#8B5E3C]">Author</label>
              <input
                defaultValue={book.author}
                name="author"
                required
                className="w-full px-4 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-[#8B5E3C]">Price</label>
                <input
                  defaultValue={book.price}
                  type="number"
                  name="price"
                  required
                  className="w-full px-4 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#8B5E3C]">Status</label>
                <select
                  defaultValue={book.status}
                  name="status"
                  className="w-full px-4 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#8B5E3C]">Description</label>
              <textarea
                defaultValue={book.description}
                name="description"
                rows={5}
                className="w-full px-4 py-2 rounded-xl border bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={saving || deleting}
                className="btn w-full sm:flex-1 bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
              >
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={saving || deleting}
                className="btn w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 border-0"
              >
                <Trash2 size={18} className="mr-2" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

            <div className="text-xs text-base-content/60 flex items-center gap-2">
              <Info size={14} />
              Deleting a book also deletes all orders of that book (as per requirement).
            </div>
          </form>
        </div>
      </motion.div>

      {/* confirm modal */}
      <ConfirmModal
        open={confirmOpen}
        danger
        busy={deleting}
        title="Delete this book?"
        desc="This will permanently delete the book and its related orders."
        confirmText="Yes, delete"
        onClose={() => (!deleting ? setConfirmOpen(false) : null)}
        onConfirm={handleDelete}
      />

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