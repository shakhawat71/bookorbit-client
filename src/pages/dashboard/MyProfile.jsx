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

export default function MyProfile() {
  const { user, role, updateUserProfile } = useContext(AuthContext);

  // ========= Profile states =========
  const [name, setName] = useState(user?.displayName || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || "");

  const [savingProfile, setSavingProfile] = useState(false);

  // ========= Password states =========
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
      toast.error("IMGBB API key missing in .env");
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

    if (!user) return toast.error("No user found");

    try {
      setSavingProfile(true);

      // 1) Upload image if selected
      let photoURL = user?.photoURL || "";
      if (imageFile) {
        const uploadedUrl = await uploadImageToImgbb();
        if (!uploadedUrl) {
          setSavingProfile(false);
          return toast.error("Image upload failed");
        }
        photoURL = uploadedUrl;
      }

      // 2) Update Firebase profile
      await updateUserProfile(name, photoURL);

      // 3) Sync to MongoDB
      await axios.put(`${import.meta.env.VITE_API_URL}/users`, {
        name: name || "",
        email: user.email,
        photoURL: photoURL || "",
      });

      toast.success("Profile updated");
      setImageFile(null);
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user?.email) return toast.error("No user email found");

    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      setChangingPass(true);

      // Re-authenticate user using current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      toast.success("Password changed ✅");

      // clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.log(err);

      // common firebase messages: wrong-password, requires-recent-login
      toast.error(err?.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===================== PROFILE CARD ===================== */}
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

      {/* ===================== CHANGE PASSWORD ===================== */}
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
    </div>
  );
}