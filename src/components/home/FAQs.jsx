import { motion } from "framer-motion";

export default function FAQs() {
  const faqs = [
    {
      q: "How do I buy a book?",
      a: "Open a book's details page and click Buy Now. Fill in your delivery info and confirm the order.",
    },
    {
      q: "Can I cancel an order?",
      a: "Yes, you can cancel while it's pending and unpaid (the cancel button hides after payment).",
    },
    {
      q: "Who can add books?",
      a: "Librarians and admins can add books from the dashboard.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#8B5E3C]">Quick FAQs</h2>
        <p className="mt-3 text-base-content/70">
          Everything you need to know before ordering.
        </p>
      </div>

      <div className="mt-8 max-w-3xl mx-auto space-y-3">
        {faqs.map((item) => (
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
  );
}
