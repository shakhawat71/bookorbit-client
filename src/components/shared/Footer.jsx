import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#8B5E3C] text-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-primaryBrown">BookOrbit</h3>
          <p className="mt-3 text-sm leading-relaxed text-white-">
            Library-to-home book delivery made simple for students, researchers, and readers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-primaryBrown mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-primaryBrown" to="/">Home</Link></li>
            <li><Link className="hover:text-primaryBrown" to="/books">Books</Link></li>
            <li><Link className="hover:text-primaryBrown" to="/dashboard/my-orders">Dashboard</Link></li>
            <li><Link className="hover:text-primaryBrown" to="/login">Login</Link></li>
            <li><Link className="hover:text-primaryBrown" to="/register">Register</Link></li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h4 className="font-semibold text-primaryBrown mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-white">
            <li>Email: <span>support@bookorbit.com</span></li>
            <li>Phone: <span>+880 1XXX-XXXXXX</span></li>
            <li>Address: <span>Dhaka, Bangladesh</span></li>
          </ul>

          <div className="mt-5 flex items-center gap-3">
            {/* Facebook */}
            <a
              className="btn btn-sm border border-primaryBrown text-primaryBrown hover:bg-primaryBrown hover:text-white"
              href="#"
              aria-label="Facebook"
            >
              f
            </a>

            {/* Instagram */}
            <a
              className="btn btn-sm border border-primaryBrown text-primaryBrown hover:bg-primaryBrown hover:text-white"
              href="#"
              aria-label="Instagram"
            >
              ◎
            </a>

            {/* X (new logo) */}
            <a
              className="btn btn-sm border border-primaryBrown text-primaryBrown hover:bg-primaryBrown hover:text-white"
              href="#"
              aria-label="X"
              title="X"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.6l-5.2-6.6L5.7 22H2l7.4-8.6L1.2 2h6.7l4.7 6 5.3-6Zm-1.2 18h1.7L6.9 3.9H5.1L17.7 20Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-white flex flex-col items-center justify-between">
          <p>© {new Date().getFullYear()} BookOrbit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
