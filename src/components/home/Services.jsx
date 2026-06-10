import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  ShoppingCart,
  Heart,
  Library,
  Headphones,
  X,
  Phone,
  Copy,
  Check,
  Users,
  Shield,
  BookMarked,
} from "lucide-react";
import { Link } from "react-router-dom";

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

export default function Services() {
  const prefersReducedMotion = useReducedMotion();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLibrarianModalOpen, setIsLibrarianModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const contactNumber = "+880 1XXX-XXXXXX";

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(contactNumber.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const services = [
    {
      icon: <BookOpen size={28} />,
      title: "Wide Book Collection",
      description:
        "Access thousands of books across genres—academic, fiction, research, and more.",
      link: "/books",
      linkText: "Explore Books",
      modalType: null,
    },
    {
      icon: <ShoppingCart size={28} />,
      title: "Easy Purchase",
      description:
        "Buy books in seconds with our streamlined checkout process. No hassle, just reading.",
      link: "/books",
      linkText: "Start Shopping",
      modalType: null,
    },
    {
      icon: <LayoutDashboard size={28} />,
      title: "Personal Dashboard",
      description:
        "Track orders, manage your library, and view purchase history—all in one place.",
      link: "/dashboard",
      linkText: "Go to Dashboard",
      modalType: null,
    },
    {
      icon: <Heart size={28} />,
      title: "Wishlist",
      description:
        "Save books you love for later. Never forget a book you wanted to read.",
      link: "/dashboard/wishlist",
      linkText: "View Wishlist",
      modalType: null,
    },
    {
      icon: <Library size={28} />,
      title: "Librarian Support",
      description:
        "Dedicated librarians curate and manage books to ensure quality content.",
      link: "#",
      linkText: "Learn More",
      modalType: "librarian",
    },
    {
      icon: <Headphones size={28} />,
      title: "24/7 Customer Support",
      description:
        "Got questions? Our support team is always ready to help you with your orders.",
      link: "#",
      linkText: "Contact Us",
      modalType: "contact",
    },
  ];

  const handleServiceClick = (service, e) => {
    if (service.modalType === "contact") {
      e.preventDefault();
      setIsContactModalOpen(true);
    } else if (service.modalType === "librarian") {
      e.preventDefault();
      setIsLibrarianModalOpen(true);
    }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[#8B5E3C]">
            Our Services
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-base-content/70">
            Everything you need to discover, buy, and enjoy books online.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.98 },
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
              className="group bg-base-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-[#8B5E3C]/20"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>

              <h3 className="mt-5 text-xl font-bold text-base-content">
                {service.title}
              </h3>

              <p className="mt-3 text-sm text-base-content/70 leading-relaxed">
                {service.description}
              </p>

              <Link
                to={service.link}
                onClick={(e) => handleServiceClick(service, e)}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#8B5E3C] hover:gap-2 transition-all duration-200"
              >
                {service.linkText}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsContactModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-md w-full bg-base-100 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-base-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center">
                  <Phone size={20} />
                </div>
                <h3 className="text-xl font-bold text-base-content">
                  Contact Support
                </h3>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-base-content/50 hover:text-base-content transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-base-content/70 text-center mb-6">
                Our customer support team is available 24/7. Call us anytime for assistance.
              </p>

              <div className="bg-base-200 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#8B5E3C]" />
                    <span className="text-lg font-mono font-semibold text-base-content">
                      {contactNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyNumber}
                    className="btn btn-sm bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0 gap-1"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-base-content/50 text-center mt-5">
                Available via call or WhatsApp
              </p>
            </div>

            <div className="p-5 bg-base-200/50 border-t border-base-200">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-full btn btn-outline border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Librarian Support Modal */}
      {isLibrarianModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsLibrarianModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-lg w-full bg-base-100 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-base-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center">
                  <Library size={20} />
                </div>
                <h3 className="text-xl font-bold text-base-content">
                  Librarian Support
                </h3>
              </div>
              <button
                onClick={() => setIsLibrarianModalOpen(false)}
                className="text-base-content/50 hover:text-base-content transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-base text-base-content/80 leading-relaxed mb-6">
                Our dedicated librarians work behind the scenes to ensure you get the best reading experience. Here's how they help:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <BookMarked size={18} className="text-[#8B5E3C]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">Book Curation</h4>
                    <p className="text-sm text-base-content/70">
                      Expert librarians carefully select and verify each book before it's published on our platform.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Shield size={18} className="text-[#8B5E3C]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">Quality Assurance</h4>
                    <p className="text-sm text-base-content/70">
                      Every book undergoes a thorough quality check for accurate metadata, covers, and descriptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Users size={18} className="text-[#8B5E3C]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">Reader Support</h4>
                    <p className="text-sm text-base-content/70">
                      Librarians help readers find the right books and answer questions about the collection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#8B5E3C]/5 rounded-xl border border-[#8B5E3C]/10">
                <p className="text-sm text-base-content/80 italic">
                  "Our librarians are passionate about connecting readers with knowledge. We're here to make your book discovery journey seamless and enjoyable."
                </p>
                <p className="text-xs text-[#8B5E3C] mt-2 font-medium">
                  — BookOrbit Librarian Team
                </p>
              </div>
            </div>

            <div className="p-5 bg-base-200/50 border-t border-base-200">
              <button
                onClick={() => setIsLibrarianModalOpen(false)}
                className="w-full btn bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}