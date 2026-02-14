// src/layouts/DashboardLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  Package,
  User,
  FileText,
  Heart,
  Plus,
  BookOpen,
  Truck,
  Users,
  Settings,
  X,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔥 TEMP ROLE (Replace with real backend role later)
  const { role = "user" } = useContext(AuthContext);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setIsOpen(true);
  };

  const linkClass = ({ isActive }) =>
    [
      "group relative flex items-center gap-3 rounded-xl px-4 py-2.5",
      "transition-all duration-200 ease-out",
      isActive
        ? "bg-white/10 text-white shadow-lg"
        : "text-white/80 hover:text-white hover:bg-white/10",
    ].join(" ");

  const ActiveIndicator = ({ isActive }) => (
    <span
      className={`absolute left-1 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full transition-all ${
        isActive ? "bg-white" : "bg-transparent"
      }`}
    />
  );

  const MenuLink = ({ to, icon, label }) => (
    <NavLink to={to} className={linkClass} onClick={closeMobile}>
      {({ isActive }) => (
        <>
          <ActiveIndicator isActive={isActive} />
          <span className="p-2 rounded-lg bg-white/10">
            {icon}
          </span>
          <span
            className={`transition-all duration-300 ${
              isOpen
                ? "opacity-100"
                : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-white/10">
            <LayoutDashboard className="text-white" size={18} />
          </span>

          {isOpen && (
            <div>
              <h2 className="font-bold text-white text-lg">
                Dashboard
              </h2>
              <p className="text-xs text-white/70">
                BookOrbit Panel
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="hidden md:inline-flex text-white"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={closeMobile}
          className="md:hidden text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="h-px bg-white/20 mb-5" />

      {/* ================= MENU ================= */}
      <ul className="space-y-2">

        {/* USER MENU */}
        {(role === "user" ||
          role === "librarian" ||
          role === "admin") && (
          <>
            <li>
              <MenuLink
                to="/dashboard/my-orders"
                icon={<Package size={18} className="text-white" />}
                label="My Orders"
              />
            </li>
            <li>
              <MenuLink
                to="/dashboard/my-profile"
                icon={<User size={18} className="text-white" />}
                label="My Profile"
              />
            </li>
            <li>
              <MenuLink
                to="/dashboard/invoices"
                icon={<FileText size={18} className="text-white" />}
                label="Invoices"
              />
            </li>
            <li>
              <MenuLink
                to="/dashboard/wishlist"
                icon={<Heart size={18} className="text-white" />}
                label="My Wishlist"
              />
            </li>
          </>
        )}

        {/* LIBRARIAN MENU */}
        {(role === "librarian" || role === "admin") && (
          <>
            <li>
              <MenuLink
                to="/dashboard/add-book"
                icon={<Plus size={18} className="text-white" />}
                label="Add Book"
              />
            </li>
            <li>
              <MenuLink
                to="/dashboard/my-books"
                icon={<BookOpen size={18} className="text-white" />}
                label="My Books"
              />
            </li>
            <li>
              <MenuLink
                to="/dashboard/orders"
                icon={<Truck size={18} className="text-white" />}
                label="Orders"
              />
            </li>
          </>
        )}

        {/* ADMIN MENU */}
        {role === "admin" && (
          <>
            <li>
              <MenuLink
                to="/dashboard/all-users"
                icon={<Users size={18} className="text-white" />}
                label="All Users"
              />
            </li>
            <li>
              <MenuLink
                to="/dashboard/manage-books"
                icon={<Settings size={18} className="text-white" />}
                label="Manage Books"
              />
            </li>
          </>
        )}
      </ul>
    </>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex">

        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            onClick={closeMobile}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={[
            "bg-linear-to-b from-[#8B5E3C] via-[#7A4F32] to-[#5B3A24]",
            "shadow-2xl transition-all duration-300",
            isOpen ? "md:w-72" : "md:w-20",
            "md:static md:translate-x-0 md:min-h-screen",
            "fixed top-0 left-0 z-50 h-full w-72 p-6",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="md:hidden mb-4">
            <button
              onClick={() => {
                setIsOpen(true);
                setMobileOpen(true);
              }}
              className="btn btn-sm border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
            >
              <Menu size={16} className="mr-2" />
              Menu
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
