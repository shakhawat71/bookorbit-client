import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxiosSecure";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionEmail, setActionEmail] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (email, role) => {
    try {
      setActionEmail(email);
      await axiosSecure.patch(`/users/role/${email}`, { role });
      toast.success(`Role updated to ${role}`);

      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role } : u))
      );
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Role update failed");
    } finally {
      setActionEmail(null);
    }
  };

  const badgeClass = (role) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "librarian") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#8B5E3C]">All Users</h1>

        <button
          onClick={loadUsers}
          className="btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
        >
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
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
              {users.map((user) => {
                const busy = actionEmail === user.email;
                return (
                  <tr key={user._id || user.email} className="hover">
                    <td>{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass(
                          user.role
                        )}`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    <td>
                      {user.role !== "librarian" && (
                        <button
                          disabled={busy}
                          onClick={() => updateRole(user.email, "librarian")}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                        >
                          {busy ? "Updating..." : "Make Librarian"}
                        </button>
                      )}
                    </td>

                    <td>
                      {user.role !== "admin" && (
                        <button
                          disabled={busy}
                          onClick={() => updateRole(user.email, "admin")}
                          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-60"
                        >
                          {busy ? "Updating..." : "Make Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}