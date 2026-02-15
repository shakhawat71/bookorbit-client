import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const { loginUser, googleLogin } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // ✅ Email Login
  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);

      const result = await loginUser(email, password);
      const user = result.user;

      // ✅ Save user in MongoDB
      await axios.put("http://localhost:5000/users", {
        name: user.displayName || "",
        email: user.email,
        photoURL: user.photoURL || "",
      });

      toast.success("Login successful 🎉");
      navigate(from, { replace: true });

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await googleLogin();
      const user = result.user;

      // ✅ Save user in MongoDB
      await axios.put("http://localhost:5000/users", {
        name: user.displayName || "",
        email: user.email,
        photoURL: user.photoURL || "",
      });

      toast.success("Google login successful 🎉");
      navigate(from, { replace: true });

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-base-100 flex items-center justify-center px-4 overflow-hidden">

      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-30 -left-30 w-80 h-80 bg-[#8B5E3C] opacity-10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-30 -right-30 w-80 h-80 bg-[#A47148] opacity-10 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-base-200 shadow-xl rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-[#8B5E3C] mb-6">
          Login to BookOrbit
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-[#8B5E3C] transition"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5E3C] text-white py-2 rounded-md font-medium hover:bg-[#A47148] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="my-4 flex items-center">
          <div className="grow border-t"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="grow border-t"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-[#8B5E3C] text-[#8B5E3C] py-2 rounded-md font-medium hover:bg-[#8B5E3C] hover:text-white transition"
        >
          Continue with Google
        </motion.button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#8B5E3C] font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
