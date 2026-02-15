// src/pages/BuyBook.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../contexts/AuthContext";

export default function BuyBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (e) {
        console.error(e);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!book?._id) return toast.error("Book not found");

    const form = e.target;
    const customerName = form.customerName.value;
    const phone = form.phone.value;
    const address = form.address.value;

    const orderPayload = {
      bookId: book._id,
      bookName: book.name,
      bookImage: book.image,
      price: book.price,
      librarianEmail: book.librarianEmail,
      customerName,
      phone,
      address,
      buyerEmail: user?.email, // optional extra
    };

    try {
      await axiosSecure.post("/orders", orderPayload);
      toast.success("Order placed! ✅");
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to place order");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!book) return <div className="p-6">Book not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-base-200 rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-[#8B5E3C]">
          Buy: {book.name}
        </h2>
        <p className="text-gray-600 mt-1">Price: {book.price}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              Your Name
            </label>
            <input
              name="customerName"
              required
              defaultValue={user?.displayName || ""}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              Phone
            </label>
            <input
              name="phone"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              Address
            </label>
            <textarea
              name="address"
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              placeholder="Your delivery address"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B5E3C] text-white py-2 rounded-md font-medium hover:bg-[#A47148] transition"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
}
