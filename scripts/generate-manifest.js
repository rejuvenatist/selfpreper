// scripts/generate-manifest.js
//
// 递归扫描 public/notes/ 下的所有文件夹，生成一份目录索引 manifest.json。
// 规则：任何「直接包含 .md 文件」的文件夹都被当作一篇笔记（note）；
//       其余只含子文件夹的目录被当作分类（folder），用于在侧边栏分组。
//
// 生成的结构：
// {
//   "generatedAt": "ISO 时间",
//   "tree": [ 节点... ],          // 给侧边栏画树用（嵌套）
//   "notes": { id: {note} }       // 给 getNote(id) 按 id 直接取用（扁平）
// }
//
// 节点形状：
//   folder -> { type:'folder', name, path, children:[...] }
//   note   -> { type:'note',   id, title, path, mdPath, images:[...] }

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NOTES_DIR = path.join(__dirname, '..', 'public', 'notes')
const MANIFEST_PATH = path.join(NOTES_DIR, 'manifest.json')

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'])

// 把磁盘路径转成网页里能直接 fetch 的 URL 路径。
// public/notes/物理2力学/note.md  ->  /notes/物理2力学/note.md
function toUrlPath(absPath) {
  const rel = path.relative(path.join(__dirname, '..', 'public'), absPath)
  return '/' + rel.split(path.sep).map(encodeURIComponent).join('/')
}

// 用文件夹的相对路径作为稳定 id（URL 友好）。
// public/notes/力学/动量  ->  力学/动量
function toId(absDir) {
  const rel = path.relative(NOTES_DIR, absDir)
  return rel.split(path.sep).join('/')
}

const notes = {}

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  const subDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
  const files = entries.filter((e) => e.isFile()).map((e) => e.name)

  const mdFiles = files.filter((f) => f.toLowerCase().endsWith('.md'))
  const images = files.filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase())).sort()

  // 先递归处理子文件夹，得到它们的节点。
  const childNodes = subDirs
    .map((name) => scan(path.join(dir, name)))
    .filter(Boolean)

  const name = path.basename(dir)

  if (mdFiles.length > 0) {
    // 这是一篇笔记。优先选与文件夹同名的 .md，否则取第一个。
    const preferred =
      mdFiles.find((f) => path.basename(f, '.md') === name) || mdFiles.sort()[0]
    const mdAbs = path.join(dir, preferred)
    const id = toId(dir)

    const note = {
      type: 'note',
      id,
      title: name,
      path: toUrlPath(dir),
      mdPath: toUrlPath(mdAbs),
      images: images.map((img) => toUrlPath(path.join(dir, img))),
    }
    notes[id] = note

    // 笔记自身就是一个 note 节点；若它还有子文件夹，作为 children 挂上去。
    return childNodes.length > 0 ? { ...note, children: childNodes } : note
  }

  // 没有 .md：当作分类文件夹。空文件夹直接忽略。
  if (childNodes.length === 0) return null
  return { type: 'folder', name, path: toUrlPath(dir), children: childNodes }
}

function main() {
  if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true })
    console.log(`[manifest] 创建了空的 notes 目录：${NOTES_DIR}`)
  }

  const rootEntries = fs.readdirSync(NOTES_DIR, { withFileTypes: true })
  const tree = rootEntries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
    .map((name) => scan(path.join(NOTES_DIR, name)))
    .filter(Boolean)

  const manifest = {
    generatedAt: new Date().toISOString(),
    tree,
    notes,
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(
    `[manifest] 已生成 ${path.relative(process.cwd(), MANIFEST_PATH)} ` +
      `（${Object.keys(notes).length} 篇笔记）`
  )
}

main()
