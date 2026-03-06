/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function AllBooks() {
  const prefersReducedMotion = useReducedMotion();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // small UX extras
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest"); // newest | price_low | price_high | name

  useEffect(() => {
  let mounted = true;

  const fetchBooksWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/books?status=published`
        );

        if (mounted) {
          setBooks(res.data || []);
          setLoading(false);
        }
        return;
      } catch (error) {
        if (i === retries - 1) {
          if (mounted) {
            setBooks([]);
            setLoading(false);
          }
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
  };

  setLoading(true);
  fetchBooksWithRetry();

  return () => {
    mounted = false;
  };
}, []);

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = [...(books || [])];

    if (q) {
      list = list.filter((b) => {
        const name = String(b?.name || "").toLowerCase();
        const author = String(b?.author || "").toLowerCase();
        return name.includes(q) || author.includes(q);
      });
    }

    if (sort === "price_low") {
      list.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    } else if (sort === "price_high") {
      list.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    } else if (sort === "name") {
      list.sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""))
      );
    } else {
      // newest
      list.sort((a, b) => {
        const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }

    return list;
  }, [books, query, sort]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-bold text-[#8B5E3C]">All Books</h2>
          <p className="mt-2 text-base-content/70">
            Browse published books and explore details.
          </p>
        </motion.div>

        {/* Search + Sort */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
          <label className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
              <Search size={18} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by book or author..."
              className="w-full sm:w-72 pl-10 pr-4 py-2 rounded-xl border bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full sm:w-52 py-2 px-3 rounded-xl border bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
          >
            <option value="newest">Newest</option>
            <option value="name">Name (A-Z)</option>
            <option value="price_low">Price (Low → High)</option>
            <option value="price_high">Price (High → Low)</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="popLayout">
        {filteredBooks.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-10 text-base-content/60"
          >
            No books found.
          </motion.p>
        ) : (
          <motion.div
            key="grid"
            initial="hidden"
            animate="show"
            variants={stagger}
            className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBooks.map((book) => (
              <motion.div
                key={book._id}
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.99 },
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
                    : { y: -6, transition: { duration: 0.2 } }
                }
                className="bg-base-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={book.image}
                    alt={book.name}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: 0.35 }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg">{book.name}</h3>
                  <p className="text-sm text-base-content/60">{book.author}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-semibold text-[#8B5E3C]">৳ {book.price}</p>

                    <Link
                      to={`/books/${book._id}`}
                      className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                    >
                      View Details <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}