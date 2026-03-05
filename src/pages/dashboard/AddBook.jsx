/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

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
      toast.error("Please select an image file");
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

    // compress first
    const compressed = await compressImage(imageFile, {
      maxWidth: 900,
      quality: 0.8,
    });

    // upload with progress
    const url = await uploadToImgbbWithProgress(compressed);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a book image");
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
        toast.success("Book added successfully!");
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
        toast.error("Failed to add book");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  const isUploading = loading && uploadPct > 0 && uploadPct < 100;

  return (
    <div className="max-w-4xl mx-auto bg-base-200 shadow-xl rounded-2xl p-8">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">Add New Book</h1>

      {/* ✅ Auto publish toggle */}
      <div className="mb-6 flex items-center justify-between gap-4 bg-base-100 p-4 rounded-xl border">
        <div>
          <p className="font-semibold text-[#8B5E3C]">Auto Publish</p>
          <p className="text-xs text-gray-500">
            Turn on to publish immediately after adding.
          </p>
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
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Name */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">Book Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter book name"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Enter author name"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* ✅ Drag & Drop Upload */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">Book Image</label>

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={[
              "w-full rounded-xl border-2 border-dashed p-4 transition",
              dragActive ? "border-[#8B5E3C] bg-[#8B5E3C]/5" : "border-gray-300 bg-base-100",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-gray-600">
                Drag & drop an image here, or choose a file
              </p>

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

            {preview && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    setImageFile(null);
                    setPreview(null);
                    setUploadPct(0);
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            {/* ✅ Progress bar */}
            {loading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{isUploading ? "Uploading image..." : "Processing..."}</span>
                  <span>{uploadPct}%</span>
                </div>
                <progress className="progress w-full" value={uploadPct} max="100" />
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            (We compress image automatically before upload)
          </p>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Enter price"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Status Dropdown (still available if you want manual control) */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          >
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-[#8B5E3C]">Book Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Write a short description about the book..."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5E3C] text-white py-3 rounded-lg hover:bg-[#A47148] transition"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}