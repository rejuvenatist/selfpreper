// src/components/AuthConfirm.jsx
//
// 用户点击邮件里的确认链接后回到这个页面。
// Supabase SDK 会自动解析链接里的登录凭证并建立会话（detectSessionInUrl 默认开启），
// 这里只负责等待会话建立完成，然后跳转到笔记首页。

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function AuthConfirm() {
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    // 情况一：SDK 已经处理完链接、会话已就绪 → 直接跳转。
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) navigate('/plan', { replace: true })
    })

    // 情况二：SDK 还在解析链接 → 监听登录事件，成功后跳转。
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!cancelled && session) navigate('/plan', { replace: true })
    })

    // 链接过期或无效时，Supabase 会在 URL 里带上 error 参数。
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search)
    if (params.get('error')) setFailed(true)

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-sent">
          {failed ? (
            <>
              <p>登录链接已失效或无效</p>
              <p>
                请<a href="/login">返回登录页</a>重新发送
              </p>
            </>
          ) : (
            <p>正在确认登录，请稍候…</p>
          )}
        </div>
      </div>
    </div>
  )
}
