import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
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
  return (
    <AntdApp>
      <RouterProvider router={router} />
    </AntdApp>
  );
}

export default App;
