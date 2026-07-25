# Cheerly 的个人主页

这是 `cheerly-pku.github.io` 的个人主页仓库，包含主页、Markdown 笔记和课程资料入口。

## 主要入口

- `index.html`：当前发布用的手写静态主页。
- `note.html`：手写静态主页使用的 Markdown 笔记阅读页。
- `parallel-practice/`：并行程序设计资料页。
- `linear-algebra-practice/`：线性代数/张量章节资料页。

## Astro 源码

仓库里也保留了一套 Astro 版本源码：

- `src/pages/`：Astro 页面入口。
- `src/content/notes/`：Astro 内容集合里的笔记。
- `src/styles/global.css`：Astro 版本样式。
- `public/images/`：Astro 构建时复制到站点根目录的图片资源。

常用命令：

```powershell
npm run dev
npm run build
npm run preview
```

`dist/` 是 Astro 构建产物，已经放进 `.gitignore`，需要发布时再重新生成。

## 静态资源

- `css/`、`js/`、`images/`：根目录手写静态主页使用的资源。
- `notes/`：`note.html` 使用的 Markdown 笔记源文件。

## 整理原则

当前先保留“手写静态页”和“Astro 源码”两套结构，避免影响现有页面访问。后续如果要继续整理，建议选择一个主线：

1. 继续以根目录 `index.html` 为发布主入口，Astro 目录仅作为备份/实验。
2. 或者把 `parallel-practice/`、`linear-algebra-practice/` 等入口同步进 `src/pages/index.astro`，统一改成 Astro 构建发布。
