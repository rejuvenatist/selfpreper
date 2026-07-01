// src/components/Sidebar.jsx
//
// 左侧文件树。从 content.getNoteTree() 拿目录，递归画出来。
// note 节点是可点击的链接，folder 节点是分组标题（可展开/收起）。

import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getNoteTree } from '../lib/content.js'

function TreeNode({ node, depth }) {
  const [open, setOpen] = useState(true)
  const indent = { paddingLeft: `${depth * 14 + 12}px` }

  // 纯分类文件夹（无 .md，只用来分组）
  if (node.type === 'folder') {
    return (
      <li>
        <button
          type="button"
          className="tree-folder"
          style={indent}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="tree-caret">{open ? '▾' : '▸'}</span>
          {node.name}
        </button>
        {open && node.children?.length > 0 && (
          <ul className="tree-list">
            {node.children.map((child) => (
              <TreeNode key={child.id || child.path} node={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    )
  }

  // 笔记节点（可点击）。它也可能带子文件夹。
  const hasChildren = node.children?.length > 0
  return (
    <li>
      <div className="tree-row" style={indent}>
        {hasChildren ? (
          <button
            type="button"
            className="tree-caret-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '收起' : '展开'}
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="tree-caret-spacer" />
        )}
        <NavLink
          to={`/note/${encodeURIComponent(node.id)}`}
          className={({ isActive }) => 'tree-note' + (isActive ? ' is-active' : '')}
        >
          {node.title}
        </NavLink>
      </div>
      {hasChildren && open && (
        <ul className="tree-list">
          {node.children.map((child) => (
            <TreeNode key={child.id || child.path} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Sidebar() {
  const [tree, setTree] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getNoteTree()
      .then(setTree)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <nav className="sidebar">
      <NavLink to="/" className="sidebar-title">
        📚 我的复习笔记
      </NavLink>

      {error && <p className="sidebar-error">加载目录失败：{error}</p>}

      {!error && tree.length === 0 && (
        <p className="sidebar-empty">
          还没有笔记。把文件夹放进 <code>public/notes/</code> 再运行
          <code>npm run manifest</code>。
        </p>
      )}

      <ul className="tree-list">
        {tree.map((node) => (
          <TreeNode key={node.id || node.path} node={node} depth={0} />
        ))}
      </ul>
    </nav>
  )
}
