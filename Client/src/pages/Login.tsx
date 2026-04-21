import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import { authApi } from '@/services/api';
import './Login.css';

function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!password) {
      message.warning('请输入密码');
      return;
    }
    
    setLoading(true);
    try {
      const res = await authApi.login(password);
      if (res && res.token) {
        message.success('登录成功');
        localStorage.setItem('admin_token', res.token);
        navigate('/admin');
      }
    } catch (e: any) {
      message.error('密码错误或登录失败');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">后台登录</h2>
        <Input.Password
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          size="large"
          className="login-input"
        />
        <Button
          type="primary"
          size="large"
          onClick={handleLogin}
          loading={loading}
          className="login-btn"
          block
        >
          登录
        </Button>
        <div className="login-back">
          <Button type="link" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
