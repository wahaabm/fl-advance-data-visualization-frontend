import { createBrowserRouter } from 'react-router-dom'
import ApprovalWaiting from './ApprovalWaiting'
import Layout from './Layout'
import Signin from './Signin'
import Signup from './Signup'
import ShowUsers from './Users'
import ReadArticle from './articles/ReadArticle'
import ShowArticles from './articles/ShowArticles'
import CreateArticle from './articles/createArticle'
import EditArticle from './articles/editArticle'
import ShowCharts from './charts/ShowCharts'
import ShowEditors from './editors/Editors'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Signin />,
  },
  {
    path: '/register',
    element: <Signup />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <ShowCharts />,
      },
      {
        path: 'users',
        element: <ShowUsers />,
      },
      {
        path: 'editors',
        element: <ShowEditors />,
      },
      {
        path: 'charts',
        element: <ShowCharts />,
      },
      {
        path: 'articles',
        element: <ShowArticles />,
      },
      {
        path: 'waiting',
        element: <ApprovalWaiting />,
      },
      {
        path: 'create-article',
        element: <CreateArticle />,
      },
      {
        path: 'article/:id',
        element: <ReadArticle />,
      },
      {
        path: 'edit-article/:id',
        element: <EditArticle />,
      },
    ],
  },
])

export default router
