import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

import { auth } from "../../firebase/firebase.config";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { CheckCircle2, XCircle } from "lucide-react";

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

export default function MyProfile() {
  const { user, role, updateUserProfile } = useContext(AuthContext);

  const [name, setName] = useState(user?.displayName || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || "");

  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    setName(user?.displayName || "");
    setPreview(user?.photoURL || "");
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImageToImgbb = async () => {
    if (!imageFile) return null;

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      showToast.error("Missing API key", "IMGBB API key missing in .env");
      return null;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data?.data?.display_url || null;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast.error("No user found", "Please login again.");
      return;
    }

    try {
      setSavingProfile(true);

      let photoURL = user?.photoURL || "";
      if (imageFile) {
        const uploadedUrl = await uploadImageToImgbb();
        if (!uploadedUrl) {
          setSavingProfile(false);
          return showToast.error("Image upload failed", "Please try again.");
        }
        photoURL = uploadedUrl;
      }

      await updateUserProfile(name, photoURL);

      const token = await auth.currentUser.getIdToken(true);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          name: name || "",
          email: user.email,
          photoURL: photoURL || "",
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      showToast.success("Profile updated", "Your changes have been saved.");
      setImageFile(null);
    } catch (err) {
      console.log(err);
      showToast.error(
        "Update failed",
        err?.response?.data?.message || err?.message || "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      showToast.error("No user email found", "Please login again.");
      return;
    }

    if (newPassword.length < 6) {
      return showToast.error(
        "Weak password",
        "New password must be at least 6 characters"
      );
    }

    if (newPassword !== confirmNewPassword) {
      return showToast.error(
        "Password mismatch",
        "New passwords do not match"
      );
    }

    try {
      setChangingPass(true);

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      showToast.success("Password changed", "Your password was updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.log(err);
      showToast.error(
        "Password change failed",
        err?.message || "Failed to change password"
      );
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">My Profile</h1>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={preview || "https://i.ibb.co/2kRZpF0/user.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#8B5E3C]"
          />

          <div className="flex-1 space-y-1 text-center md:text-left">
            <p className="text-lg font-semibold text-[#8B5E3C]">
              {user?.displayName || "No Name"}
            </p>

            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user?.email || "—"}
            </p>

            <p className="text-gray-700">
              <span className="font-medium">Role:</span>{" "}
              <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                {role || "user"}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#8B5E3C] mb-3">
            Update Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="grid gap-4">
            <div>
              <label className="block mb-1 font-medium text-[#8B5E3C]">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-[#8B5E3C]">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose an image from your device.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-[#8B5E3C] text-white py-2 rounded-md font-medium hover:bg-[#A47148] transition disabled:opacity-60"
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold text-[#8B5E3C] mb-4">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="grid gap-4">
          <div>
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#8B5E3C]">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="w-full border border-[#8B5E3C] text-[#8B5E3C] py-2 rounded-md font-medium hover:bg-[#8B5E3C] hover:text-white transition disabled:opacity-60"
          >
            {changingPass ? "Changing..." : "Change Password"}
          </button>

          <p className="text-xs text-gray-500">
            Note: Password change needs your current password.
          </p>
        </form>
      </div>

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