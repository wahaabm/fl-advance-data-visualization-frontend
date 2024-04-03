import { createBrowserRouter } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import Layout from "./Layout";
import ShowUsers from "./Users";
import ShowCharts from "./charts/ShowCharts";
import ShowArticles from "./articles/ShowArticles";
import ApprovalWaiting from "./ApprovalWaiting";
import CreateArticle from "./articles/createArticle";
import ShowEditors from "./editors/Editors";
import ReadArticle from "./articles/ReadArticle";
import EditArticle from "./articles/editArticle";

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
    element: <Layout />,
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
        path: "create-article",
        element: <CreateArticle />,
      },
      {
        path: "article/:id",
        element: <ReadArticle />,
      },
      {
        path: "edit-article/:id",
        element: <EditArticle />,
      },
    ],
  },
]);

export default router;
