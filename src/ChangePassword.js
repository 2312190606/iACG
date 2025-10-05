import React, { useState } from 'react';
import './App.css';

function ChangePassword({ onBack, onSubmit }) {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oldPwd || !newPwd || !confirmPwd) {
      setError('请填写所有字段');
      return;
    }
    if (newPwd !== confirmPwd) {
      setError('新密码与确认密码不一致');
      return;
    }
    setError('');
    onSubmit({ oldPwd, newPwd });
  };

  return (
    <div className="acg-change-pwd" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{width:'320px',background:'#fff',padding:'2rem',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
          <button onClick={onBack}>返回</button>
        </div>
        <h2 style={{textAlign:'center',marginBottom:'2rem'}}>修改密码</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'0.3rem',color:'#888'}}>旧密码</label>
            <input type="password" value={oldPwd} onChange={e=>setOldPwd(e.target.value)} required style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'0.3rem',color:'#888'}}>新密码</label>
            <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} required style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'0.3rem',color:'#888'}}>确认新密码</label>
            <input type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} required style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}} />
          </div>
          {error && <div style={{color:'red',marginBottom:'1rem'}}>{error}</div>}
          <button type="submit" style={{width:'100%',padding:'0.5rem',background:'#4a90e2',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>提交</button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
