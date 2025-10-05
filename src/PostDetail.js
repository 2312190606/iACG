import React from 'react';
import './App.css';


function PostDetail({ post, onBack, onAddComment, canComment, onLike, onFav, onShare, user }) {
  const [comment, setComment] = React.useState('');
  const [replyTo, setReplyTo] = React.useState(null); // {username, idx, ridx, type}
  const [showAllReply, setShowAllReply] = React.useState({});

  const handleReply = (type, idx, ridx) => {
    let username = '';
    if (type === 'comment') username = post.comments[idx]?.author?.username || '匿名';
    else if (type === 'reply') username = post.comments[idx].replies[ridx]?.author?.username || '匿名';
    setReplyTo({username, idx, ridx, type});
    // 如果当前输入框已包含@username，则不重复添加
    setComment(prev => prev.replace(/^@\w+\s*/, '') ? `@${username} ` : `@${username} `);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (typeof onAddComment === 'function') {
      let text = comment.replace(/^@\w+\s*/, '');
      if (replyTo) {
        if (replyTo.type === 'comment') {
          if (!post.comments[replyTo.idx].replies) post.comments[replyTo.idx].replies = [];
          post.comments[replyTo.idx].replies.push({
            text,
            author: post.author,
            replyTo: replyTo.username,
          });
          setShowAllReply(r => ({...r, [replyTo.idx]: true}));
        } else if (replyTo.type === 'reply') {
          const parent = post.comments[replyTo.idx];
          if (!parent.replies) parent.replies = [];
          parent.replies.push({
            text,
            author: post.author,
            replyTo: replyTo.username,
          });
          setShowAllReply(r => ({...r, [replyTo.idx]: true}));
        }
        setReplyTo(null);
      } else {
        onAddComment(text);
      }
      setComment('');
    }
  };

  const handleShowMoreReply = (idx) => {
    setShowAllReply(r => ({...r, [idx]: true}));
  };

  return (
    <div className="acg-post-detail">
      <button onClick={onBack} style={{marginBottom: '1rem'}}>返回</button>
      <div className="acg-post-title">
        {post.title}
        <span className="acg-post-category">[{post.category}]</span>
      </div>
      <div className="acg-post-content">{post.content}</div>
      {post.image && (
        <div style={{margin: '0.5rem 0'}}>
          <img src={post.image} alt="图片" style={{maxWidth: '100%', maxHeight: '300px'}} />
        </div>
      )}
      {post.video && (
        <div style={{margin: '0.5rem 0'}}>
          <video src={post.video} controls style={{maxWidth: '100%', maxHeight: '300px'}} />
        </div>
      )}
      <div style={{display:'flex',gap:'1.5rem',margin:'1rem 0'}}>
        <button onClick={onLike} style={{background:'none',border:'none',color:post.likedBy && user && post.likedBy.includes(user.username)?'#e74c3c':'#888',fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.3em'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={post.likedBy && user && post.likedBy.includes(user.username) ? '#e74c3c' : 'none'} stroke={post.likedBy && user && post.likedBy.includes(user.username) ? '#e74c3c' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z"/></svg>
          {post.likes || 0}
        </button>
        <button onClick={onFav} style={{background:'none',border:'none',color:post.favedBy && user && post.favedBy.includes(user.username)?'#f7b731':'#888',fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.3em'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={post.favedBy && user && post.favedBy.includes(user.username) ? '#f7b731' : 'none'} stroke={post.favedBy && user && post.favedBy.includes(user.username) ? '#f7b731' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {post.favs || 0}
        </button>
        <button onClick={onShare} style={{background:'none',border:'none',color:post.sharedBy && user && post.sharedBy.includes(user.username)?'#4a90e2':'#888',fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.3em'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={post.sharedBy && user && post.sharedBy.includes(user.username) ? '#4a90e2' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          {post.shares || 0}
        </button>
      </div>
      <div className="acg-comment-list">
        <h3>评论</h3>
        {post.comments.length === 0 ? <p>暂无评论</p> : post.comments.map((c, i) => {
          const replies = c.replies || [];
          const showAll = showAllReply[i];
          const displayReplies = showAll ? replies : replies.slice(0,2);
          return (
            <div key={i} style={{marginBottom:'2rem'}}>
              <div className="acg-comment" style={{display:'flex',alignItems:'center',marginBottom:'1.2rem',gap:'0.5rem',position:'relative',cursor: canComment ? 'pointer' : 'default'}} onClick={canComment ? () => handleReply('comment', i, null) : undefined}>
                {c.author?.avatar && <img src={c.author.avatar} alt="头像" style={{width:'24px',height:'24px',borderRadius:'50%'}} />}
                <span style={{fontWeight:'bold'}}>{c.author?.username || '匿名'}</span>
                {c.replyTo && <span style={{color:'#888',marginLeft:'0.5rem'}}>回复 @{c.replyTo}</span>}
                <span style={{marginLeft:'0.5rem'}}>{c.text || c}</span>
                <span style={{color:'#888',marginLeft:'1rem',fontSize:'0.92em'}}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
              </div>
              {replies.length > 0 && (
                <div style={{background:'#f7f7fa',borderRadius:'4px',padding:'0.5rem 1rem',marginLeft:'2.5rem',marginTop:'-1rem'}}>
                  {displayReplies.map((r, j) => (
                    <div key={j} style={{display:'flex',alignItems:'center',marginBottom:'0.5rem',fontSize:'0.92em',color:'#555',position:'relative',cursor: canComment ? 'pointer' : 'default'}} onClick={canComment ? () => handleReply('reply', i, j) : undefined}>
                      {r.author?.avatar && <img src={r.author.avatar} alt="头像" style={{width:'20px',height:'20px',borderRadius:'50%',marginRight:'0.5rem'}} />}
                      <span style={{fontWeight:'bold',marginRight:'0.5rem'}}>{r.author?.username || '匿名'}</span>
                      {r.replyTo && <span style={{color:'#888',marginRight:'0.5rem'}}>回复 @{r.replyTo}</span>}
                      <span>{r.text}</span>
                      <span style={{color:'#888',marginLeft:'1rem',fontSize:'0.9em'}}>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</span>
                    </div>
                  ))}
                  {replies.length > 2 && !showAll && (
                    <button style={{fontSize:'0.85em',color:'#4a90e2',background:'none',border:'none',cursor:'pointer'}} onClick={()=>handleShowMoreReply(i)}>更多回复...</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {canComment ? (
        <form
          className="acg-comment-form"
          onSubmit={handleCommentSubmit}
          style={{position:'fixed',left:0,bottom:0,width:'100%',background:'#fff',boxShadow:'0 -2px 8px rgba(0,0,0,0.05)',padding:'1rem',zIndex:99}}
        >
          <div style={{maxWidth:'800px',margin:'0 auto',display:'flex',gap:'0.5rem'}}>
            <input
              type="text"
              placeholder="写评论或回复..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              style={{flex:1,padding:'0.5rem',borderRadius:'4px',border:'1px solid #ccc'}}
            />
            <button type="submit" style={{padding:'0.5rem 1.5rem',background:'#4a90e2',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}>{replyTo ? `回复 @${replyTo.username}` : '评论'}</button>
          </div>
        </form>
      ) : (
        <div style={{color:'gray',marginTop:'1rem'}}>请登录后评论</div>
      )}
    </div>
  );
}

export default PostDetail;
