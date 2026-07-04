// src/components/LoginPage.jsx
//
// 登录页：只支持邮箱登录（Supabase Magic Link 魔法链接）。
// 用户填邮箱 → Supabase 发确认邮件 → 用户点邮件里的链接 → 回到 /auth/confirm 自动登录。

import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const addr = email.trim()
    if (!addr || sending) return

    setSending(true)
    setError('')

    // signInWithOtp：未注册的邮箱会自动注册，已注册的直接发登录链接。
    // emailRedirectTo：用户点击邮件链接后回到的页面（必须在 Supabase 后台的
    // Redirect URLs 白名单里，见 Supabase 设置说明）。
    const { error } = await supabase.auth.signInWithOtp({
      email: addr,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    setSending(false)
    if (error) {
      setError(`发送失败：${error.message}`)
    } else {
      setSent(true)
    }
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
            <button className="login-btn" type="submit" disabled={sending}>
              {sending ? '发送中…' : '发送登录邮件'}
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
