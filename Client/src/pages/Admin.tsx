import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articlesApi, categoriesApi, Article, Category } from '../services/api';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'article' | 'tag'>('article');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Category form state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  // Load data
  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await articlesApi.getList();
      setArticles(data);
    } catch (e) {
      console.error('加载文章失败', e);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getList();
      setCategories(data);
    } catch (e) {
      console.error('加载分类失败', e);
    }
  };

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  // Article delete
  const handleArticleDelete = async (id: number) => {
    if (confirm('确定删除这篇文章吗？')) {
      await articlesApi.delete(id);
      loadArticles();
    }
  };

  // Category CRUD
  const handleCategorySubmit = async () => {
    if (!categoryForm.name) {
      alert('请输入分类名称');
      return;
    }
    if (editingCategory) {
      await categoriesApi.update(editingCategory.id, categoryForm);
    } else {
      await categoriesApi.create(categoryForm);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryForm({ name: '' });
    loadCategories();
  };

  const handleCategoryDelete = async (id: number) => {
    if (confirm('确定删除这个分类吗？')) {
      await categoriesApi.delete(id);
      loadCategories();
    }
  };

  const openCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name || '' });
    setShowCategoryModal(true);
  };

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <Link to="/" className="admin-nav-logo">Blog</Link>
        <Link to="/" className="admin-nav-back">返回首页</Link>
      </nav>

      <div className="admin-container">
        <h1 className="admin-title">后台管理</h1>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'article' ? 'active' : ''}`}
            onClick={() => setActiveTab('article')}
          >
            文章管理
          </button>
          <button
            className={`admin-tab ${activeTab === 'tag' ? 'active' : ''}`}
            onClick={() => setActiveTab('tag')}
          >
            标签管理
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'article' ? (
            <div>
              <div className="admin-toolbar">
                <button
                  className="admin-btn-primary"
                  onClick={() => navigate('/admin/article/new')}
                >
                  新增文章
                </button>
              </div>
              <div className="admin-article-list">
                <div className="admin-article-header">
                  <span>标题</span>
                  <span>操作</span>
                </div>
                {loading ? (
                  <div className="admin-loading">加载中...</div>
                ) : articles.length === 0 ? (
                  <div className="admin-empty">暂无文章</div>
                ) : (
                  articles.map(article => (
                    <div key={article.id} className="admin-article-item">
                      <span>{article.title}</span>
                      <span>
                        <button className="admin-btn-edit" onClick={() => navigate(`/admin/article/${article.id}`)}>编辑</button>
                        <button className="admin-btn-delete" onClick={() => handleArticleDelete(article.id)}>删除</button>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="admin-toolbar">
                <button
                  className="admin-btn-primary"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: '' });
                    setShowCategoryModal(true);
                  }}
                >
                  新增分类
                </button>
              </div>
              <div className="admin-tag-list">
                {categories.length === 0 ? (
                  <div className="admin-empty">暂无分类</div>
                ) : (
                  categories.map(category => (
                    <div key={category.id} className="admin-tag-item">
                      <span className="admin-tag-name">{category.name}</span>
                      <span>
                        <button className="admin-btn-edit" onClick={() => openCategoryEdit(category)}>编辑</button>
                        <button className="admin-btn-delete" onClick={() => handleCategoryDelete(category.id)}>删除</button>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="admin-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingCategory ? '编辑分类' : '新增分类'}</h2>
            <div className="admin-form">
              <div className="admin-form-group">
                <label>名称</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn-cancel" onClick={() => setShowCategoryModal(false)}>取消</button>
              <button className="admin-btn-confirm" onClick={handleCategorySubmit}>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
