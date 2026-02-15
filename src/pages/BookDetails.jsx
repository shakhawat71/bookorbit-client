// src/pages/BookDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!book) return <div className="p-6">Book not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={book.image}
          alt={book.name}
          className="w-full rounded-xl border"
        />

        <div>
          <h1 className="text-3xl font-bold text-[#8B5E3C]">{book.name}</h1>
          <p className="mt-2 text-gray-600">Author: {book.author}</p>

          <p className="mt-4 text-gray-700 whitespace-pre-line">
            {book.description}
          </p>

          <p className="mt-6 text-xl font-semibold">
            Price: <span className="text-[#8B5E3C]">{book.price}</span>
          </p>

          <button
            onClick={() => navigate(`/books/${book._id}/buy`)}
            className="mt-6 w-full md:w-auto px-6 py-2 rounded-md bg-[#8B5E3C] text-white hover:bg-[#A47148] transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
