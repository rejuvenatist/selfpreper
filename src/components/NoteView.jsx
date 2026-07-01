// src/components/NoteView.jsx
//
// 右侧渲染区：把选中的 .md 渲染成网页。
// - 数学公式：remark-math + rehype-katex（$...$ 行内，$$...$$ 整行）。
// - 表格等：remark-gfm。
// - 图片：.md 和图片在同一文件夹，markdown 里写相对路径，这里自动补成
//   该笔记文件夹下的完整地址；同时兼容 Obsidian 的 ![[xxx.png]] 写法。

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import { getNote } from '../lib/content.js'

// 把 Obsidian 的内嵌图片 ![[image.png]] / ![[image.png|说明]]
// 转成标准 markdown ![说明](image.png)，这样 react-markdown 才认识。
function normalizeObsidianEmbeds(md) {
  return md.replace(/!\[\[([^\]]+?)\]\]/g, (_m, inner) => {
    const [target, alt = ''] = inner.split('|')
    return `![${alt.trim()}](${target.trim()})`
  })
}

// 判断是不是「需要补全文件夹前缀」的相对路径。
function isRelative(url) {
  return !!url && !/^(https?:)?\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('data:')
}

// 把相对图片地址解析成该笔记文件夹下的完整 URL，并对各段做 URL 编码
// （文件名可能含空格、中文）。folder 形如 /notes/物理2力学。
function resolveSrc(src, folder) {
  if (!isRelative(src)) return src
  const encoded = src
    .split('/')
    .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
    .join('/')
  return `${folder}/${encoded}`
}

export default function NoteView() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setNote(null)

    getNote(decodeURIComponent(id))
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setStatus('notfound')
          return
        }
        setNote(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (status === 'loading') return <div className="note-view note-msg">加载中…</div>
  if (status === 'notfound')
    return <div className="note-view note-msg">找不到这篇笔记（id: {id}）。</div>
  if (status === 'error')
    return <div className="note-view note-msg">加载失败：{error}</div>

  const folder = note.path

  return (
    <article className="note-view markdown-body">
      <Markdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({ src = '', alt, ...props }) => (
            <img src={resolveSrc(src, folder)} alt={alt} loading="lazy" {...props} />
          ),
        }}
      >
        {normalizeObsidianEmbeds(note.markdown)}
      </Markdown>
    </article>
  )
}
