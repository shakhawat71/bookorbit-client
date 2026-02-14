import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import AllBooks from "../pages/AllBooks";
import BookDetails from "../pages/BookDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/books", element: <AllBooks /> },
      { path: "/books/:id", element: <BookDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default router;