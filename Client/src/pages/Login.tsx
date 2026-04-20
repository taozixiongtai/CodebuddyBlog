import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wjt' && password === 'taozixiongtai') {
      navigate('/admin');
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div className="login-page">
      <div className="login-modal">
        <h1 className="login-title">登录</h1>
        <form onSubmit={handleLogin}>
          <div className="login-field">
            <input
              type="text"
              placeholder="账号"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-field">
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn">登录</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
