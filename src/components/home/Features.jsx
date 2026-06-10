import { motion, useReducedMotion } from "framer-motion";
import { Truck, ShieldCheck, Clock, BookOpen } from "lucide-react";

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

export default function Features() {
  const prefersReducedMotion = useReducedMotion();

  const features = [
    { icon: <Truck size={18} />, title: "Doorstep Delivery", desc: "Get books delivered fast to your address." },
    { icon: <ShieldCheck size={18} />, title: "Secure Access", desc: "Role-based access for user, librarian, and admin." },
    { icon: <Clock size={18} />, title: "Order Tracking", desc: "Track order status from your dashboard." },
    { icon: <BookOpen size={18} />, title: "Curated Books", desc: "Browse published books and buy confidently." },
  ];

  return (
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
        {features.map((x) => (
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
  );
}
