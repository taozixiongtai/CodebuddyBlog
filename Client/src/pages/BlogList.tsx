import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { articlesApi, categoriesApi, Article } from '@/services/api';
import { formatDate } from '@/utils/format';
import './BlogList.css';

function BlogList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('key') || '';
  
  const handleClearSearch = () => {
    setSearchParams({});
  };
  
  // 优化：合并分页与加载状态，减少 re-render 和状态不一致
  const [status, setStatus] = useState({
    loading: true,
    loadingMore: false,
    page: 1,
    hasMore: true,
    total: 0
  });
  
  const PAGE_SIZE = 10;
  const observerTarget = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 统一的加载函数，处理初始加载和加载更多
  const fetchArticles = useCallback(async (targetPage: number, isInitial: boolean = false) => {
    // 使用 setState 的函数形式来获取最新的 articles.length，避免将其加入依赖项导致无限循环
    setStatus(prev => {
      if (isInitial) {
        return { ...prev, loading: true, page: 1 };
      }
      return { ...prev, loadingMore: true };
    });

    try {
      const res = await articlesApi.getList(targetPage, PAGE_SIZE, selectedCategory || undefined, searchKeyword || undefined);
      const newItems = res.items || [];
      
      setArticles(prev => {
        const updatedArticles = isInitial ? newItems : [...prev, ...newItems];
        
        // 在更新 articles 的同时更新 status，确保状态同步
        setStatus(statusPrev => ({
          ...statusPrev,
          loading: false,
          loadingMore: false,
          page: targetPage,
          total: res.totalCount,
          hasMore: updatedArticles.length < res.totalCount
        }));
        
        return updatedArticles;
      });
    } catch (e) {
      console.error('加载文章失败', e);
      setStatus(prev => ({ ...prev, loading: false, loadingMore: false }));
    }
  }, [selectedCategory, searchKeyword]); // 移除了 articles.length 依赖，防止因为加载新数据导致 fetchArticles 重新生成从而触发 useEffect 闪烁

  // 初始加载或分类切换
  useEffect(() => {
    // 只有在切换分类或搜索词时才需要清空数据，初次挂载交给 fetchArticles(1, true) 处理
    setArticles([]);
    fetchArticles(1, true);
  }, [selectedCategory, searchKeyword, fetchArticles]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getList();
      setCategories(data);
    } catch (e) {
      console.error('加载分类失败', e);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 优化：使用更稳定的滚动监听逻辑
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    // 当正在加载或没有更多时，直接返回不绑定 observer
    if (status.loading || status.loadingMore || !status.hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        // 只有当可见且状态允许时触发
        if (entries[0].isIntersecting) {
          fetchArticles(status.page + 1);
        }
      },
      // 避免 rootMargin 导致一开始就触发，改用较小的阈值
      { threshold: 0.1, rootMargin: '0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [status.hasMore, status.loading, status.loadingMore, status.page, fetchArticles]);

  const { loading, loadingMore, hasMore } = status;

  return (
    <div className="blog-list">
      <header className="blog-hero">
        <h1 className="blog-hero-title">思考与记录</h1>
        <p className="blog-hero-subtitle">关于技术、设计与生活的随笔</p>
      </header>

      <div className="blog-content">
        <main className="blog-main">
          {searchKeyword && (
            <div className="blog-search-tag-container">
              <span className="blog-search-tag">
                搜索：{searchKeyword}
                <button className="blog-search-tag-close" onClick={handleClearSearch} aria-label="清除搜索">
                  <CloseOutlined />
                </button>
              </span>
            </div>
          )}
          <div className="blog-items">
            {loading ? (
              <div className="blog-loading">加载中...</div>
            ) : articles.length === 0 ? (
              <div className="blog-empty">暂无文章</div>
            ) : (
              <>
                {articles.map(blog => (
                  <Link to={`/blog/${blog.id}`} key={blog.id} className="blog-card">
                    <h2 className="blog-card-title">{blog.title}</h2>
                    <div className="blog-card-footer">
                      <span className="blog-card-date">{formatDate(blog.createdAt)}</span>
                    </div>
                  </Link>
                ))}
                
                {/* 滚动加载触发点 */}
                <div ref={observerTarget} className="blog-load-more">
                  {loadingMore ? (
                    <div className="blog-loading-inline">加载更多中...</div>
                  ) : !hasMore && articles.length > 0 ? (
                    <div className="blog-no-more">没有更多文章了</div>
                  ) : null}
                </div>
              </>
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
