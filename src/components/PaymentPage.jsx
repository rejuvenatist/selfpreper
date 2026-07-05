import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

export default function PaymentPage() {
  const navigate = useNavigate()

  const handleSimulatePayment = () => {
    // 模拟支付成功，跳转到笔记页面
    navigate('/', { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '24px' }}>支付宝支付页面（模拟）</h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>
          正在加载支付二维码...<br />
          由于是测试环境，请直接点击下方按钮完成模拟支付。
        </p>
        <button className="login-btn" onClick={handleSimulatePayment}>
          支付完成，进入笔记
        </button>
      </div>
    </div>
  )
}
