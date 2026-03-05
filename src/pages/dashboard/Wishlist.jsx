import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const navigate = useNavigate();

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/wishlist/my");
      setItems(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (id) => {
    try {
      setActionId(id);
      await axiosSecure.delete(`/wishlist/${id}`);
      toast.success("Removed from wishlist");
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      console.log(err);
      toast.error("Remove failed");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        My Wishlist
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No wishlist items yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((w) => (
            <div
              key={w._id}
              className="bg-base-100 rounded-xl p-4 flex gap-4 shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/books/${w.bookId}`)} // ✅ Go to BookDetails
            >
              <img
                src={w.bookImage}
                alt={w.bookName}
                className="w-20 h-28 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-bold">{w.bookName}</h3>

                <p className="text-sm text-gray-500">
                  {w.bookAuthor}
                </p>

                <p className="mt-1 font-semibold text-[#8B5E3C]">
                  ৳ {w.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigation
                    removeItem(w._id);
                  }}
                  disabled={actionId === w._id}
                  className="mt-3 btn btn-sm bg-red-600 text-white hover:bg-red-700"
                >
                  {actionId === w._id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}