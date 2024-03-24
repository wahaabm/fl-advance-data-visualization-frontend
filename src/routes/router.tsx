import { createBrowserRouter } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Users from "./Users";
import ShowCharts from "./charts/ShowCharts";
import ShowArticles from "./articles/ShowArticles";
import ApprovalWaiting from "./ApprovalWaiting";

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
      {
        path: "articles",
        element: <ShowArticles />,
      },
      {
        path: "waiting",
        element: <ApprovalWaiting />,
      },
    ],
  },
]);

export default router;
