// src/App.jsx
//
// 总指挥：左边 Sidebar（目录），右边按路由显示首页或某篇笔记。

import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import NoteView from './components/NoteView.jsx'

function Home() {
  return (
    <div className="note-view note-msg">
      <h1>👋 欢迎</h1>
      <p>从左侧目录里选一篇笔记开始阅读。</p>
    </div>
  )
}

export default function App() {
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
