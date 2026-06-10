import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Star,
  BadgeCheck,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const truncate = (text = "", max = 120) => {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max).trimEnd() + "..." : t;
};

const softFloat = (prefersReduced) => ({
  animate: prefersReduced ? {} : { y: [0, -8, 0], x: [0, 6, 0] },
  transition: prefersReduced
    ? {}
    : { duration: 8, repeat: Infinity, ease: "easeInOut" },
});

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

export default function HeroSlider({ sliderBooks, loading }) {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const SLIDE_COUNT = 3;
  const pauseRef = useRef(false);

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
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute -top-28 -left-28 h-96 w-96 rounded-full opacity-12 blur-3xl"
        {...softFloat(prefersReducedMotion)}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full opacity-12 blur-3xl"
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5E3C]/30 text-[#8B5E3C] text-sm font-medium"
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
  );
}
