import React, { useEffect, useState } from 'react';
import './App.css';

function MessageCenter({ user, posts, onBack }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!user || !posts) return;
    let msgList = [];
    posts.forEach(post => {
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
  }, [user, posts]);

  return (
    <div className="acg-message-center" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{width:'400px',background:'#fff',padding:'2rem',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
          <button onClick={onBack}>返回</button>
          <span style={{fontWeight:'bold',fontSize:'1.1em'}}>消息中心</span>
        </div>
        <div style={{marginTop:'0.5rem',maxHeight:'400px',overflowY:'auto',background:'#f7f7fa',borderRadius:'4px',padding:'0.5rem'}}>
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
      </div>
    </div>
  );
}

export default MessageCenter;
