/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Heart } from "lucide-react";


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

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);

  const [eligible, setEligible] = useState(false);
  const [eligibleReason, setEligibleReason] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);


  // ---------- Fetch Book ----------
  const fetchBook = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`);
    setBook(res.data);
  };

  // ---------- Fetch Reviews ----------
  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews?bookId=${id}`);
      setReviews(res.data || []);
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
    } catch {
      setEligible(false);
      setEligibleReason("Could not verify eligibility");
    }
  };


  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await fetchBook();
      } finally {
        setLoading(false);
      }
    };

    run();
    fetchReviews();
  }, [id]);


  useEffect(() => {
    checkEligibility();
  }, [user, id]);


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
      await fetchBook();
      await checkEligibility();

    } catch (err) {

      showToast.error("Review failed", err?.response?.data?.message);

    } finally {
      setSubmitting(false);
    }
  };


  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#8B5E3C]">Book not found</h2>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* BOOK DETAILS */}
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        className="bg-base-200 rounded-3xl shadow-xl overflow-hidden"
      >

        <div className="grid md:grid-cols-2 gap-0">

          {/* IMAGE */}
          <div className="bg-base-100 p-8 flex items-center justify-center">
            <motion.img
              whileHover={{ scale:1.05 }}
              src={book.image}
              alt={book.name}
              className="w-full max-w-xs rounded-xl shadow-lg"
            />
          </div>


          {/* INFO */}
          <div className="p-6 md:p-10 space-y-4">

            <h1 className="text-3xl font-bold text-[#8B5E3C]">
              {book.name}
            </h1>

            <p className="text-gray-600">
              Author: <span className="font-medium">{book.author}</span>
            </p>


            <Stars value={Number(book.avgRating || 0)} />

            <p className="text-sm text-gray-500">
              {book.reviewCount || 0} review(s)
            </p>


            <p className="text-gray-700 leading-relaxed">
              {book.description}
            </p>


            <p className="text-xl font-semibold">
              Price: <span className="text-[#8B5E3C]">৳ {book.price}</span>
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">

              <motion.button
                whileTap={{ scale:0.95 }}
                onClick={() => navigate(`/books/${book._id}/buy`)}
                className="bg-[#8B5E3C] text-white py-2 rounded-lg hover:bg-[#A47148]"
              >
                Buy Now
              </motion.button>

              <motion.button
                whileTap={{ scale:0.95 }}
                onClick={handleAddWishlist}
                disabled={wishLoading}
                className="border border-[#8B5E3C] text-[#8B5E3C] py-2 rounded-lg hover:bg-[#8B5E3C] hover:text-white flex items-center justify-center gap-2"
              >
                <Heart size={16}/>
                {wishLoading ? "Adding..." : "Wishlist"}
              </motion.button>

            </div>

          </div>

        </div>
      </motion.div>



      {/* REVIEW FORM */}

      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        className="bg-base-200 p-6 rounded-3xl shadow-lg"
      >

        <h2 className="text-xl font-bold text-[#8B5E3C] mb-4">
          Write a Review
        </h2>

        {!user ? (
          <p>Please login to review</p>
        ) : !eligible ? (
          <p>{eligibleReason}</p>
        ) : (

          <form onSubmit={submitReview} className="space-y-4">

            {/* Rating */}
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  className={`px-3 py-2 rounded-lg border ${
                    rating === i
                    ? "bg-[#8B5E3C] text-white"
                    : "border-[#8B5E3C] text-[#8B5E3C]"
                  }`}
                >
                  {i} ★
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              rows="4"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
              placeholder="Write your review..."
              required
            />

            <button
              disabled={submitting}
              className="bg-[#8B5E3C] text-white px-6 py-2 rounded-lg hover:bg-[#A47148]"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>

          </form>
        )}

      </motion.div>



      {/* REVIEWS */}

      <div className="bg-base-200 p-6 rounded-3xl shadow-lg">

        <h2 className="text-xl font-bold text-[#8B5E3C] mb-4">
          Reviews
        </h2>

        {reviewLoading ? (
          <span className="loading loading-spinner text-[#8B5E3C]"></span>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (

          <div className="space-y-4">

            {reviews.map((r) => (

              <motion.div
                key={r._id}
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                className="bg-base-100 p-4 rounded-xl border"
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <img
                      src={r.userPhoto || "https://i.ibb.co/2kRZpF0/user.png"}
                      className="w-10 h-10 rounded-full"
                    />

                    <div>
                      <p className="font-semibold">{r.userName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <div className="text-yellow-500 font-semibold">
                    {"★".repeat(r.rating)}
                  </div>

                </div>

                <p className="mt-3 text-gray-700">{r.comment}</p>

              </motion.div>

            ))}

          </div>
        )}
      </div>

    </div>
  );
}