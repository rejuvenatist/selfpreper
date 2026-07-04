// src/App.jsx
//
// 总指挥：/login 是独立的登录页；其余路由走"左边目录 + 右边内容"的笔记布局。
// 全站登录守卫：没有登录会话的人访问任何笔记页面，一律跳转到 /login。

import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import NoteView from './components/NoteView.jsx'
import LoginPage from './components/LoginPage.jsx'
import AuthConfirm from './components/AuthConfirm.jsx'
import { supabase } from './lib/supabase.js'

function Home() {
  return (
    <div className="note-view note-msg">
      <h1>👋 欢迎</h1>
      <p>从左侧目录里选一篇笔记开始阅读。</p>
    </div>
  )
}

function NotesLayout({ user }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="topbar">
          <span className="topbar-email">{user.email}</span>
        </div>
        <div className="content-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/note/:id" element={<NoteView />} />
            <Route path="*" element={<div className="note-view note-msg">页面不存在。</div>} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  // undefined = 还在向 Supabase 查询会话；null = 查完了、没登录；对象 = 已登录。
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // 登录、退出、令牌刷新时都会触发，保证页面状态和会话同步。
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // 会话还没查完之前什么都不渲染，避免已登录用户被闪跳到登录页。
  if (session === undefined) return null

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <LoginPage />}
      />
      {/* 用户点击邮件里的确认链接后打开的地址：
          等 Supabase 建立会话，然后跳转到笔记首页。 */}
      <Route path="/auth/confirm" element={<AuthConfirm />} />
      <Route
        path="*"
        element={session ? <NotesLayout user={session.user} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}
