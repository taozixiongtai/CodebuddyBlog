import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articlesApi, categoriesApi, Article } from '@/services/api';
import { formatDate } from '@/utils/format';
import './BlogList.css';

function BlogList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await articlesApi.getList(1, 100, selectedCategory || undefined);
      const data = res.items || [];
      setArticles(data);
    } catch (e) {
      console.error('加载文章失败', e);
    }
    setLoading(false);
  }, [selectedCategory]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getList();
      setCategories(data);
    } catch (e) {
      console.error('加载分类失败', e);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <div className="blog-list">
      <nav className="blog-nav">
        <Link to="/" className="blog-nav-logo">Blog</Link>
        <div className="blog-nav-actions">
          <button className="blog-login-btn" onClick={() => navigate('/admin')}>
            后台
          </button>
        </div>
      </nav>

      <header className="blog-hero">
        <h1 className="blog-hero-title">思考与记录</h1>
        <p className="blog-hero-subtitle">关于技术、设计与生活的随笔</p>
      </header>

      <div className="blog-content">
        <main className="blog-main">
          <div className="blog-items">
            {loading ? (
              <div className="blog-loading">加载中...</div>
            ) : articles.length === 0 ? (
              <div className="blog-empty">暂无文章</div>
            ) : (
              articles.map(blog => (
                <Link to={`/blog/${blog.id}`} key={blog.id} className="blog-card">
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <div className="blog-card-footer">
                    <span className="blog-card-date">{formatDate(blog.createdAt)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>

        <aside className="blog-sidebar">
          <h3 className="blog-sidebar-title">标签筛选</h3>
          <div className="blog-sidebar-tags">
            <button
              className={`blog-sidebar-tag ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              全部
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`blog-sidebar-tag ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <footer className="blog-footer">
        <p>© 2026 桃子兄台</p>
      </footer>
    </div>
  );
}

export default BlogList;
