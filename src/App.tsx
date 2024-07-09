import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";

const ProtectedRoutes: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useSelector((state: any) => state.user.user);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Layout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
