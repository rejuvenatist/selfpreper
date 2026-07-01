# self-prep-exam-web

把 Markdown 复习笔记显示在网页上的小站。**白底黑字 + 数学公式渲染**，
只要把「一个文件夹（含 `.md` 和它的图片）」放进 `public/notes/`，就会自动出现在网站上。

技术栈：**React + Vite**；公式用 `react-markdown` + `remark-math` + `rehype-katex`（KaTeX 引擎）。

## 目录结构

```
self-prep-exam-web/
├── public/notes/                 ← 你拖笔记的地方（.md + 图片放同一文件夹）
├── scripts/generate-manifest.js  ← 扫描 notes/，生成目录清单 manifest.json
├── src/
│   ├── lib/content.js            ← 唯一的数据入口（以后换数据库只改这里）
│   ├── components/Sidebar.jsx    ← 左侧文件树
│   ├── components/NoteView.jsx   ← 右侧笔记渲染区
│   ├── App.jsx                   ← 拼装左右 + 路由
│   ├── main.jsx                  ← React 入口
│   └── index.css                 ← 样式
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml
```

## 本地开发

```bash
npm install            # 第一次或换电脑后必跑
npm run dev            # 会自动先生成 manifest，再启动开发服务器
```

打开终端里打印的地址（一般是 http://localhost:5173/）。

> `npm run dev` 与 `npm run build` 都会自动先跑 `generate-manifest.js`。
> 如果只想单独刷新目录索引：`npm run manifest`。

## 新增笔记

1. 在 `public/notes/` 里新建一个文件夹（文件夹名 = 侧边栏标题）。
2. 把 `.md` 和它用到的图片**放进同一个文件夹**。图片在 `.md` 里直接写文件名即可，
   也支持 Obsidian 的 `![[图片.png]]` 写法。
3. `npm run dev` 本地看效果；或直接 commit + push，让 Netlify 自动构建上线。

## 部署到 Netlify

- Build command: `npm run build`
- Publish directory: `dist`

`netlify.toml` 里已经写好这两项，以及单页应用的路由兜底规则。
