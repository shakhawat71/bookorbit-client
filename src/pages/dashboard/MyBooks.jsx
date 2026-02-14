import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch librarian's books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosSecure.get("/books/mine");
        setBooks(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading books...</p>;
  }

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        My Books
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-500">No books added yet.</p>
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
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="hover">
                  <td>
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                  </td>

                  <td className="font-semibold">
                    {book.name}
                  </td>

                  <td>{book.author}</td>

                  <td>${book.price}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        book.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/dashboard/edit-book/${book._id}`}
                      className="bg-[#8B5E3C] text-white px-3 py-1 rounded hover:bg-[#A47148]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
