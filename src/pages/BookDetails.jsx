// ✅ src/pages/BookDetails.jsx (FULL)
// - Shows book info
// - Buy Now (requires login via PrivateRoute already)
// - Add to Wishlist (requires login; uses /wishlist route)
// - Nice UI + loading + error states

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishLoading, setWishLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddWishlist = async () => {
    if (!user) {
      toast.error("Please login to add wishlist");
      return navigate("/login", { state: { from: { pathname: `/books/${id}` } } });
    }

    try {
      setWishLoading(true);
      await axiosSecure.post("/wishlist", {
        bookId: book?._id,
        bookName: book?.name,
        bookAuthor: book?.author,
        bookImage: book?.image,
        price: book?.price,
      });
      toast.success("Added to wishlist ❤️");
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to add wishlist");
    } finally {
      setWishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-base-200 p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-[#8B5E3C]">Book not found</h2>
          <p className="text-gray-600 mt-2">This book may have been deleted or unpublished.</p>
          <Link
            to="/books"
            className="inline-block mt-6 px-6 py-2 rounded-md bg-[#8B5E3C] text-white hover:bg-[#A47148]"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-base-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-base-100 p-6 flex items-center justify-center">
            <img
              src={book.image}
              alt={book.name}
              className="w-full max-w-sm rounded-xl border object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-[#8B5E3C]">{book.name}</h1>
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Author:</span> {book.author}
            </p>

            <p className="mt-4 text-gray-700 whitespace-pre-line leading-relaxed">
              {book.description || "No description available."}
            </p>

            <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xl font-semibold">
                Price:{" "}
                <span className="text-[#8B5E3C]">৳ {book.price}</span>
              </p>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  book.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {book.status}
              </span>
            </div>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Buy */}
              <button
                onClick={() => navigate(`/books/${book._id}/buy`)}
                className="w-full px-6 py-2 rounded-md bg-[#8B5E3C] text-white hover:bg-[#A47148] transition"
              >
                Buy Now
              </button>

              {/* Wishlist */}
              <button
                onClick={handleAddWishlist}
                disabled={wishLoading}
                className="w-full px-6 py-2 rounded-md border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition"
              >
                {wishLoading ? "Adding..." : "Add to Wishlist"}
              </button>
            </div>

            <div className="mt-6">
              <Link
                to="/books"
                className="text-sm text-[#8B5E3C] hover:underline"
              >
                ← Back to All Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}