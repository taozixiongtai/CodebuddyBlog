import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import Layout from './components/Layout';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Admin from './pages/Admin';
import ArticleEditor from './pages/ArticleEditor';
import Login from './pages/Login';

// 保护路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('admin_token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <BlogList />,
      },
      {
        path: 'blog/:id',
        element: <BlogDetail />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/article/new',
    element: (
      <ProtectedRoute>
        <ArticleEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/article/:id',
    element: (
      <ProtectedRoute>
        <ArticleEditor />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // 给 window 挂载一个全局的切换方法，方便在非 React 上下文或子组件简单调用
  useEffect(() => {
    (window as any).toggleTheme = () => {
      setIsDarkMode(prev => !prev);
    };
    (window as any).isDarkMode = isDarkMode;
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
