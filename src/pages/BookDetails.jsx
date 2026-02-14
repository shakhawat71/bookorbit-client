import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        bookId: id,
        bookTitle: "Sample Book", // replace later with real book data
        phone,
        address,
      };

      await axiosSecure.post("/orders", orderData);

      toast.success("Order placed successfully 🎉");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Book Details</h1>

      <form onSubmit={handleOrder} className="space-y-4">
        <input
          type="text"
          placeholder="Phone Number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-[#8B5E3C] text-white px-4 py-2 rounded"
        >
          Order Book
        </button>
      </form>
    </div>
  );
}
