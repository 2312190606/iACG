import React, { useState } from 'react';
import './App.css';

function PostForm({ onSubmit, onBack }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('动画');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      title,
      content,
      category,
      image: image ? URL.createObjectURL(image) : null,
      video: video ? URL.createObjectURL(video) : null,
      comments: []
    });
    setTitle('');
    setContent('');
    setCategory('动画');
    setImage(null);
    setVideo(null);
  };

  return (
    <div className="acg-post-form">
      <button onClick={onBack} style={{marginBottom: '1rem'}}>返回</button>
      <h2>发表新帖</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="动画">动画</option>
          <option value="漫画">漫画</option>
          <option value="游戏">游戏</option>
        </select>
        <textarea
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div style={{marginBottom: '1rem'}}>
          <label>图片：</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label>视频：</label>
          <input type="file" accept="video/*" onChange={handleVideoChange} />
        </div>
        <button type="submit">发布</button>
      </form>
    </div>
  );
}

export default PostForm;
