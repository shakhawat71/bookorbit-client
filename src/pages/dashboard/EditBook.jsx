import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load book
  useEffect(() => {
    const loadBook = async () => {
      try {
        const res = await axiosSecure.get("/books");
        const found = res.data.find((b) => b._id === id);
        setBook(found);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to load book");
      }
    };

    loadBook();
  }, [id]);

  // ✅ Update book
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
      setLoading(true);

      await axiosSecure.patch(`/books/${id}`, updatedBook);

      toast.success("Book updated successfully ✅");
      navigate("/dashboard/my-books");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete book
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axiosSecure.delete(`/books/${id}`);

      toast.success("Book deleted successfully 🗑️");

      navigate("/dashboard/my-books");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Delete failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!book) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-[#8B5E3C] mb-5">
        Edit Book
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Book Name</label>
          <input
            defaultValue={book.name}
            name="name"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block font-medium mb-1">Author</label>
          <input
            defaultValue={book.author}
            name="author"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            defaultValue={book.price}
            type="number"
            name="price"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            defaultValue={book.status}
            name="status"
            className="select select-bordered w-full"
          >
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            defaultValue={book.description}
            name="description"
            className="textarea textarea-bordered w-full"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn bg-[#8B5E3C] text-white hover:bg-[#A47148] flex-1"
          >
            {loading ? "Updating..." : "Update Book"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="btn bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
