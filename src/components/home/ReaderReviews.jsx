import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const truncate = (text = "", max = 120) => {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max).trimEnd() + "..." : t;
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function ReaderReviews({ reviews, reviewsLoading }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-base-200/60">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#8B5E3C]">
              What Readers Say
            </h2>
            <p className="mt-2 text-base-content/70 max-w-xl">
              Real reviews from our community of readers and book lovers.
            </p>
          </div>
          <Link
            to="/books"
            className="btn bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
          >
            Start Browsing <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        {reviewsLoading ? (
          <div className="mt-8 flex items-center justify-center">
            <span className="loading loading-spinner text-[#8B5E3C]"></span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-base-content/70">No reviews yet. Be the first to review a book!</p>
          </div>
        ) : (
          <>
            {/* Desktop: Show 4 cards (lg:grid-cols-4) */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="hidden lg:grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {reviews.slice(0, 4).map((review) => (
                <motion.div
                  key={review._id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  className="bg-base-100 rounded-2xl shadow-md p-6"
                >
                  <div className="flex items-center gap-1 text-[#8B5E3C]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? "#8B5E3C" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-base-content/75">
                    "{truncate(review.comment, 150)}"
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={review.userPhoto || "https://i.ibb.co/2kRZpF0/user.png"}
                      alt={review.userName || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{review.userName}</p>
                      <p className="text-xs text-base-content/50">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tablet: Show 3 cards (md:grid-cols-3) */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="hidden md:grid lg:hidden mt-8 grid-cols-1 md:grid-cols-3 gap-6"
            >
              {reviews.slice(0, 3).map((review) => (
                <motion.div
                  key={review._id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  className="bg-base-100 rounded-2xl shadow-md p-6"
                >
                  <div className="flex items-center gap-1 text-[#8B5E3C]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? "#8B5E3C" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-base-content/75">
                    "{truncate(review.comment, 150)}"
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={review.userPhoto || "https://i.ibb.co/2kRZpF0/user.png"}
                      alt={review.userName || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{review.userName}</p>
                      <p className="text-xs text-base-content/50">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile: Show 2 columns with 4 cards (grid-cols-2) */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="md:hidden grid grid-cols-2 gap-4 mt-8"
            >
              {reviews.slice(0, 4).map((review) => (
                <motion.div
                  key={review._id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  className="bg-base-100 rounded-2xl shadow-md p-4"
                >
                  <div className="flex items-center gap-1 text-[#8B5E3C]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? "#8B5E3C" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-base-content/75 line-clamp-3">
                    "{truncate(review.comment, 100)}"
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <img
                      src={review.userPhoto || "https://i.ibb.co/2kRZpF0/user.png"}
                      alt={review.userName || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-xs">{review.userName}</p>
                      <p className="text-xs text-base-content/50">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}