// src/App.jsx
//
// 总指挥：/login 是独立的登录页；其余路由走"左边目录 + 右边内容"的笔记布局。

import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import NoteView from './components/NoteView.jsx'
import LoginPage from './components/LoginPage.jsx'

function Home() {
  return (
    <div className="note-view note-msg">
      <h1>👋 欢迎</h1>
      <p>从左侧目录里选一篇笔记开始阅读。</p>
    </div>
  )
}

function NotesLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note/:id" element={<NoteView />} />
          <Route path="*" element={<div className="note-view note-msg">页面不存在。</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* 用户点击邮件里的确认链接后打开的地址。
          后端做好之前，先直接跳转到笔记首页，方便以后接入。 */}
      <Route path="/auth/confirm" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotesLayout />} />
    </Routes>
  )
}
