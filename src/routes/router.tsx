import { createBrowserRouter } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import UserDashboard from "./Dashboard";
import PrivateRoutes from "./PrivateRoutes";
import Dashboard from "./Dashboard";
import Users from "./Users";
import HomePage from "./Homepage";
import ShowCharts from "./charts/ShowCharts";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/register",
    element: <Signup />,
  },

  {
    path: "/",
    element: <PrivateRoutes />,
    //errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "charts",
            element: <ShowCharts />,
          },
        ],
      },
    ],
  },
]);

export default router;
