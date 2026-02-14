import { NavLink, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/bookorbitlogo.jpeg";

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-md font-medium transition ${
    isActive
      ? "bg-[#8B5E3C] text-white"
      : "text-[#8B5E3C] hover:bg-[#A47148] hover:text-white"
  }`;

export default function Navbar() {
  // AuthContext
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
  };

  // Theme toggle using daisyUI theme
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const navItems = (
    <>
      <li>
        <NavLink className={navLinkClass} to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className={navLinkClass} to="/books">
          Books
        </NavLink>
      </li>
      <li>
        <NavLink className={navLinkClass} to="/dashboard/my-orders">
          Dashboard
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar shadow-sm sticky top-0 z-50">
      {/* Left */}
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            {navItems}
            {!user && (
              <>
                <li>
                  <NavLink className={navLinkClass} to="/login">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink className={navLinkClass} to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="btn btn-ghost p-1.5">
          <img
            src={logo}
            alt="BookOrbit Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Center (desktop menu) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>

      {/* Right */}
      <div className="navbar-end gap-2">
        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-circle"
          aria-label="Toggle theme"
          onClick={() =>
            setTheme((t) => (t === "light" ? "dark" : "light"))
          }
          title="Toggle theme"
        >
          {theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314L7.05 7.05m9.9 9.9 1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
              />
            </svg>
          )}
        </button>

        {/* Auth area */}
        {!user ? (
          <div className="hidden lg:flex gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-[#8B5E3C] text-white"
                    : "bg-base-100 text-[#8B5E3C] border border-[#8B5E3C] hover:bg-[#A47148] hover:text-white"
                }`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-[#8B5E3C] text-white"
                    : "bg-base-100 text-[#8B5E3C] border border-[#8B5E3C] hover:bg-[#A47148] hover:text-white"
                }`
              }
            >
              Register
            </NavLink>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={
                    user?.photoURL ||
                    "https://i.ibb.co/2kRZpF0/user.png"
                  }
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <span className="font-semibold">
                  {user?.displayName || "User"}
                </span>
              </li>
              <li>
                <Link to="/dashboard/my-profile">
                  My Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
