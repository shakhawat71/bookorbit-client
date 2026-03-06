/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Star,
  MapPin,
  Truck,
  ShieldCheck,
  Clock,
  BookOpen,
  Sparkles,
  BadgeCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import map from "../assets/Bangladesh_location_map.svg.png";

const truncate = (text = "", max = 120) => {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max).trimEnd() + "..." : t;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

const softFloat = (prefersReduced) => ({
  animate: prefersReduced ? {} : { y: [0, -8, 0], x: [0, 6, 0] },
  transition: prefersReduced
    ? {}
    : { duration: 8, repeat: Infinity, ease: "easeInOut" },
});

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [active, setActive] = useState(0);
  const SLIDE_COUNT = 3;
  const pauseRef = useRef(false);

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

  const sliderBooks = useMemo(() => {
    const candidates = books?.length ? shuffle(books) : [];
    return candidates.slice(0, SLIDE_COUNT);
  }, [books]);

  const latestBooks = useMemo(() => {
    const sorted = [...(books || [])].sort((a, b) => {
      const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
    return sorted.slice(0, 6);
  }, [books]);

  useEffect(() => {
    if (!sliderBooks?.length) return;

    const t = setInterval(() => {
      if (pauseRef.current) return;
      setActive((prev) => (prev + 1) % Math.min(SLIDE_COUNT, sliderBooks.length));
    }, 4500);

    return () => clearInterval(t);
  }, [sliderBooks]);

  const goPrev = () => {
    if (!sliderBooks?.length) return;
    const n = Math.min(SLIDE_COUNT, sliderBooks.length);
    setActive((p) => (p - 1 + n) % n);
  };

  const goNext = () => {
    if (!sliderBooks?.length) return;
    const n = Math.min(SLIDE_COUNT, sliderBooks.length);
    setActive((p) => (p + 1) % n);
  };

  const coverageCities = [
    "Dhaka",
    "Chattogram",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ];

  const featurePills = [
    { icon: <Sparkles size={16} />, text: "Fresh published books" },
    { icon: <BadgeCheck size={16} />, text: "Verified librarians & admin" },
    { icon: <Zap size={16} />, text: "Fast checkout & tracking" },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[#8B5E3C] opacity-12 blur-3xl"
          {...softFloat(prefersReducedMotion)}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-[#A47148] opacity-12 blur-3xl"
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0], x: [0, -8, 0] }}
          transition={
            prefersReducedMotion
              ? {}
              : { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-24 right-1/3 h-56 w-56 rounded-full bg-[#8B5E3C] opacity-10 blur-3xl"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1] }}
          transition={
            prefersReducedMotion
              ? {}
              : { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] text-sm font-medium"
              >
                <Star size={16} />
                Fast library-to-home delivery
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-base-content"
              >
                Your next book is just one <span className="text-[#8B5E3C]">delivery</span> away.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-4 text-base md:text-lg text-base-content/70 max-w-xl"
              >
                Discover published books, buy instantly, and track your orders from your dashboard.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/books"
                  className="btn bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                >
                  Browse All Books <ArrowRight size={18} className="ml-1" />
                </Link>

                <Link
                  to="/dashboard/my-orders"
                  className="btn btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
                >
                  Go to Dashboard
                </Link>
              </motion.div>

              <motion.div variants={stagger} className="mt-7 flex flex-wrap gap-2">
                {featurePills.map((p) => (
                  <motion.div
                    key={p.text}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                    whileHover={
                      prefersReducedMotion
                        ? {}
                        : { y: -2, scale: 1.02, transition: { duration: 0.2 } }
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-2 shadow-sm"
                  >
                    <span className="text-[#8B5E3C]">{p.icon}</span>
                    <span className="text-sm font-medium text-base-content/80">
                      {p.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              onMouseEnter={() => (pauseRef.current = true)}
              onMouseLeave={() => (pauseRef.current = false)}
            >
              <div className="relative bg-base-200 rounded-3xl shadow-xl overflow-hidden">
                {sliderBooks?.length ? (
                  <>
                    <div className="relative h-90 sm:h-107.5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={sliderBooks[active]?._id || active}
                          initial={{ opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.99 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0"
                        >
                          <motion.img
                            src={sliderBooks[active]?.image}
                            alt={sliderBooks[active]?.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            animate={prefersReducedMotion ? {} : { scale: [1, 1.06, 1] }}
                            transition={
                              prefersReducedMotion
                                ? {}
                                : { duration: 6, repeat: Infinity, ease: "easeInOut" }
                            }
                          />

                          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

                          <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="absolute bottom-0 left-0 right-0 p-6"
                          >
                            <h3 className="text-white text-2xl font-bold">
                              {sliderBooks[active]?.name}
                            </h3>
                            <p className="mt-2 text-white/85 text-sm max-w-xl">
                              {truncate(sliderBooks[active]?.description, 120)}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <Link
                                to="/books"
                                className="btn btn-sm bg-white text-[#8B5E3C] hover:bg-base-200 border-0"
                              >
                                Explore All Books
                                <ArrowRight size={16} className="ml-1" />
                              </Link>
                            </div>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <motion.button
                        type="button"
                        onClick={goPrev}
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ scale: 1.04 }}
                        className="btn btn-sm btn-circle bg-black/40 text-white border-0 hover:bg-black/60"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={18} />
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={goNext}
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ scale: 1.04 }}
                        className="btn btn-sm btn-circle bg-black/40 text-white border-0 hover:bg-black/60"
                        aria-label="Next slide"
                      >
                        <ChevronRight size={18} />
                      </motion.button>
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {sliderBooks.slice(0, SLIDE_COUNT).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActive(i)}
                          className={[
                            "h-2.5 rounded-full transition-all duration-300",
                            i === active ? "w-8 bg-white" : "w-2.5 bg-white/50",
                          ].join(" ")}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-90 sm:h-105 flex items-center justify-center">
                    <p className="text-base-content/60">No published books yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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

        {latestBooks?.length ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  <h3 className="text-lg font-bold">{b.name}</h3>
                  <p className="text-sm text-base-content/60">{b.author}</p>
                  <p className="mt-3 text-sm text-base-content/70">
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
        ) : (
          <p className="mt-6 text-base-content/60">No books found.</p>
        )}
      </section>

      <section className="bg-base-200/60">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[#8B5E3C]">
                Coverage Across Bangladesh
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-3 text-base-content/70">
                We deliver to major cities and expanding continuously.
              </motion.p>

              <motion.div variants={stagger} className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {coverageCities.map((c) => (
                  <motion.div
                    key={c}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                    whileHover={prefersReducedMotion ? {} : { y: -2 }}
                    className="flex items-center gap-2 rounded-xl bg-base-100 p-3 shadow-sm"
                  >
                    <span className="text-[#8B5E3C]">
                      <MapPin size={16} />
                    </span>
                    <span className="text-sm font-medium">{c}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 rounded-2xl bg-base-100 p-5 shadow-sm">
                <h4 className="font-bold flex items-center gap-2">
                  <Truck size={18} className="text-[#8B5E3C]" />
                  Fast & reliable delivery
                </h4>
                <p className="mt-2 text-sm text-base-content/70">
                  Orders are processed quickly and tracked from your dashboard.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-base-100 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <motion.div
                  className="rounded-2xl overflow-hidden border border-base-300"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                >
                  <img
                    src={map}
                    alt="Bangladesh map"
                    className="w-full h-fit object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[#8B5E3C]">
            Why Choose BookOrbit
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-base-content/70">
            Better experience for students, researchers, and readers.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: <Truck size={18} />, title: "Doorstep Delivery", desc: "Get books delivered fast to your address." },
            { icon: <ShieldCheck size={18} />, title: "Secure Access", desc: "Role-based access for user, librarian, and admin." },
            { icon: <Clock size={18} />, title: "Order Tracking", desc: "Track order status from your dashboard." },
            { icon: <BookOpen size={18} />, title: "Curated Books", desc: "Browse published books and buy confidently." },
          ].map((x) => (
            <motion.div
              key={x.title}
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.99 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              whileHover={prefersReducedMotion ? {} : { y: -6 }}
              className="bg-base-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
            >
              <div className="h-11 w-11 rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center">
                {x.icon}
              </div>
              <h3 className="mt-4 font-bold text-lg">{x.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{x.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-base-200/60">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#8B5E3C]">
                What Readers Say
              </h2>
              <p className="mt-2 text-base-content/70 max-w-xl">
                A smooth experience from browsing to delivery.
              </p>
            </div>
            <Link
              to="/books"
              className="btn bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
            >
              Start Browsing <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-8 grid md:grid-cols-3 gap-6"
          >
            {[
              { name: "Student", text: "Ordering books for assignments is super easy and delivery is fast." },
              { name: "Researcher", text: "I can find published books quickly and keep everything tracked in one place." },
              { name: "Book Lover", text: "The wishlist + simple checkout flow makes it convenient to buy later." },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                className="bg-base-100 rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center gap-1 text-[#8B5E3C]">
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                </div>
                <p className="mt-3 text-sm text-base-content/75">{t.text}</p>
                <p className="mt-4 font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#8B5E3C]">Quick FAQs</h2>
          <p className="mt-3 text-base-content/70">
            Everything you need to know before ordering.
          </p>
        </div>

        <div className="mt-8 max-w-3xl mx-auto space-y-3">
          {[
            {
              q: "How do I buy a book?",
              a: "Open a book’s details page and click Buy Now. Fill in your delivery info and confirm the order.",
            },
            {
              q: "Can I cancel an order?",
              a: "Yes, you can cancel while it’s pending and unpaid (the cancel button hides after payment).",
            },
            {
              q: "Who can add books?",
              a: "Librarians and admins can add books from the dashboard.",
            },
          ].map((item) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
              className="collapse collapse-arrow bg-base-200 rounded-2xl"
            >
              <input type="checkbox" />
              <div className="collapse-title text-base font-semibold">
                {item.q}
              </div>
              <div className="collapse-content text-sm text-base-content/70">
                <p>{item.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}