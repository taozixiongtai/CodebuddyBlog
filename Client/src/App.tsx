import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ArticleEditor from './pages/ArticleEditor';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BlogList />,
  },
  {
    path: '/blog/:id',
    element: <BlogDetail />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/admin/article/new',
    element: <ArticleEditor />,
  },
  {
    path: '/admin/article/:id',
    element: <ArticleEditor />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
