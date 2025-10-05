import React, { useState } from 'react';
import './App.css';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空');
      return;
    }
    if (!isLogin) {
      if (!email.trim()) {
        setError('邮箱不能为空');
        return;
      }
      if (password !== confirmPwd) {
        setError('两次输入的密码不一致');
        return;
      }
    }
    if (isLogin) {
      onLogin({ username });
    } else {
      // 注册完成后跳转到登录页面
      setIsLogin(true);
      setUsername('');
      setPassword('');
      setConfirmPwd('');
      setEmail('');
      setError('注册成功，请登录');
    }
  };


  return (
  <div className="acg-auth" style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',overflow:'hidden',background:'#4a90e2'}}>
      {/* 顶部大字 */}
      <div style={{
        position:'absolute',
        top:'7%',
        left:'50%',
        transform:'translateX(-50%)',
        fontSize:'5rem',
  color:'#fff',
  textShadow:'0 2px 8px rgba(0,0,0,0.10)',
  opacity:1,
        fontWeight:'bold',
        userSelect:'none',
        pointerEvents:'none',
        zIndex:0,
        letterSpacing:'0.2em',
        whiteSpace:'nowrap',
      }}>iACG</div>
      <div style={{width:'320px',background:'#fff',padding:'2rem',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',zIndex:1}}>
        <h2 style={{textAlign:'center',marginBottom:'2rem'}}>{isLogin ? '登录' : '注册'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}}
            />
          </div>
          {!isLogin && (
            <div style={{marginBottom:'1rem'}}>
              <input
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}}
              />
            </div>
          )}
          <div style={{marginBottom:'1rem'}}>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}}
            />
          </div>
          {!isLogin && (
            <div style={{marginBottom:'1rem'}}>
              <input
                type="password"
                placeholder="确认密码"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
                style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}}
              />
            </div>
          )}
          {error && <div style={{color:'red',marginBottom:'1rem'}}>{error}</div>}
          <div style={{marginBottom:'1rem'}}>
            <button type="submit" style={{width:'100%',padding:'0.5rem',background:'#4a90e2',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>{isLogin ? '登录' : '注册'}</button>
          </div>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} style={{width:'100%',padding:'0.5rem',background:'#e3e3e3',color:'#333',border:'none',borderRadius:'4px',cursor:'pointer'}}>
          {isLogin ? '没有账号？注册' : '已有账号？登录'}
        </button>
      </div>
    </div>
  );
}

export default Auth;
