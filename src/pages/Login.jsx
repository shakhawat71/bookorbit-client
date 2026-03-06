/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Chrome,
  Loader2,
  XCircle,
  CheckCircle2,
} from "lucide-react";

// ---------- Gorgeous Toast ----------
const showToast = {
  success: (title, desc) =>
    toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-[92vw] max-w-sm rounded-2xl border border-emerald-200 bg-white shadow-xl ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="p-4 flex gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 grid place-items-center">
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-emerald-700">{title}</p>
              {desc ? <p className="text-sm text-gray-600 mt-0.5">{desc}</p> : null}
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="h-8 w-8 rounded-xl hover:bg-gray-100 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="h-1 w-full bg-emerald-100 overflow-hidden rounded-b-2xl">
            <div className="h-full w-full bg-emerald-500 animate-[toastbar_3s_linear_forwards]" />
          </div>
        </div>
      ),
      { duration: 3000 }
    ),

  error: (title, desc) =>
    toast.custom(
      (t) => (
        <div
          className={`pointer-events-auto w-[92vw] max-w-sm rounded-2xl border border-rose-200 bg-white shadow-xl ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="p-4 flex gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 grid place-items-center">
              <XCircle className="text-rose-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-rose-700">{title}</p>
              {desc ? <p className="text-sm text-gray-600 mt-0.5">{desc}</p> : null}
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="h-8 w-8 rounded-xl hover:bg-gray-100 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="h-1 w-full bg-rose-100 overflow-hidden rounded-b-2xl">
            <div className="h-full w-full bg-rose-500 animate-[toastbar_3s_linear_forwards]" />
          </div>
        </div>
      ),
      { duration: 3200 }
    ),
};

export default function Login() {
  const { loginUser, googleLogin } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const busy = loadingEmail || loadingGoogle;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (busy) return;

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email) return showToast.error("Email required", "Please enter your email.");
    if (!password) return showToast.error("Password required", "Please enter your password.");

    try {
      setLoadingEmail(true);

      const result = await loginUser(email, password);
      const user = result.user;
      const token = await user.getIdToken(true);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          name: user.displayName || "",
          email: user.email,
          photoURL: user.photoURL || "",
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      showToast.success("Welcome back!", "Login successful.");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      showToast.error("Login failed", error?.message || "Please try again.");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (busy) return;

    try {
      setLoadingGoogle(true);

      const result = await googleLogin();
      const user = result.user;
      const token = await user.getIdToken(true);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          name: user.displayName || "",
          email: user.email,
          photoURL: user.photoURL || "",
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      showToast.success("Signed in with Google", "You're good to go.");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      showToast.error("Google login failed", error?.message || "Please try again.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-base-100 flex items-center justify-center px-4 overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-80 h-80 bg-[#8B5E3C] opacity-10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#A47148] opacity-10 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md bg-base-200 shadow-2xl rounded-3xl border border-base-300 overflow-hidden"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-[#8B5E3C] via-[#A47148] to-[#8B5E3C]" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C]">
                <ShieldCheck size={14} />
                Secure access
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-[#8B5E3C]">
                Login to BookOrbit
              </h2>
              <p className="text-sm text-base-content/60 mt-1">
                Continue to your dashboard and orders.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[#8B5E3C]">
              <Sparkles size={18} />
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-base-content/60">Email</span>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
                <Mail size={16} className="text-[#8B5E3C]" />
                <input
                  type="email"
                  name="email"
                  required
                  disabled={busy}
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-base-content/60">Password</span>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
                <Lock size={16} className="text-[#8B5E3C]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  disabled={busy}
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="h-8 w-8 rounded-xl hover:bg-base-200 grid place-items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={busy}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-base-content/60" />
                  ) : (
                    <Eye size={18} className="text-base-content/60" />
                  )}
                </button>
              </div>
            </label>

            <motion.button
              whileHover={{ scale: busy ? 1 : 1.02 }}
              whileTap={{ scale: busy ? 1 : 0.98 }}
              type="submit"
              disabled={busy}
              className="w-full btn border-0 bg-[#8B5E3C] text-white hover:bg-[#A47148] rounded-2xl"
            >
              {loadingEmail ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          <div className="my-5 flex items-center">
            <div className="grow border-t border-base-300"></div>
            <span className="mx-3 text-base-content/50 text-xs font-semibold">OR</span>
            <div className="grow border-t border-base-300"></div>
          </div>

          <motion.button
            whileHover={{ scale: busy ? 1 : 1.02 }}
            whileTap={{ scale: busy ? 1 : 0.98 }}
            onClick={handleGoogleLogin}
            disabled={busy}
            className="w-full btn rounded-2xl bg-base-100 border border-[#8B5E3C]/40 text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
          >
            {loadingGoogle ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Connecting...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Chrome size={18} />
                Continue with Google
              </span>
            )}
          </motion.button>

          <p className="mt-6 text-center text-sm text-base-content/60">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#8B5E3C] font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes toastbar { from { transform: translateX(-100%); } to { transform: translateX(0%); } }
        .animate-enter { animation: enter 200ms ease-out; }
        .animate-leave { animation: leave 160ms ease-in forwards; }
        @keyframes enter { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes leave { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(6px) scale(.98); } }
      `}</style>
    </div>
  );
}