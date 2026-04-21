import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SettingOutlined, SearchOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Modal, Input, Button } from 'antd';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('key') || '');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  // 监听外部（App.tsx）对主题的修改
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark((window as any).isDarkMode);
    };
    // 简单轮询或通过事件监听，这里由于是在同一个应用内，我们可以直接调用 window.toggleTheme
    // 并且在自身状态更新后同步
  }, []);

  const toggleTheme = () => {
    if ((window as any).toggleTheme) {
      (window as any).toggleTheme();
      setIsDark(!(window as any).isDarkMode);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      setSearchParams({ key: searchValue.trim() });
    } else {
      setSearchParams({});
    }
    setIsSearchModalOpen(false);
    
    // 如果不在首页，跳转回首页并带上搜索参数
    if (window.location.pathname !== '/') {
      navigate(`/?key=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className="global-header-wrapper">
      <nav className="global-header-nav">
        <Link to="/" className="global-header-logo">Blog</Link>
        <div className="global-header-actions">
          <Button 
            type="text" 
            icon={<SearchOutlined style={{ fontSize: '18px' }} />} 
            onClick={() => setIsSearchModalOpen(true)}
            className="global-header-icon-btn"
            title="搜索"
          />
          <Button 
            type="text" 
            icon={isDark ? <SunOutlined style={{ fontSize: '18px' }} /> : <MoonOutlined style={{ fontSize: '18px' }} />} 
            onClick={toggleTheme}
            className="global-header-icon-btn"
            title={isDark ? "切换为日间模式" : "切换为夜间模式"}
          />
          <Button 
            type="text" 
            icon={<SettingOutlined style={{ fontSize: '18px' }} />} 
            onClick={() => navigate('/admin')}
            className="global-header-icon-btn"
            title="后台管理"
          />
        </div>
      </nav>

      <Modal
        title="搜索文章"
        open={isSearchModalOpen}
        onCancel={() => setIsSearchModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <Input
            placeholder="请输入关键字..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            size="large"
            autoFocus
          />
          <Button type="primary" size="large" onClick={handleSearch}>
            搜索
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Header;
