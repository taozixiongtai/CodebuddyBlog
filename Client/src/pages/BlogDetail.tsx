import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesApi, Article } from '../services/api';
import './BlogDetail.css';

function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const loadArticle = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await articlesApi.getById(Number(id));
      setArticle(data);
    } catch (e) {
      console.error('加载文章失败', e);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="blog-detail">
        <div className="blog-detail-loading">加载中...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="blog-detail">
        <div className="blog-detail-not-found">
          <h2>文章未找到</h2>
          <Link to="/" className="blog-detail-back">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <Link to="/" className="blog-detail-back">← 返回列表</Link>
      <article className="blog-detail-article">
        <header className="blog-detail-header">
          <div className="blog-detail-meta">
            <time>{formatDate(article.createdAt)}</time>
          </div>
          <h1 className="blog-detail-title">{article.title}</h1>
        </header>
        <div
          className="blog-detail-content"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />
      </article>
    </div>
  );
}

export default BlogDetail;
