import React, { useState } from 'react';
import { useEffect, useState as useStateReact } from 'react';
import './App.css';

function UserInfo({ user, onUpdate, onBack, onLogout, hasMessage, onChangePwd }) {
  // 界面切换
  const [tab, setTab] = useStateReact('profile'); // profile, message, myposts, myfav
  // 获取所有帖子（从window.posts或props传递）
  const [myPosts, setMyPosts] = useStateReact([]);
  const [myFavs, setMyFavs] = useStateReact([]);
  useEffect(() => {
    if (window.posts) {
      setMyPosts(window.posts.filter(p => p.author?.username === user.username));
      setMyFavs(window.posts.filter(p => p.favedBy && p.favedBy.includes(user.username)));
    }
  }, [user]);

  // 消息列表
  const [messages, setMessages] = useStateReact([]);
  useEffect(() => {
    if (!window.posts) return;
    let msgList = [];
    window.posts.forEach(post => {
      // 自己发的帖子被评论
      if (post.author?.username === user.username) {
        post.comments.forEach(c => {
          if (c.author?.username !== user.username) {
            msgList.push({
              type: '评论',
              postTitle: post.title,
              from: c.author?.username || '匿名',
              text: c.text,
              time: c.createdAt,
            });
          }
          // 回复自己的评论
          if (c.replies) {
            c.replies.forEach(r => {
              if (r.replyTo === user.username && r.author?.username !== user.username) {
                msgList.push({
                  type: '回复',
                  postTitle: post.title,
                  from: r.author?.username || '匿名',
                  text: r.text,
                  time: r.createdAt,
                });
              }
            });
          }
        });
      }
    });
    setMessages(msgList);
  }, [user]);
  // 所有变量定义放在开头
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = React.useRef();

  // ...existing code...
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ username, avatar });
  };

  return (
    <div className="acg-user-info" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{width:'600px',background:'#fff',padding:'2rem',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <div style={{display:'flex',alignItems:'flex-start',marginBottom:'2rem'}}>
          {/* 头像 */}
          <div style={{marginRight:'2rem',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              ref={fileInputRef}
              style={{display:'none'}}
            />
            {avatar ? (
              <img
                src={typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)}
                alt="头像"
                style={{width:'90px',height:'90px',borderRadius:'50%',cursor:'pointer'}}
                onClick={handleAvatarClick}
                title="点击更换头像"
              />
            ) : (
              <div style={{width:'90px',height:'90px',borderRadius:'50%',background:'#eee',display:'inline-block',cursor:'pointer'}} onClick={handleAvatarClick} title="点击更换头像"></div>
            )}
          </div>
          {/* 用户名和按钮区 */}
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:'1.2rem'}}>
              <span style={{fontSize:'1.5em',fontWeight:'bold',marginRight:'1.5rem'}}>{username}</span>
              <button onClick={onBack} style={{marginRight:'0.5rem'}}>返回</button>
              <button onClick={onLogout} style={{background:'#e74c3c',color:'#fff',border:'none',borderRadius:'4px',padding:'0.5rem 1rem',cursor:'pointer'}}>退出登录</button>
            </div>
            <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem'}}>
              <button onClick={()=>setTab('profile')} style={{padding:'0.5rem 1.2rem',borderRadius:'4px',border:tab==='profile'?'2px solid #4a90e2':'1px solid #ccc',background:tab==='profile'?'#f7f7fa':'#fff',fontWeight:'bold'}}>个人资料</button>
              <button onClick={()=>setTab('message')} style={{padding:'0.5rem 1.2rem',borderRadius:'4px',border:tab==='message'?'2px solid #4a90e2':'1px solid #ccc',background:tab==='message'?'#f7f7fa':'#fff',fontWeight:'bold',position:'relative'}}>消息中心{hasMessage && <span style={{position:'absolute',top:'6px',right:'-12px',width:'10px',height:'10px',background:'red',borderRadius:'50%'}}></span>}</button>
              <button onClick={()=>setTab('myposts')} style={{padding:'0.5rem 1.2rem',borderRadius:'4px',border:tab==='myposts'?'2px solid #4a90e2':'1px solid #ccc',background:tab==='myposts'?'#f7f7fa':'#fff',fontWeight:'bold'}}>我的帖子</button>
              <button onClick={()=>setTab('myfav')} style={{padding:'0.5rem 1.2rem',borderRadius:'4px',border:tab==='myfav'?'2px solid #4a90e2':'1px solid #ccc',background:tab==='myfav'?'#f7f7fa':'#fff',fontWeight:'bold'}}>我的收藏</button>
            </div>
            {/* tab内容区 */}
            <div style={{minHeight:'220px'}}>
              {tab==='profile' && (
                <form onSubmit={handleSubmit}>
                  <div style={{marginBottom:'1rem'}}>
                    <label style={{display:'block',marginBottom:'0.3rem',color:'#888'}}>用户名</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}}
                    />
                  </div>
                  <div style={{marginBottom:'1rem'}}>
                    <label style={{display:'block',marginBottom:'0.3rem',color:'#888'}}>邮箱</label>
                    <input
                      type="text"
                      value={user.email || ''}
                      disabled
                      style={{width:'100%',padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc',background:'#f7f7fa'}}
                    />
                  </div>
                  <button type="submit" style={{width:'100%',padding:'0.5rem',background:'#4a90e2',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',marginBottom:'1.5rem'}}>保存</button>
                  <button type="button" onClick={onChangePwd} style={{width:'100%',padding:'0.5rem',background:'#f7b731',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>修改密码</button>
                </form>
              )}
              {tab==='message' && (
                <div style={{marginTop:'0.5rem',maxHeight:'220px',overflowY:'auto',background:'#f7f7fa',borderRadius:'4px',padding:'0.5rem'}}>
                  {messages.length === 0 ? <div style={{color:'#888'}}>暂无新消息</div> : (
                    <ul style={{paddingLeft:0}}>
                      {messages.map((m, idx) => (
                        <li key={idx} style={{marginBottom:'0.7rem',listStyle:'none',borderBottom:'1px solid #eee',paddingBottom:'0.3rem'}}>
                          <span style={{color:'#4a90e2',fontWeight:'bold'}}>{m.type}</span>
                          <span style={{marginLeft:'0.5em',color:'#888'}}>来自：{m.from}</span>
                          <span style={{marginLeft:'0.5em',color:'#888'}}>帖子：{m.postTitle}</span>
                          <span style={{marginLeft:'0.5em',color:'#555'}}>{m.text}</span>
                          <span style={{marginLeft:'0.5em',color:'#aaa',fontSize:'0.92em'}}>{m.time ? new Date(m.time).toLocaleString() : ''}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {tab==='myposts' && (
                <div style={{marginTop:'0.5rem'}}>
                  <h3 style={{marginBottom:'1rem'}}>我发布的帖子</h3>
                  {myPosts.length === 0 ? <div style={{color:'#888'}}>暂无帖子</div> : (
                    <ul style={{paddingLeft:0}}>
                      {myPosts.map((p, idx) => (
                        <li key={idx} style={{marginBottom:'1rem',listStyle:'none',borderBottom:'1px solid #eee',paddingBottom:'0.5rem'}}>
                          <div style={{fontWeight:'bold'}}>{p.title}</div>
                          <div style={{color:'#888',fontSize:'0.95em'}}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
                          <div style={{color:'#555'}}>{p.content}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {tab==='myfav' && (
                <div style={{marginTop:'0.5rem'}}>
                  <h3 style={{marginBottom:'1rem'}}>我的收藏</h3>
                  {myFavs.length === 0 ? <div style={{color:'#888'}}>暂无收藏</div> : (
                    <ul style={{paddingLeft:0}}>
                      {myFavs.map((p, idx) => (
                        <li key={idx} style={{marginBottom:'1rem',listStyle:'none',borderBottom:'1px solid #eee',paddingBottom:'0.5rem'}}>
                          <div style={{fontWeight:'bold'}}>{p.title}</div>
                          <div style={{color:'#888',fontSize:'0.95em'}}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
                          <div style={{color:'#555'}}>{p.content}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
