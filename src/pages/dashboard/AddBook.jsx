import { useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure"; 


export default function AddBook() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    image: "",
    price: "",
    status: "unpublished",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await axiosSecure.post("/books", formData);

    if (response.data.insertedId) {
      toast.success("Book added successfully!");

      setFormData({
        name: "",
        author: "",
        image: "",
        price: "",
        status: "unpublished",
        description: "",
      });
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Failed to add book");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto bg-base-200 shadow-xl rounded-2xl p-8">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        Add New Book
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
            placeholder="Enter book name"
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
            placeholder="Enter author name"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block mb-2 font-medium text-[#8B5E3C]">
            Book Image URL
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="Paste image URL"
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
            placeholder="Enter price"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          />
        </div>

        {/* Status Dropdown */}
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
            Book Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Write a short description about the book..."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#8B5E3C]"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5E3C] text-white py-3 rounded-lg hover:bg-[#A47148] transition"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
