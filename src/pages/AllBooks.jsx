import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/books?status=published")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-[#8B5E3C] mb-8">
        All Books
      </h2>

      {books.length === 0 ? (
        <p className="text-gray-500">No books available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-base-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={book.image}
                alt={book.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-bold text-lg">{book.name}</h3>
                <p className="text-sm text-gray-500">
                  {book.author}
                </p>
                <p className="mt-2 font-semibold text-[#8B5E3C]">
                  ৳ {book.price}
                </p>

                <Link
                  to={`/books/${book._id}`}
                  className="btn btn-sm mt-3 bg-[#8B5E3C] text-white hover:bg-[#A47148]"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
