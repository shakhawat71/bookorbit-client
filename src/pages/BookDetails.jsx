import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthContext";
import { motion as Motion } from "framer-motion";
import { CheckCircle2, XCircle, Heart } from "lucide-react";
import { BookDetailSkeleton } from "../components/ui/Skeleton";

// ---------- Toast ----------
const showToast = {
  success: (title, desc) =>
    toast.custom((t) => (
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
            {desc && <p className="text-sm text-gray-600">{desc}</p>}
          </div>
        </div>
      </div>
    )),

  error: (title, desc) =>
    toast.custom((t) => (
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
            {desc && <p className="text-sm text-gray-600">{desc}</p>}
          </div>
        </div>
      </div>
    )),
};

// ---------- Stars ----------
function Stars({ value = 0 }) {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= v ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {value ? value.toFixed(2) : "0.00"}
      </span>
    </div>
  );
}

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookNotFound, setBookNotFound] = useState(false);

  const [wishLoading, setWishLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);

  const [eligible, setEligible] = useState(false);
  const [eligibleReason, setEligibleReason] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---------- Fetch Book with retry ----------
  const fetchBookWithRetry = useCallback(async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`);
        setBook(res.data);
        setBookNotFound(false);
        return true;
      } catch (error) {
        const status = error?.response?.status;

        if (i === retries - 1) {
          if (status === 404) {
            setBook(null);
            setBookNotFound(true);
          } else {
            setBook(null);
            setBookNotFound(false);
            showToast.error("Failed to load book", "Please try again.");
          }
          return false;
        }

        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
    return false;
  }, [id]);

  // ---------- Fetch Reviews ----------
  const fetchReviews = useCallback(async () => {
    try {
      setReviewLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews?bookId=${id}`
      );
      setReviews(res.data || []);
    } catch (error) {
      console.log("Failed to load reviews:", error);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  }, [id]);

  // ---------- Check Review Eligibility ----------
  const checkEligibility = useCallback(async () => {
    if (!user) {
      setEligible(false);
      setEligibleReason("Login required to review.");
      return;
    }

    try {
      const res = await axiosSecure.get(`/reviews/eligible/${id}`);
      setEligible(!!res.data?.eligible);
      setEligibleReason(res.data?.reason || "");
    } catch {
      setEligible(false);
      setEligibleReason("Could not verify eligibility");
    }
  }, [id, user]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const ok = await fetchBookWithRetry(3);

        if (!mounted) return;

        if (ok) {
          await fetchReviews();
        } else {
          setReviewLoading(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [id, fetchBookWithRetry, fetchReviews]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  // ---------- Wishlist ----------
  const handleAddWishlist = async () => {
    if (!user) {
      showToast.error("Login Required", "Please login to add wishlist");
      return navigate("/login");
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

      showToast.success("Added to Wishlist");
    } catch (e) {
      showToast.error("Failed", e?.response?.data?.message);
    } finally {
      setWishLoading(false);
    }
  };

  // ---------- Submit Review ----------
  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) return showToast.error("Login required");

    try {
      setSubmitting(true);

      await axiosSecure.post("/reviews", {
        bookId: id,
        rating,
        comment,
      });

      showToast.success("Review Submitted");

      setComment("");

      await fetchReviews();
      await fetchBookWithRetry(2);
      await checkEligibility();
    } catch (err) {
      showToast.error("Review failed", err?.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Loading Skeleton ----------
  if (loading) {
    return <BookDetailSkeleton />;
  }

  if (bookNotFound || !book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-[#8B5E3C]">Book not found</h2>
          <p className="mt-2 text-base-content/60">The book you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/books")}
            className="mt-6 btn bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
          >
            Browse All Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* BOOK DETAILS */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-200 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* IMAGE */}
          <div className="bg-base-100 p-8 flex items-center justify-center">
            <Motion.img
              whileHover={{ scale: 1.05 }}
              src={book.image}
              alt={book.name}
              className="w-full max-w-xs rounded-xl shadow-lg"
            />
          </div>

          {/* INFO */}
          <div className="p-6 md:p-10 space-y-4">
            <h1 className="text-3xl font-bold text-[#8B5E3C]">{book.name}</h1>

            <p className="text-gray-600">
              Author: <span className="font-medium">{book.author}</span>
            </p>

            <Stars value={Number(book.avgRating || 0)} />

            <p className="text-sm text-gray-500">{book.reviewCount || 0} review(s)</p>

            <p className="text-gray-700 leading-relaxed">{book.description}</p>

            <p className="text-xl font-semibold">
              Price: <span className="text-[#8B5E3C]">৳ {book.price}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <Motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/books/${book._id}/buy`)}
                className="bg-[#8B5E3C] text-white py-2 rounded-lg hover:bg-[#A47148] transition-all"
              >
                Buy Now
              </Motion.button>

              <Motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddWishlist}
                disabled={wishLoading}
                className="border border-[#8B5E3C] text-[#8B5E3C] py-2 rounded-lg hover:bg-[#8B5E3C] hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <Heart size={16} />
                {wishLoading ? "Adding..." : "Wishlist"}
              </Motion.button>
            </div>
          </div>
        </div>
      </Motion.div>

      {/* REVIEW FORM */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-base-200 p-6 rounded-3xl shadow-lg"
      >
        <h2 className="text-xl font-bold text-[#8B5E3C] mb-4">Write a Review</h2>

        {!user ? (
          <div className="text-center py-6">
            <p className="text-base-content/60">Please login to review this book</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-3 btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
            >
              Login to Review
            </button>
          </div>
        ) : !eligible ? (
          <div className="text-center py-6">
            <p className="text-base-content/60">{eligibleReason}</p>
          </div>
        ) : (
          <form onSubmit={submitReview} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    rating === i
                      ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                      : "border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C]/10"
                  }`}
                >
                  {i} ★
                </button>
              ))}
            </div>

            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-base-100"
              placeholder="Write your review..."
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#8B5E3C] text-white px-6 py-2 rounded-lg hover:bg-[#A47148] transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </Motion.div>

      {/* REVIEWS SECTION */}
      <div className="bg-base-200 p-6 rounded-3xl shadow-lg">
        <h2 className="text-xl font-bold text-[#8B5E3C] mb-4">Reviews</h2>

        {reviewLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner text-[#8B5E3C]"></span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-content/60">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, idx) => (
              <Motion.div
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-base-100 p-4 rounded-xl border border-base-200"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.userPhoto || "https://i.ibb.co/2kRZpF0/user.png"}
                      alt={r.userName || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{r.userName || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < r.rating ? "text-yellow-500" : "text-gray-300"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-gray-700">{r.comment}</p>
              </Motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Toast animation styles */}
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