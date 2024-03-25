import { createBrowserRouter } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import ShowUsers from "./Users";
import ShowCharts from "./charts/ShowCharts";
import ShowArticles from "./articles/ShowArticles";
import ApprovalWaiting from "./ApprovalWaiting";
import CreateArticle from "./articles/createArticle";
import ShowEditors from "./editors/Editors";

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
        element: <ShowUsers />,
      },
      {
        path: "editors",
        element: <ShowEditors />,
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
      {
        path: "create",
        element: <CreateArticle />,
      },
    ],
  },
]);

export default router;
