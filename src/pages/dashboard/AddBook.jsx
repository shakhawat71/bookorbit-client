/* eslint-disable no-unused-vars */
// ✅ src/pages/dashboard/AddBook.jsx (ANIMATED + GORGEOUS TOAST + SMOOTH UI)
import { useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload,
  Image as ImageIcon,
  Info,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trash2,
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
      { duration: 3200 }
    ),
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.25 } }),
};

export default function AddBook() {
  const [loading, setLoading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    price: "",
    status: "unpublished",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const apiKey = useMemo(() => import.meta.env.VITE_IMGBB_API_KEY, []);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const setPickedFile = (file) => {
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      showToast.error("Invalid file", "Please select an image file (jpg/png/webp).");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setPickedFile(file);
  };

  // ✅ Drag & Drop
  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    setPickedFile(file);
  };

  // ✅ Image compression (Canvas)
  const compressImage = (file, opts = { maxWidth: 900, quality: 0.8 }) =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          const scale = Math.min(1, opts.maxWidth / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url);
              if (!blob) return reject(new Error("Compression failed"));
              const compressedFile = new File([blob], file.name, {
                type: blob.type || "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            opts.quality
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Invalid image"));
        };

        img.src = url;
      } catch (err) {
        reject(err);
      }
    });

  // ✅ Upload to imgbb with progress (XMLHttpRequest)
  const uploadToImgbbWithProgress = (file) =>
    new Promise((resolve, reject) => {
      if (!apiKey) return reject(new Error("Missing IMGBB API key"));
      const fd = new FormData();
      fd.append("image", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setUploadPct(pct);
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data?.success) {
            resolve(data.data.display_url);
          } else {
            reject(new Error(data?.error?.message || "Upload failed"));
          }
        } catch (e) {
          reject(new Error("Upload response parse failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(fd);
    });

  const uploadImage = async () => {
    if (!imageFile) return null;
    setUploadPct(0);

    const compressed = await compressImage(imageFile, {
      maxWidth: 900,
      quality: 0.8,
    });

    return await uploadToImgbbWithProgress(compressed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      showToast.error("Image required", "Please upload a book image first.");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage();

      const bookData = {
        ...formData,
        image: imageUrl,
      };

      const response = await axiosSecure.post("/books", bookData);

      if (response?.data?.insertedId) {
        showToast.success("Book added!", "Your book has been saved successfully.");
        setFormData({
          name: "",
          author: "",
          price: "",
          status: "unpublished",
          description: "",
        });
        setImageFile(null);
        setPreview(null);
        setUploadPct(0);
      } else {
        showToast.error("Failed", "Could not add book. Try again.");
      }
    } catch (error) {
      showToast.error("Failed to add book", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isUploading = loading && uploadPct > 0 && uploadPct < 100;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B5E3C] flex items-center gap-2">
            <Sparkles size={22} />
            Add New Book
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Upload image, add details, and publish whenever you want.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-base-200 shadow-xl rounded-3xl p-5 sm:p-8"
      >
        {/* ✅ Auto publish toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-6 flex items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-300"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center">
              <Info size={18} />
            </div>
            <div>
              <p className="font-bold text-[#8B5E3C]">Auto Publish</p>
              <p className="text-xs text-base-content/60">
                Turn on to publish immediately after adding.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            className="toggle toggle-lg"
            checked={formData.status === "published"}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                status: e.target.checked ? "published" : "unpublished",
              }))
            }
          />
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Book Name */}
          <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show">
            <label className="block mb-2 font-semibold text-[#8B5E3C]">Book Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter book name"
              className="w-full border bg-base-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </motion.div>

          {/* Author */}
          <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show">
            <label className="block mb-2 font-semibold text-[#8B5E3C]">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
              className="w-full border bg-base-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </motion.div>

          {/* ✅ Drag & Drop Upload */}
          <motion.div
            custom={3}
            variants={fieldVariants}
            initial="hidden"
            animate="show"
            className="lg:row-span-2"
          >
            <label className="block mb-2 font-semibold text-[#8B5E3C]">Book Image</label>

            <motion.div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              animate={{
                scale: dragActive ? 1.01 : 1,
              }}
              transition={{ duration: 0.15 }}
              className={[
                "w-full rounded-3xl border-2 border-dashed p-4 sm:p-5 transition overflow-hidden",
                dragActive
                  ? "border-[#8B5E3C] bg-[#8B5E3C]/5"
                  : "border-base-300 bg-base-100",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <CloudUpload size={18} className="text-[#8B5E3C]" />
                  <span>Drag & drop an image here, or choose a file</span>
                </div>

                <label className="btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <AnimatePresence>
                {preview ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 flex items-center gap-4"
                  >
                    <div className="relative">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-2xl border border-base-300"
                      />
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-2xl bg-white shadow grid place-items-center border">
                        <ImageIcon size={16} className="text-[#8B5E3C]" />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-0"
                      onClick={() => {
                        setImageFile(null);
                        setPreview(null);
                        setUploadPct(0);
                      }}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-2xl bg-base-200 p-4 text-sm text-base-content/65"
                  >
                    Tip: Use a clear cover image (jpg/png). We compress it automatically.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ✅ Progress bar */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-between text-xs text-base-content/60 mb-1">
                    <span>{isUploading ? "Uploading image..." : "Processing..."}</span>
                    <span>{uploadPct}%</span>
                  </div>
                  <progress className="progress w-full" value={uploadPct} max="100" />
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Price */}
          <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show">
            <label className="block mb-2 font-semibold text-[#8B5E3C]">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price"
              className="w-full border bg-base-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </motion.div>

          {/* Status Dropdown */}
          <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="show">
            <label className="block mb-2 font-semibold text-[#8B5E3C]">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border bg-base-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            >
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </motion.div>

          {/* Description */}
          <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="show" className="lg:col-span-1">
            <label className="block mb-2 font-semibold text-[#8B5E3C]">Book Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Write a short description about the book..."
              className="w-full border bg-base-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="show" className="lg:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#8B5E3C] text-white py-3 font-semibold hover:bg-[#A47148] transition active:scale-[0.99]"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>

            <p className="mt-3 text-xs text-base-content/60 flex items-center gap-2">
              <Info size={14} />
              Image is compressed before upload for faster performance.
            </p>
          </motion.div>
        </form>
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