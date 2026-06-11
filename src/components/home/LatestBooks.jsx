import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BooksGridSkeleton } from "../ui/Skeleton";

const truncate = (text = "", max = 120) => {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max).trimEnd() + "..." : t;
};

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function LatestBooks({ books, loading }) {
  const prefersReducedMotion = useReducedMotion();
  const latestBooks = books?.slice(0, 8) || [];

  // Show skeleton while loading
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="h-8 bg-base-300 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-base-300 rounded w-48 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-base-300 rounded w-24 animate-pulse"></div>
        </div>
        <BooksGridSkeleton count={8} />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
        className="flex items-end justify-between gap-4"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-bold text-[#8B5E3C]">Latest Books</h2>
          <p className="mt-2 text-base-content/70">
            The newest books added.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Link
            to="/books"
            className="btn btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
          >
            View All
          </Link>
        </motion.div>
      </motion.div>

      {latestBooks.length > 0 ? (
        <>
          {/* Desktop & iPad: Show all 8 books (2 rows of 4 columns) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="hidden md:grid mt-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {latestBooks.map((b) => (
              <motion.div
                key={b._id}
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.985 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: -6,
                        transition: { duration: 0.2 },
                      }
                }
                className="bg-base-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={b.image}
                    alt={b.name}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: 0.35 }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold line-clamp-1">{b.name}</h3>
                  <p className="text-sm font-semibold text-base-content/60">{b.author}</p>
                  <p className="mt-3 text-sm text-base-content/70 line-clamp-2">
                    {truncate(b.description, 110)}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold text-[#8B5E3C]">৳ {b.price}</p>
                    <Link
                      to={`/books/${b._id}`}
                      className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile: Show only 6 books (2 rows of 3 columns) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="md:hidden grid grid-cols-2 gap-6 mt-8"
          >
            {latestBooks.slice(0, 6).map((b) => (
              <motion.div
                key={b._id}
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.985 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: -6,
                        transition: { duration: 0.2 },
                      }
                }
                className="bg-base-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={b.image}
                    alt={b.name}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: 0.35 }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold line-clamp-1">{b.name}</h3>
                  <p className="text-xs font-semibold text-base-content/60">{b.author}</p>
                  <p className="mt-2 text-xs text-base-content/70 line-clamp-2">
                    {truncate(b.description, 80)}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-semibold text-[#8B5E3C] text-sm">৳ {b.price}</p>
                    <Link
                      to={`/books/${b._id}`}
                      className="btn btn-xs bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center py-12 bg-base-200 rounded-2xl"
        >
          <p className="text-base-content/60">No books found.</p>
        </motion.div>
      )}
    </section>
  );
}