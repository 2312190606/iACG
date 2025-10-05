
import React, { useState, useEffect } from 'react';
import './App.css';
import PostForm from './PostForm';
import PostDetail from './PostDetail';
import Auth from './Auth';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';
import MessageCenter from './MessageCenter';

const categories = ['全部', '动画', '漫画', '游戏'];

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('time'); // 'time' | 'likes'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('全部');
  const [showPostForm, setShowPostForm] = useState(false);
  const [detailIdx, setDetailIdx] = useState(null);
  const [detailPostId, setDetailPostId] = useState(null); // 新增唯一标识
  const [user, setUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [hasMessage, setHasMessage] = useState(false);
  // 消息红点检测
  useEffect(() => {
    if (!user) return;
    let hasMsg = false;
    posts.forEach(post => {
      // 自己发的帖子被评论
      if (post.author?.username === user.username) {
        post.comments.forEach(c => {
          if (c.author?.username !== user.username) hasMsg = true;
          // 回复自己的评论
          if (c.replies) {
            c.replies.forEach(r => {
              if (r.replyTo === user.username && r.author?.username !== user.username) hasMsg = true;
            });
          }
        });
      }
    });
    setHasMessage(hasMsg);
  }, [posts, user]);

  const handleAddPost = (post) => {
    setPosts([
      {
        ...post,
        author: {
          username: user.username,
          avatar: user.avatar,
        },
        createdAt: new Date().toISOString(),
      },
      ...posts,
    ]);
    setShowPostForm(false);
  };

  const handleAddComment = (comment) => {
    if (!comment.trim() || detailIdx === null) return;
    const newPosts = [...posts];
    newPosts[detailIdx].comments.push({
      text: comment,
      author: {
        username: user.username,
        avatar: user.avatar,
      },
      createdAt: new Date().toISOString(),
    });
    setPosts(newPosts);
  };

  const handleLogin = (userInfo) => {
    setUser({
      username: userInfo.username,
      avatar: userInfo.avatar ? URL.createObjectURL(userInfo.avatar) : null,
    });
  };

  const handleUpdateUser = (info) => {
    setUser({
      username: info.username,
      avatar: info.avatar ? (typeof info.avatar === 'string' ? info.avatar : URL.createObjectURL(info.avatar)) : null,
    });
    setShowUserInfo(false);
  };

  let filteredPosts =
    (currentCategory === '全部' ? posts : posts.filter((p) => p.category === currentCategory))
      .filter(p =>
        (!search || p.title.includes(search) || p.content.includes(search))
      );
  // 排序
  filteredPosts = [...filteredPosts].sort((a, b) => {
    if (sortType === 'time') {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? ta - tb : tb - ta;
    } else {
      const la = a.likes || 0;
      const lb = b.likes || 0;
      return sortOrder === 'asc' ? la - lb : lb - la;
    }
  });

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (showMessageCenter) {
    return <MessageCenter user={user} posts={posts} onBack={() => setShowMessageCenter(false)} />;
  }
  if (showChangePwd) {
    return <ChangePassword onBack={()=>setShowChangePwd(false)} onSubmit={({oldPwd,newPwd})=>{
      // 此处可接入后端API
      alert('密码修改成功！');
      setShowChangePwd(false);
    }} />;
  }
  if (showUserInfo) {
    return <UserInfo user={user} posts={posts} onUpdate={handleUpdateUser} onBack={() => setShowUserInfo(false)} onLogout={() => {
      if(window.confirm('确定要退出登录吗？')){
        setUser(null);
        setShowUserInfo(false);
      }
    }} hasMessage={hasMessage} onChangePwd={()=>setShowChangePwd(true)} setDetailIdx={post => {
      setShowUserInfo(false);
      setDetailPostId(post.createdAt + '||' + post.title);
      setDetailIdx(null); // 兼容旧逻辑
    }} />;
  }

  // 详情页渲染逻辑：优先 detailPostId，否则用 detailIdx
  let detailPost = null;
  if (detailPostId) {
    detailPost = posts.find(p => (p.createdAt + '||' + p.title) === detailPostId);
  } else if (detailIdx !== null) {
    detailPost = posts[detailIdx];
  }

  return (
    <div className="acg-container">
      <header className="acg-header">
  <h1>iACG</h1>
        <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={currentCategory === cat ? 'active' : ''}
                onClick={() => setCurrentCategory(cat)}
                style={{minWidth:'60px'}}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center',gap:'0.5rem'}}>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="搜索帖子..."
              style={{padding:'0.4rem 1rem',borderRadius:'4px',border:'1px solid #ccc',width:'260px'}}
            />
            <button onClick={()=>setSearch(searchInput)} style={{padding:'0.4rem 1.2rem',borderRadius:'4px',border:'none',background:'#4a90e2',color:'#fff',fontWeight:'bold',cursor:'pointer'}}>搜索</button>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <button style={{position:'relative'}} onClick={()=>setShowMessageCenter(true)}>
              <span style={{fontWeight:'bold'}}>消息</span>
              {hasMessage && <span style={{position:'absolute',top:'2px',right:'-8px',width:'10px',height:'10px',background:'red',borderRadius:'50%'}}></span>}
            </button>
            <button style={{position:'relative'}} onClick={()=>setShowUserInfo(true)}>
              {user.avatar && <img src={user.avatar} alt="头像" style={{width:'32px',height:'32px',borderRadius:'50%',verticalAlign:'middle',marginRight:'0.5rem'}} />}
              {user.username}
            </button>
          </div>
        </nav>
      </header>
      <main>
        {detailPost ? (
          <PostDetail
            post={detailPost}
            onBack={() => { setDetailPostId(null); setDetailIdx(null); }}
            onAddComment={user ? handleAddComment : null}
            canComment={!!user}
            onLike={() => {
              const newPosts = [...posts];
              const idx = newPosts.findIndex(p => (p.createdAt + '||' + p.title) === (detailPost.createdAt + '||' + detailPost.title));
              if (idx === -1) return;
              const p = newPosts[idx];
              if (!p.likedBy) p.likedBy = [];
              if (!p.likes) p.likes = 0;
              if (!p.likedBy.includes(user.username)) {
                p.likes++;
                p.likedBy.push(user.username);
              } else {
                p.likes--;
                p.likedBy = p.likedBy.filter(u => u !== user.username);
              }
              setPosts(newPosts);
            }}
            onFav={() => {
              const newPosts = [...posts];
              const idx = newPosts.findIndex(p => (p.createdAt + '||' + p.title) === (detailPost.createdAt + '||' + detailPost.title));
              if (idx === -1) return;
              const p = newPosts[idx];
              if (!p.favedBy) p.favedBy = [];
              if (!p.favs) p.favs = 0;
              if (!p.favedBy.includes(user.username)) {
                p.favs++;
                p.favedBy.push(user.username);
              } else {
                p.favs--;
                p.favedBy = p.favedBy.filter(u => u !== user.username);
              }
              setPosts(newPosts);
            }}
            onShare={() => {
              const newPosts = [...posts];
              const idx = newPosts.findIndex(p => (p.createdAt + '||' + p.title) === (detailPost.createdAt + '||' + detailPost.title));
              if (idx === -1) return;
              const p = newPosts[idx];
              if (!p.shares) p.shares = 0;
              p.shares++;
              setPosts(newPosts);
              window.alert('已转发！');
            }}
            user={user}
          />
        ) : !showPostForm ? (
          <>
            <section style={{textAlign: 'right', marginBottom: '2rem'}}>
              <button onClick={() => setShowPostForm(true)} style={{padding: '0.5rem 1.5rem', background: '#4a90e2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}} disabled={!user}>发表新帖</button>
            </section>
            <section className="acg-posts">
              <h2>帖子列表</h2>
              <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
                <span>排序：</span>
                <select value={sortType} onChange={e=>setSortType(e.target.value)} style={{padding:'0.3rem 0.7rem',borderRadius:'4px'}}>
                  <option value="time">按时间</option>
                  <option value="likes">按点赞量</option>
                </select>
                <select value={sortOrder} onChange={e=>setSortOrder(e.target.value)} style={{padding:'0.3rem 0.7rem',borderRadius:'4px'}}>
                  <option value="desc">倒序</option>
                  <option value="asc">正序</option>
                </select>
              </div>
              <div>
                {filteredPosts.length === 0 ? (
                  <p>暂无帖子</p>
                ) : (
                  filteredPosts.map((post, idx) => {
                    // 点赞、收藏、转发状态
                    if (!post.likes) post.likes = 0;
                    if (!post.likedBy) post.likedBy = [];
                    if (!post.favs) post.favs = 0;
                    if (!post.favedBy) post.favedBy = [];
                    if (!post.shares) post.shares = 0;
                    const liked = user && post.likedBy.includes(user.username);
                    const faved = user && post.favedBy.includes(user.username);
                    const shared = user && post.sharedBy && post.sharedBy.includes(user.username);
                    return (
                      <div className="acg-post" key={idx} style={{cursor: 'pointer',border:'1px solid #eee',borderRadius:'8px',marginBottom:'1.5rem',padding:'1rem'}}>
                        <div style={{display:'flex',alignItems:'center',marginBottom:'0.5rem'}}>
                          {post.author?.avatar && <img src={post.author.avatar} alt="头像" style={{width:'32px',height:'32px',borderRadius:'50%',marginRight:'0.5rem'}} />}
                          <span style={{fontWeight:'bold',marginRight:'0.5rem'}}>{post.author?.username || '匿名'}</span>
                          <span className="acg-post-category">[{post.category}]</span>
                          <span style={{color:'#888',marginLeft:'1rem',fontSize:'0.95em'}}>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</span>
                        </div>
                        <div className="acg-post-title" onClick={() => setDetailIdx(posts.indexOf(post))} style={{fontSize:'1.15em',fontWeight:'bold',cursor:'pointer'}}>{post.title}</div>
                        <div className="acg-post-content" onClick={() => setDetailIdx(posts.indexOf(post))} style={{cursor:'pointer'}}>{post.content}</div>
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
                        <div style={{display:'flex',gap:'1.5rem',marginTop:'0.7rem'}}>
                          <button onClick={() => {
                            const newPosts = [...posts];
                            const p = newPosts[posts.indexOf(post)];
                            if (!p.likedBy.includes(user.username)) {
                              p.likes++;
                              p.likedBy.push(user.username);
                            } else {
                              p.likes--;
                              p.likedBy = p.likedBy.filter(u => u !== user.username);
                            }
                            setPosts(newPosts);
                          }} style={{background:'none',border:'none',color:liked?'#e74c3c':'#888',fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.3em'}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? '#e74c3c' : 'none'} stroke={liked ? '#e74c3c' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z"/></svg>
                            {post.likes}
                          </button>
                          <button onClick={() => {
                            const newPosts = [...posts];
                            const p = newPosts[posts.indexOf(post)];
                            if (!p.favedBy.includes(user.username)) {
                              p.favs++;
                              p.favedBy.push(user.username);
                            } else {
                              p.favs--;
                              p.favedBy = p.favedBy.filter(u => u !== user.username);
                            }
                            setPosts(newPosts);
                          }} style={{background:'none',border:'none',color:faved?'#f7b731':'#888',fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.3em'}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={faved ? '#f7b731' : 'none'} stroke={faved ? '#f7b731' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            {post.favs}
                          </button>
                          <button onClick={() => {
                            const newPosts = [...posts];
                            const p = newPosts[posts.indexOf(post)];
                            if (!p.sharedBy) p.sharedBy = [];
                            if (!p.shares) p.shares = 0;
                            if (!p.sharedBy.includes(user.username)) {
                              p.shares++;
                              p.sharedBy.push(user.username);
                              setPosts(newPosts);
                              window.alert('已转发！');
                            }
                          }} style={{background:'none',border:'none',color:shared?'#4a90e2':'#888',fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.3em'}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={shared ? '#4a90e2' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                            {post.shares}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </>
        ) : (
          <PostForm onSubmit={handleAddPost} onBack={() => setShowPostForm(false)} />
        )}
      </main>
    </div>
  );
}
export default App;
