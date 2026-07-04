// src/components/LoginPage.jsx
//
// 登录页：只支持邮箱登录。目前是纯前端空壳，
// 点击按钮后只在页面上显示"确认邮件已发送"的提示，不会真的发邮件。

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: 后端接入后，在这里调用"发送登录确认邮件"的接口
    setSent(true)
  }

  return (
    <div className="login-page">
      <header className="login-brand">
        <h1 className="login-title">自学备考者</h1>
        <p className="login-slogan">自学改变人生</p>
      </header>

      <div className="login-card">
        {sent ? (
          <div className="login-sent">
            <p>确认邮件已发送到【{email}】</p>
            <p>请查收确认登录邮件</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="email"
              required
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="login-btn" type="submit">
              发送登录邮件
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
