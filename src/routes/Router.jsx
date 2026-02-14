import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import AllBooks from "../pages/AllBooks";
import BookDetails from "../pages/BookDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

import PrivateRoute from "./PrivateRoute";

// Dashboard Pages
import MyOrders from "../pages/dashboard/MyOrders";
import MyProfile from "../pages/dashboard/MyProfile";
import Invoices from "../pages/dashboard/Invoices";
import Wishlist from "../pages/dashboard/Wishlist";
import AddBook from "../pages/dashboard/AddBook";
import MyBooks from "../pages/dashboard/MyBooks";
import EditBook from "../pages/dashboard/EditBook";
import AllUsers from "../pages/dashboard/AllUsers";
import ManageBooks from "../pages/dashboard/ManageBooks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/books", element: <AllBooks /> },
      { path: "/books/:id", element: <BookDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // 👤 USER ROUTES
          { path: "my-orders", element: <MyOrders /> },
          { path: "my-profile", element: <MyProfile /> },
          { path: "invoices", element: <Invoices /> },
          { path: "wishlist", element: <Wishlist /> },

          // 📚 LIBRARIAN ROUTES
          { path: "add-book", element: <AddBook /> },
          { path: "my-books", element: <MyBooks /> },
          { path: "edit-book/:id", element: <EditBook /> },

          // 🛠 ADMIN ROUTES
          { path: "all-users", element: <AllUsers /> },
          { path: "manage-books", element: <ManageBooks /> },
        ],
      },
    ],
  },
]);

export default router;
