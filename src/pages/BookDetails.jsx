/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthContext";

function Stars({ value = 0 }) {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={i <= v ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">{value ? value.toFixed(2) : "0.00"}</span>
    </div>
  );
}

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [wishLoading, setWishLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [eligibleReason, setEligibleReason] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBook = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`);
    setBook(res.data);
  };

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews?bookId=${id}`);
      setReviews(res.data || []);
    } catch (e) {
      console.log(e);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!user) {
      setEligible(false);
      setEligibleReason("Login required to review.");
      return;
    }
    try {
      const res = await axiosSecure.get(`/reviews/eligible/${id}`);
      setEligible(!!res.data?.eligible);
      setEligibleReason(res.data?.reason || "");
    } catch (e) {
      setEligible(false);
      setEligibleReason("Could not verify eligibility");
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await fetchBook();
      } catch (e) {
        console.log(e);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    run();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    checkEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

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
      toast.success("Added to wishlist ");
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || "Failed to add wishlist");
    } finally {
      setWishLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required");

    try {
      setSubmitting(true);

      const res = await axiosSecure.post("/reviews", {
        bookId: id,
        rating,
        comment,
      });

      toast.success("Review submitted ✅");
      setComment("");

      // refresh
      await fetchReviews();
      await fetchBook(); // refresh avgRating/reviewCount from book
      await checkEligibility(); // should become ineligible after review
      
      // res.data has { avgRating, reviewCount }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
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
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Details */}
      <div className="bg-base-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-base-100 p-6 flex items-center justify-center">
            <img
              src={book.image}
              alt={book.name}
              className="w-full max-w-sm rounded-xl border object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-[#8B5E3C]">{book.name}</h1>
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Author:</span> {book.author}
            </p>

            <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
              <div>
                <Stars value={Number(book.avgRating || 0)} />
                <p className="text-xs text-gray-500 mt-1">
                  {book.reviewCount || 0} review(s)
                </p>
              </div>

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

            <p className="mt-4 text-gray-700 whitespace-pre-line leading-relaxed">
              {book.description || "No description available."}
            </p>

            <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xl font-semibold">
                Price: <span className="text-[#8B5E3C]">৳ {book.price}</span>
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/books/${book._id}/buy`)}
                className="w-full px-6 py-2 rounded-md bg-[#8B5E3C] text-white hover:bg-[#A47148] transition"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddWishlist}
                disabled={wishLoading}
                className="w-full px-6 py-2 rounded-md border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition"
              >
                {wishLoading ? "Adding..." : "Add to Wishlist"}
              </button>
            </div>

            <div className="mt-6">
              <Link to="/books" className="text-sm text-[#8B5E3C] hover:underline">
                ← Back to All Books
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-[#8B5E3C] mb-4">Write a Review</h2>

        {!user ? (
          <p className="text-gray-600">
            Please{" "}
            <Link className="text-[#8B5E3C] font-semibold hover:underline" to="/login">
              login
            </Link>{" "}
            to write a review.
          </p>
        ) : !eligible ? (
          <p className="text-gray-600">{eligibleReason || "You are not eligible to review."}</p>
        ) : (
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-[#8B5E3C]">
                Rating
              </label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map((i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i)}
                    className={`px-3 py-2 rounded-md border ${
                      rating === i
                        ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                        : "bg-base-100 text-[#8B5E3C] border-[#8B5E3C]"
                    }`}
                  >
                    {i} ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-[#8B5E3C]">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
                placeholder="Write your review..."
              />
            </div>

            <button
              disabled={submitting}
              className="w-full bg-[#8B5E3C] text-white py-2 rounded-md hover:bg-[#A47148] transition"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-[#8B5E3C] mb-4">
          Reviews
        </h2>

        {reviewLoading ? (
          <div className="flex items-center justify-center py-6">
            <span className="loading loading-spinner text-[#8B5E3C]"></span>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-base-100 p-4 rounded-xl border">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.userPhoto || "https://i.ibb.co/2kRZpF0/user.png"}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{r.userName || "User"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-yellow-500 font-semibold">
                    {"★".repeat(r.rating)}{" "}
                    <span className="text-gray-400">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}