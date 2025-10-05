# iACG ACG社区项目说明文档

## 项目简介

iACG 是一个基于 React 的 ACG（动画、漫画、游戏）社区前端项目，支持用户注册、登录、发帖、评论、点赞、收藏、消息通知、个人中心等功能。

---

## 技术栈
- React 18
- JavaScript (ES6+)
- CSS3
- 组件化开发

---

## 主要功能模块

### 1. 用户认证
- 登录/注册（`Auth.js`）
- 登录页有品牌大字背景，风格与主界面一致
- 注册需填写用户名、邮箱、密码

### 2. 帖子系统
- 发帖（`PostForm.js`）
- 帖子展示、详情（`App.js`, `PostDetail.js`）
- 支持图片、视频、文本内容
- 帖子可点赞、收藏、转发
- 支持按时间/点赞量排序、分类筛选、搜索

### 3. 评论与回复
- 支持对帖子评论、对评论进行多级回复
- 评论区支持@回复

### 4. 消息中心
- 消息红点提醒（`MessageCenter.js`）
- 展示与自己相关的评论、回复消息

### 5. 个人中心
- 个人信息展示与编辑（`UserInfo.js`）
- 修改头像、用户名、密码（`ChangePassword.js`）
- 我的帖子、我的收藏、消息中心分栏
- 我的帖子/收藏可点击进入详情

### 6. UI/UX
- 响应式布局，主色调蓝色
- 顶部导航栏，品牌 logo
- 登录页与主界面风格统一
- 主要交互按钮有高亮与悬停效果

---

## 主要文件结构

- `src/App.js`         ：主入口，页面路由与主逻辑
- `src/Auth.js`        ：登录/注册页
- `src/UserInfo.js`    ：个人中心
- `src/PostForm.js`    ：发帖表单
- `src/PostDetail.js`  ：帖子详情
- `src/MessageCenter.js`：消息中心
- `src/ChangePassword.js`：修改密码
- `src/App.css`        ：全局样式

---

## 数据结构简述
- 用户：`{ username, avatar, email }`
- 帖子：`{ title, content, author, createdAt, image, video, likes, likedBy, favs, favedBy, shares, sharedBy, comments }`
- 评论：`{ text, author, createdAt, replies }`
- 回复：`{ text, author, createdAt, replyTo }`

---

## 运行说明
1. 安装依赖：`npm install`
2. 启动开发：`npm start`
3. 访问：`http://localhost:3000`

---

## 备注
- 当前为前端 SPA，数据为内存存储，刷新会丢失。
- 可扩展后端（如 Node.js + MySQL）实现持久化。