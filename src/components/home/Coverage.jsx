import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Truck } from "lucide-react";
import map from "../../assets/Bangladesh_location_map.svg.png";

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

export default function Coverage() {
  const prefersReducedMotion = useReducedMotion();

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

  return (
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
  );
}
