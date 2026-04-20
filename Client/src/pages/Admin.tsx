import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Input, message, Table, Button, Tabs, Space, Tag } from 'antd';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { articlesApi, categoriesApi, Article, Category } from '@/services/api';
import { formatDate } from '@/utils/format';
import './Admin.css';

const { confirm } = Modal;

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'article' | 'tag'>('article');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Article List State (Pagination & Search)
  const [articleSearchText, setArticleSearchText] = useState('');
  const [articleCurrentPage, setArticleCurrentPage] = useState(1);
  const [articlePageSize, setArticlePageSize] = useState(10);
  const [articleTotal, setArticleTotal] = useState(0);

  // Category form state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  // Load data
  const loadArticles = async (page = articleCurrentPage, pageSize = articlePageSize, key = articleSearchText) => {
    setLoading(true);
    try {
      const res = await articlesApi.getList(page, pageSize, undefined, key);
      setArticles(res.items || []);
      setArticleTotal(res.totalCount || 0);
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
  const handleArticleDelete = (id: number) => {
    confirm({
      title: '确定删除这篇文章吗？',
      icon: <ExclamationCircleFilled />,
      content: '删除后无法恢复，请谨慎操作。',
      okText: '确定',
      okButtonProps: { danger: true },
      cancelText: '取消',
      async onOk() {
        try {
          await articlesApi.delete(id);
          message.success('文章已删除');
          loadArticles();
        } catch (e) {
          message.error('删除失败');
          console.error(e);
        }
      },
    });
  };

  // Category CRUD
  const handleCategorySubmit = async () => {
    if (!categoryForm.name) {
      message.warning('请输入分类名称');
      return;
    }
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryForm);
        message.success('分类已更新');
      } else {
        await categoriesApi.create(categoryForm);
        message.success('分类已创建');
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '' });
      loadCategories();
    } catch (e) {
      message.error('保存分类失败');
      console.error(e);
    }
  };

  const handleCategoryDelete = (id: number) => {
    confirm({
      title: '确定删除这个分类吗？',
      icon: <ExclamationCircleFilled />,
      content: '如果有文章使用了该分类，可能会受到影响。',
      okText: '确定',
      okButtonProps: { danger: true },
      cancelText: '取消',
      async onOk() {
        try {
          await categoriesApi.delete(id);
          message.success('分类已删除');
          loadCategories();
        } catch (e) {
          message.error('删除失败');
          console.error(e);
        }
      },
    });
  };

  const openCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name || '' });
    setShowCategoryModal(true);
  };

  const articleColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => formatDate(text),
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Article) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/article/${record.id}`)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleArticleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => formatDate(text),
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => openCategoryEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleCategoryDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'article',
      label: '文章管理',
      children: (
        <div>
          <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => navigate('/admin/article/new')}
            >
              新增文章
            </Button>
            <Input.Search
              placeholder="搜索文章标题"
              allowClear
              value={articleSearchText}
              onChange={(e) => setArticleSearchText(e.target.value)}
              onSearch={(value) => {
                setArticleCurrentPage(1);
                loadArticles(1, articlePageSize, value);
              }}
              style={{ width: 250 }}
            />
          </div>
          <Table 
            columns={articleColumns} 
            dataSource={articles} 
            rowKey="id" 
            loading={loading}
            pagination={{ 
              current: articleCurrentPage,
              pageSize: articlePageSize,
              total: articleTotal,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total) => `共 ${total} 篇文章`,
              onChange: (page, pageSize) => {
                setArticleCurrentPage(page);
                setArticlePageSize(pageSize);
                loadArticles(page, pageSize, articleSearchText);
              }
            }}
          />
        </div>
      )
    },
    {
      key: 'tag',
      label: '标签管理',
      children: (
        <div>
          <div className="admin-toolbar">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '' });
                setShowCategoryModal(true);
              }}
              style={{ marginBottom: 16 }}
            >
              新增分类
            </Button>
          </div>
          <Table 
            columns={categoryColumns} 
            dataSource={categories} 
            rowKey="id" 
            pagination={{ pageSize: 10 }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">后台管理</h1>
          <Button 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
            size="large"
          >
            首页
          </Button>
        </div>

        <div className="admin-content">
          <Tabs 
            activeKey={activeTab} 
            onChange={(key) => setActiveTab(key as 'article' | 'tag')}
            items={tabItems}
            size="large"
          />
        </div>
      </div>

      {/* Category Modal */}
      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={showCategoryModal}
        onOk={handleCategorySubmit}
        onCancel={() => setShowCategoryModal(false)}
        okText="确定"
        cancelText="取消"
        centered
      >
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <div style={{ marginBottom: 8, color: '#888' }}>分类名称</div>
          <Input
            placeholder="请输入分类名称"
            size="large"
            value={categoryForm.name}
            onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
            onPressEnter={handleCategorySubmit}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Admin;
