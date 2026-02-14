import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function EditBook() {
  const { id } = useParams();

  // Temporary dummy book data (replace with API later)
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    image: "",
    price: "",
    status: "unpublished",
    description: "",
  });

  useEffect(() => {
    // 🔥 Later this will fetch book by ID
    const dummyBook = {
      name: "Atomic Habits",
      author: "James Clear",
      image:
        "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg",
      price: 20,
      status: "published",
      description: "A powerful guide to building good habits.",
    };

    setFormData(dummyBook);
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Book:", formData);

    toast.success("Book updated successfully (frontend only)");
  };

  return (
    <div className="max-w-4xl mx-auto bg-base-200 shadow-xl rounded-2xl p-8">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        Edit Book
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Book Name */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">
            Book Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          >
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-[#8B5E3C]">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-[#8B5E3C] text-white py-3 rounded-lg hover:bg-[#A47148]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
