import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AllBooks from "../pages/AllBooks";
import BookDetails from "../pages/BookDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyOrders from "../pages/dashboard/MyOrders";
import PrivateRoute from "./PrivateRoute";
import MyProfile from "../pages/dashboard/MyProfile";
import Invoices from "../pages/dashboard/Invoices";
import Wishlist from "../pages/dashboard/Wishlist";
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
          )
,
        children: [
          {
            path: "my-orders",
            element: <MyOrders />,
          },
          {
            path: "my-profile",
            element: <MyProfile></MyProfile>
          },
          {
            path: "invoices",
            element: <Invoices></Invoices>
          },
          {
            path: "wishlist",
            element:<Wishlist></Wishlist>
          },
          {
            path: "edit-book/:id",
            element: <EditBook />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "manage-books",
            element: <ManageBooks />,
          },
        ],
      },
    ],
  },
]);

export default router;