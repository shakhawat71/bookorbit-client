import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/books");
      setBooks(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const toggleStatus = async (bookId, currentStatus) => {
    const newStatus = currentStatus === "published" ? "unpublished" : "published";

    try {
      setActionId(bookId);
      await axiosSecure.patch(`/admin/books/${bookId}/status`, {
        status: newStatus,
      });

      toast.success(`Book marked as ${newStatus}`);

      setBooks((prev) =>
        prev.map((b) => (b._id === bookId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  const deleteBook = async (bookId) => {
    const ok = window.confirm(
      "Delete this book? (All orders of this book will also be deleted)"
    );
    if (!ok) return;

    try {
      setActionId(bookId);
      await axiosSecure.delete(`/books/${bookId}`);

      toast.success("Book deleted");
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Delete failed");
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
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#8B5E3C]">Manage Books</h1>

        <button
          onClick={loadBooks}
          className="btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
        >
          Refresh
        </button>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-500">No books available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-[#8B5E3C] text-white">
                <th>Image</th>
                <th>Name</th>
                <th>Author</th>
                <th>Price</th>
                <th>Status</th>
                <th>Librarian</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => {
                const busy = actionId === book._id;

                return (
                  <tr key={book._id} className="hover">
                    <td>
                      <img
                        src={book.image}
                        alt={book.name}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                    </td>

                    <td className="font-semibold">{book.name}</td>
                    <td>{book.author}</td>
                    <td>৳ {book.price}</td>

                    <td>
                      <button
                        disabled={busy}
                        onClick={() => toggleStatus(book._id, book.status)}
                        className={`px-3 py-1 rounded-full text-sm font-medium disabled:opacity-60 ${
                          book.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {busy ? "Updating..." : book.status}
                      </button>
                    </td>

                    <td className="text-sm text-gray-600">
                      {book.librarianEmail || "—"}
                    </td>

                    <td className="text-right">
                      <button
                        disabled={busy}
                        onClick={() => deleteBook(book._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-60"
                      >
                        {busy ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}