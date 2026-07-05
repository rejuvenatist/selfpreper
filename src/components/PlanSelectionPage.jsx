import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

export default function PlanSelectionPage() {
  const navigate = useNavigate()

  const handlePurchase = () => {
    navigate('/payment')
  }

  return (
    <div className="plan-page">
      <h1 className="login-title" style={{ marginTop: '20px', marginBottom: '40px' }}>
        选择你的学习计划
      </h1>
      
      <div className="plan-card">
        <div className="plan-header">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#d49a0d" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 14l2-8 5 4 1-6 1 6 5-4 2 8H4zM3 16h18v2H3z" fill="currentColor"/>
          </svg>
          <h2 className="plan-title">夯实基础计划</h2>
        </div>

        <div className="plan-price">
          <span className="price-symbol">￥</span>
          <span className="price-amount">5</span>
          <span className="price-period">/终身</span>
        </div>

        <button className="plan-btn" onClick={handlePurchase}>
          购买夯实基础计划
        </button>

        <ul className="plan-features">
          <li>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            <span>掌握记背所有的高考必备公式</span>
          </li>
          <li>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            <span>练习高考之中的基础题目的解答</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
