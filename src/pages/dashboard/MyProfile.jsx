// ✅ src/pages/dashboard/MyProfile.jsx (FULL)
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function MyProfile() {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto bg-base-200 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img
          src={user?.photoURL || "https://i.ibb.co/2kRZpF0/user.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-[#8B5E3C]"
        />

        <div className="flex-1 space-y-2 text-center md:text-left">
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

          <p className="text-gray-500 text-sm">
            UID: {user?.uid || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}