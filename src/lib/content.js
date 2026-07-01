// src/lib/content.js
//
// 唯一的数据入口。界面只通过这里拿数据，不直接碰 manifest / 数据库。
// 现在：从 public/notes/manifest.json 读。
// 将来：换成数据库（如 Supabase）时，只改这个文件，组件一行都不用动。
//
// 对外暴露两个函数：
//   getNoteTree()  -> 目录树（给侧边栏）
//   getNote(id)    -> 某一篇笔记的元信息 + 正文 markdown

let manifestPromise = null

// manifest.json 在 public/notes/ 下，构建后位于站点根的 /notes/manifest.json。
function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch(`${import.meta.env.BASE_URL}notes/manifest.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`无法加载 manifest.json（HTTP ${res.status}）`)
        return res.json()
      })
      .catch((err) => {
        // 失败时重置，让下次调用可以重试。
        manifestPromise = null
        throw err
      })
  }
  return manifestPromise
}

export async function getNoteTree() {
  const manifest = await loadManifest()
  return manifest.tree || []
}

export async function getNote(id) {
  const manifest = await loadManifest()
  const note = manifest.notes?.[id]
  if (!note) return null

  // 拉取正文 markdown。
  const res = await fetch(note.mdPath)
  if (!res.ok) throw new Error(`无法加载笔记正文（HTTP ${res.status}）`)
  const markdown = await res.text()

  return { ...note, markdown }
}
