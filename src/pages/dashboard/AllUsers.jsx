/* eslint-disable no-unused-vars */
// ✅ src/pages/dashboard/AllUsers.jsx (SaaS-style Admin Panel - Responsive + Animated + Modal Confirm + Gorgeous Toast)
// Requirements:
// - Tailwind + DaisyUI installed (you already use them)
// - framer-motion installed
// - react-hot-toast <Toaster/> mounted once in App.jsx or RootLayout

import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  RefreshCw,
  Shield,
  User2,
  Users,
  Crown,
  BadgeCheck,
  X,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";

// ---------- Gorgeous toast helpers ----------
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

// ---------- UI helpers ----------
const normalize = (s) => String(s || "").toLowerCase().trim();

const roleMeta = (role) => {
  if (role === "admin") {
    return {
      label: "Admin",
      pill: "bg-purple-100 text-purple-700",
      icon: <Crown size={14} className="text-purple-700" />,
    };
  }
  if (role === "librarian") {
    return {
      label: "Librarian",
      pill: "bg-blue-100 text-blue-700",
      icon: <BadgeCheck size={14} className="text-blue-700" />,
    };
  }
  return {
    label: "User",
    pill: "bg-gray-100 text-gray-700",
    icon: <User2 size={14} className="text-gray-700" />,
  };
};

