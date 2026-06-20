# SwiftShot Wiki

这是 SwiftShot 独立 Wiki 静态站点，样式沿用现有 Wiki 视觉体系，内容替换为 SwiftShot 项目说明、截图和维护文档。

## 本地预览

```bash
cd /path/to/SwiftShot/wiki-site
python3 -m http.server 4174 --bind 127.0.0.1
```

浏览器打开：`http://127.0.0.1:4174/`

## 目录

- `index.html`：首页
- `wiki/`：文档页面
- `swiftshot/`：样式、脚本、截图、搜索索引和图标资源

## 说明

- 本站点不依赖 Node/VitePress，是可直接部署的静态 HTML/CSS/JS。
- 视觉样式沿用现有 Wiki 视觉体系，已在本目录内独立保存 CSS/JS 资源。
- 本目录只属于 SwiftShot 仓库；不依赖其他 Wiki 仓库运行。
