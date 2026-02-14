import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";

export default function Register() {
  const { createUser, updateUserProfile, googleLogin } =
    useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 
  // Handle Image Selection
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

 
  // Upload Image to imgbb
  
  const uploadImage = async () => {
    if (!imageFile) return null;

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("IMGBB API key not configured");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error("Image upload failed");
    }

    return data.data.display_url;
  };

  
  // Handle Register
  
  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Password validation
    if (password !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
        confirmButtonColor: "#8B5E3C",
      });
    }

    if (password.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters.",
        confirmButtonColor: "#8B5E3C",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Must contain one uppercase letter.",
        confirmButtonColor: "#8B5E3C",
      });
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Must contain one special character.",
        confirmButtonColor: "#8B5E3C",
      });
    }

    try {
      setLoading(true);

      await createUser(email, password);

      let photoURL = null;

      if (imageFile) {
        photoURL = await uploadImage();
      }

      await updateUserProfile(name, photoURL);

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Welcome to BookOrbit",
        confirmButtonColor: "#8B5E3C",
      }).then(() => {
        navigate("/");
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        confirmButtonColor: "#8B5E3C",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Register
  
  const handleGoogleRegister = async () => {
    try {
      setLoading(true);

      await googleLogin();

      Swal.fire({
        icon: "success",
        title: "Registered with Google!",
        confirmButtonColor: "#8B5E3C",
      }).then(() => navigate("/"));

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
        confirmButtonColor: "#8B5E3C",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-base-200 shadow-xl rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-[#8B5E3C] mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Centered Image Preview */}
          <div className="flex flex-col items-center">
            {preview && (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#8B5E3C] mb-3"
              />
            )}

            <label className="text-[#8B5E3C] font-medium mb-1">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
          </div>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 text-[#8B5E3C] border rounded-md focus:ring-2 focus:ring-[#8B5E3C]"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 text-[#8B5E3C] border rounded-md focus:ring-2 focus:ring-[#8B5E3C]"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 text-[#8B5E3C] border rounded-md focus:ring-2 focus:ring-[#8B5E3C]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-2 text-[#8B5E3C] border rounded-md focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>  

          {/* Register Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5E3C] text-white py-2 rounded-md hover:bg-[#A47148]"
          >
            {loading ? "Creating..." : "Register"}
          </motion.button>
        </form>

        <div className="my-4 text-center text-gray-500 text-sm">OR</div>

        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full border border-[#8B5E3C] text-[#8B5E3C] py-2 rounded-md hover:bg-[#8B5E3C] hover:text-white"
        >
          Register with Google
        </button>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#8B5E3C] hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