function RolePill({ role }) {
  const m = roleMeta(role);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${m.pill}`}>
      {m.icon}
      {m.label}
    </span>
  );
}

// ---------- Confirm Modal ----------
function ConfirmModal({ open, title, description, confirmText = "Confirm", danger = false, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close overlay"
          />
          <motion.div
            className="fixed z-50 left-1/2 -translate-x-1/2 top-24 w-[92vw] max-w-lg bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.22 }}
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold text-[#8B5E3C]">{title}</p>
                  {description ? <p className="text-sm text-base-content/60 mt-1">{description}</p> : null}
                </div>
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-2xl hover:bg-base-200 grid place-items-center"
                  aria-label="Close"
                >
                  <X />
                </button>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button onClick={onClose} className="btn btn-outline rounded-2xl">
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className={`btn rounded-2xl border-0 ${
                    danger ? "bg-red-600 text-white hover:bg-red-700" : "bg-[#8B5E3C] text-white hover:bg-[#A47148]"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // actions
  const [actionEmail, setActionEmail] = useState(null);

  // filters
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | user | librarian | admin
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null); // { email, newRole, currentRole, name }

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
      showToast.error("Failed to load users", err?.response?.data?.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return (users || [])
      .filter((u) => {
        if (roleFilter !== "all" && (u?.role || "user") !== roleFilter) return false;

        if (!q) return true;

        const name = normalize(u?.name);
        const email = normalize(u?.email);
        return name.includes(q) || email.includes(q);
      })
      .sort((a, b) => {
        // admins on top, then librarians, then users
        const r = (x) => (x === "admin" ? 3 : x === "librarian" ? 2 : 1);
        return r(b?.role || "user") - r(a?.role || "user");
      });
  }, [users, query, roleFilter]);

  const stats = useMemo(() => {
    const all = users?.length || 0;
    const admins = (users || []).filter((u) => (u?.role || "user") === "admin").length;
    const libs = (users || []).filter((u) => (u?.role || "user") === "librarian").length;
    const normal = all - admins - libs;
    return { all, admins, libs, normal };
  }, [users]);

  const openConfirm = ({ email, newRole, currentRole, name }) => {
    setPendingChange({ email, newRole, currentRole, name });
    setConfirmOpen(true);
  };

  const doUpdateRole = async ({ email, newRole }) => {
    try {
      setActionEmail(email);
      await axiosSecure.patch(`/users/role/${email}`, { role: newRole });

      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role: newRole } : u)));

      showToast.success("Role updated", `${email} is now ${newRole}.`);
    } catch (err) {
      console.log(err);
      showToast.error("Role update failed", err?.response?.data?.message || "Try again.");
    } finally {
      setActionEmail(null);
    }
  };

  const confirmTitle = useMemo(() => {
    if (!pendingChange) return "";
    const from = pendingChange.currentRole || "user";
    const to = pendingChange.newRole;
    return `Change role: ${from} → ${to}`;
  }, [pendingChange]);

  const confirmDesc = useMemo(() => {
    if (!pendingChange) return "";
    const who = pendingChange.name ? `${pendingChange.name} (${pendingChange.email})` : pendingChange.email;
    if (pendingChange.newRole === "user") {
      return `You are about to remove elevated access. ${who} will become a normal USER.`;
    }
    return `You are about to grant ${pendingChange.newRole.toUpperCase()} permissions to ${who}.`;
  }, [pendingChange]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner text-[#8B5E3C]"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-4 sm:p-6 rounded-3xl shadow-lg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B5E3C]">Users</h1>
          <p className="text-sm text-base-content/60 mt-1">SaaS-style role management (Admin / Librarian / User).</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* mobile filter */}
          <button
            className="sm:hidden btn btn-sm btn-outline rounded-2xl"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>

          <button
            onClick={loadUsers}
            className="btn btn-sm rounded-2xl bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: "Total Users", value: stats.all, icon: <Users size={18} /> },
          { label: "Admins", value: stats.admins, icon: <Crown size={18} /> },
          { label: "Librarians", value: stats.libs, icon: <BadgeCheck size={18} /> },
          { label: "Normal Users", value: stats.normal, icon: <User2 size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-base-100 rounded-3xl border border-base-300 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center">
                {s.icon}
              </div>
              <p className="text-2xl font-extrabold">{s.value}</p>
            </div>
            <p className="mt-2 text-xs text-base-content/60 font-semibold">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters (desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
        className="mt-5 hidden sm:block bg-base-100 rounded-3xl border border-base-300 p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* search */}
          <label className="relative">
            <span className="text-xs font-semibold text-base-content/60">Search (name / email)</span>
            <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
              <Search size={16} className="text-[#8B5E3C]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search…"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </label>

          {/* role filter */}
          <label className="relative">
            <span className="text-xs font-semibold text-base-content/60">Role filter</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="mt-1 w-full rounded-2xl border bg-base-100 px-3 py-2 text-sm outline-none"
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
              <option value="user">User</option>
            </select>
          </label>

          {/* clear */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setRoleFilter("all");
              }}
              className="btn btn-sm w-full md:w-auto rounded-2xl border border-base-300 hover:bg-base-200"
            >
              Clear
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-base-content/60">
              <Shield size={14} className="text-[#8B5E3C]" />
              <span>{filtered.length} result(s)</span>
            </div>
          </div>
        </div>

        <div className="mt-3 md:hidden text-xs text-base-content/60">{filtered.length} result(s)</div>
      </motion.div>

      {/* Mobile filters modal */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close overlay"
            />
            <motion.div
              className="fixed z-50 left-1/2 -translate-x-1/2 top-24 w-[92vw] max-w-md bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.22 }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-[#8B5E3C]">Filters</p>
                  <button
                    className="h-10 w-10 rounded-2xl hover:bg-base-200 grid place-items-center"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-base-content/60">Search</label>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl border bg-base-100 px-3 py-2">
                      <Search size={16} className="text-[#8B5E3C]" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Name or email…"
                        className="w-full bg-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-base-content/60">Role</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="mt-1 w-full rounded-2xl border bg-base-100 px-3 py-2 text-sm outline-none"
                    >
                      <option value="all">All</option>
                      <option value="admin">Admin</option>
                      <option value="librarian">Librarian</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn flex-1 rounded-2xl bg-[#8B5E3C] text-white hover:bg-[#A47148] border-0"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Apply
                    </button>
                    <button
                      className="btn flex-1 rounded-2xl btn-outline"
                      onClick={() => {
                        setQuery("");
                        setRoleFilter("all");
                        setMobileFiltersOpen(false);
                      }}
                    >
                      Clear
                    </button>
                  </div>

                  <p className="text-xs text-base-content/60">{filtered.length} result(s)</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="mt-5">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-base-100 rounded-3xl p-6">
            <p className="text-base-content/60">No users found.</p>
          </motion.div>
        ) : (
          <>
            {/* ✅ Mobile cards */}
            <div className="grid gap-3 sm:hidden">
              <AnimatePresence>
                {filtered.map((u, idx) => {
                  const role = u?.role || "user";
                  const busy = actionEmail === u.email;

                  return (
                    <motion.div
                      key={u._id || u.email}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: idx * 0.015 }}
                      className="bg-base-100 border border-base-300 rounded-3xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-extrabold truncate">{u.name || "—"}</p>
                          <p className="text-xs text-base-content/60 truncate">{u.email}</p>
                          <div className="mt-2">
                            <RolePill role={role} />
                          </div>
                        </div>

                        {/* Role selector */}
                        <select
                          value={role}
                          disabled={busy}
                          onChange={(e) =>
                            openConfirm({
                              email: u.email,
                              name: u.name,
                              currentRole: role,
                              newRole: e.target.value,
                            })
                          }
                          className="select select-sm rounded-2xl border"
                        >
                          <option value="user">User</option>
                          <option value="librarian">Librarian</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          disabled={busy}
                          onClick={() =>
                            openConfirm({
                              email: u.email,
                              name: u.name,
                              currentRole: role,
                              newRole: "user",
                            })
                          }
                          className="btn btn-sm rounded-2xl btn-outline flex-1"
                        >
                          Make User
                        </button>

                        <button
                          disabled={busy}
                          onClick={() =>
                            openConfirm({
                              email: u.email,
                              name: u.name,
                              currentRole: role,
                              newRole: "librarian",
                            })
                          }
                          className="btn btn-sm rounded-2xl bg-blue-600 text-white hover:bg-blue-700 border-0 flex-1"
                        >
                          Make Librarian
                        </button>

                        <button
                          disabled={busy}
                          onClick={() =>
                            openConfirm({
                              email: u.email,
                              name: u.name,
                              currentRole: role,
                              newRole: "admin",
                            })
                          }
                          className="btn btn-sm rounded-2xl bg-purple-600 text-white hover:bg-purple-700 border-0 flex-1"
                        >
                          Make Admin
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ✅ Desktop table (SaaS style) */}
            <div className="hidden sm:block overflow-x-auto bg-base-100 rounded-3xl border border-base-300">
              <table className="table w-full">
                <thead>
                  <tr className="bg-[#8B5E3C] text-white">
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-right">Change Role</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((u, idx) => {
                    const role = u?.role || "user";
                    const busy = actionEmail === u.email;

                    return (
                      <motion.tr
                        key={u._id || u.email}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.015 }}
                        className="hover"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#8B5E3C]/10 text-[#8B5E3C] grid place-items-center font-extrabold">
                              {(u?.name || u?.email || "U").slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold">{u.name || "—"}</p>
                              <p className="text-xs text-base-content/60">Account</p>
                            </div>
                          </div>
                        </td>

                        <td className="text-sm">{u.email}</td>

                        <td>
                          <RolePill role={role} />
                        </td>

                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {/* quick buttons */}
                            <button
                              disabled={busy}
                              onClick={() =>
                                openConfirm({
                                  email: u.email,
                                  name: u.name,
                                  currentRole: role,
                                  newRole: "user",
                                })
                              }
                              className="btn btn-sm rounded-2xl btn-outline"
                            >
                              Make User
                            </button>

                            <button
                              disabled={busy}
                              onClick={() =>
                                openConfirm({
                                  email: u.email,
                                  name: u.name,
                                  currentRole: role,
                                  newRole: "librarian",
                                })
                              }
                              className="btn btn-sm rounded-2xl bg-blue-600 text-white hover:bg-blue-700 border-0"
                            >
                              Make Librarian
                            </button>

                            <button
                              disabled={busy}
                              onClick={() =>
                                openConfirm({
                                  email: u.email,
                                  name: u.name,
                                  currentRole: role,
                                  newRole: "admin",
                                })
                              }
                              className="btn btn-sm rounded-2xl bg-purple-600 text-white hover:bg-purple-700 border-0"
                            >
                              Make Admin
                            </button>

                            {/* dropdown (optional, also opens modal) */}
                            <select
                              value={role}
                              disabled={busy}
                              onChange={(e) =>
                                openConfirm({
                                  email: u.email,
                                  name: u.name,
                                  currentRole: role,
                                  newRole: e.target.value,
                                })
                              }
                              className="select select-sm rounded-2xl border"
                            >
                              <option value="user">User</option>
                              <option value="librarian">Librarian</option>
                              <option value="admin">Admin</option>
                            </select>

                            {busy ? (
                              <span className="ml-1 text-xs text-base-content/60">Updating...</span>
                            ) : null}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirm modal (NO window alert) */}
      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        confirmText={pendingChange?.newRole === "user" ? "Yes, make User" : "Yes, change role"}
        danger={pendingChange?.newRole === "user"} // demotion is "danger"
        onClose={() => {
          setConfirmOpen(false);
          setPendingChange(null);
        }}
        onConfirm={async () => {
          const payload = pendingChange;
          setConfirmOpen(false);
          setPendingChange(null);

          if (!payload || !payload.email || !payload.newRole) return;
          if (payload.newRole === payload.currentRole) return;

          await doUpdateRole({ email: payload.email, newRole: payload.newRole });
        }}
      />

      {/* toast animation styles */}
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