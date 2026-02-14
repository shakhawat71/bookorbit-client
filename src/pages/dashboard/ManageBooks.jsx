import { useState } from "react";
import toast from "react-hot-toast";

export default function ManageBooks() {
  // Temporary dummy books (replace with API later)
  const [books, setBooks] = useState([
    {
      _id: "1",
      name: "Atomic Habits",
      author: "James Clear",
      image: "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg",
      price: 20,
      status: "published",
      librarianEmail: "librarian1@example.com",
    },
    {
      _id: "2",
      name: "Deep Work",
      author: "Cal Newport",
      image: "https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg",
      price: 18,
      status: "unpublished",
      librarianEmail: "librarian2@example.com",
    },
  ]);

  const toggleStatus = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book._id === id
          ? {
              ...book,
              status:
                book.status === "published"
                  ? "unpublished"
                  : "published",
            }
          : book
      )
    );

    toast.success("Book status updated");
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book._id !== id));
    toast.success("Book deleted");
  };

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        Manage Books
      </h1>

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
                <th>Actions</th>
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
                    <button
                      onClick={() => toggleStatus(book._id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        book.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.status}
                    </button>
                  </td>

                  <td className="text-sm text-gray-600">
                    {book.librarianEmail}
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => deleteBook(book._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
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
