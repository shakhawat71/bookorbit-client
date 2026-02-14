import { useState } from "react";
import toast from "react-hot-toast";

export default function AllUsers() {
  // Temporary dummy users (replace with API later)
  const [users, setUsers] = useState([
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    },
    {
      _id: "2",
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "librarian",
    },
    {
      _id: "3",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    },
  ]);

  const updateRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, role: newRole } : user
      )
    );

    toast.success(`User role updated to ${newRole}`);
  };

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        All Users
      </h1>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-[#8B5E3C] text-white">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Make Librarian</th>
              <th>Make Admin</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "librarian"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  {user.role !== "librarian" && (
                    <button
                      onClick={() =>
                        updateRole(user._id, "librarian")
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Make Librarian
                    </button>
                  )}
                </td>

                <td>
                  {user.role !== "admin" && (
                    <button
                      onClick={() =>
                        updateRole(user._id, "admin")
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
