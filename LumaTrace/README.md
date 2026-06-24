# LumaTrace Wiki

LumaTrace 用户教程静态站点。内容以介绍、教学、截图工作流、设置与权限说明为主。

本地预览：

```bash
cd /Users/bbong9/Desktop/LumaTrace/wiki-site
python3 -m http.server 4174 --bind 127.0.0.1
```

访问：<http://127.0.0.1:4174/>

## 发布到公开站点

公开地址 `https://bbong9.github.io/LumaTrace/` 来自仓库 `bbong9/bbong9.github.io` 的 `main` 分支，不来自本仓库的 `gh-pages`。

同步当前 Wiki 和最新安装包：

```bash
cd /Users/bbong9/Desktop/LumaTrace
PUBLIC_WIKI_PUSH=1 ./scripts/sync_public_wiki.sh
```

只同步 Wiki 页面、不更新下载包：

```bash
PUBLIC_WIKI_SYNC_DOWNLOADS=0 PUBLIC_WIKI_PUSH=1 ./scripts/sync_public_wiki.sh
```
