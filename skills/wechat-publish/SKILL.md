---
name: wechat-publish
description: 用内置 CLI 把 Markdown/HTML 转成微信公众号可粘贴的内联样式 HTML。当用户要写/排版/发布公众号图文、说「转公众号」「公众号排版」「MD 转微信」「生成可直接贴进公众号的文章」时使用。不要用本技能做自动发文/注入后台。
---

# wechat-publish

把内容转成**可直接复制进公众号编辑器**的 HTML。AI **调用本技能自带脚本**完成转换，不要手写整篇内联样式。

## 重要

- 不做自动注入、半自动发文、Playwright/Console 写编辑器  
- 默认作者：**松君杂货铺**（用户未指定时）  
- 图片优先 `data:image/...;base64,...`；禁止编造假 base64  

## 步骤

### 1. 写/准备源内容

按用户需求写 Markdown（或整理已有 MD/HTML）：

- 标题 `#`–`####`，段落空行  
- 图：有图文件就内嵌 base64；没有则写 `https://PLACEHOLDER.local/xxx.jpg` 并在回复里说明需替换  
- 允许 `![alt](data:...)` 与 `<img src="data:" style="box-shadow:...;border-radius:8px;max-width:100%"/>` 混用  
- 正文外链放文末「参考链接」，提示「阅读原文」  

把源内容写到临时文件（如 `article.md`）。

### 2. 运行转换脚本（必须）

```bash
node "<skill_dir>/scripts/convert.js" article.md -t <theme> -o article.wechat.html --author "松君杂货铺"
```

| 参数 | 说明 |
|------|------|
| `-t` | `minimal` `zhihu` `juejin` `techPurple` `wood` `night`（默认 minimal） |
| `-o` | 输出 HTML 文件（也可不写，打到 stdout） |
| `--title` | 若源无 H1，可前置标题 |
| `--author` | 文末追加作者行 |
| `--html` | 源为 HTML 时使用 |
| `--wrap` | 包一层本地预览页（一般不用） |

`<skill_dir>` 为本技能目录，例如：  
`C:\Users\<user>\.claude\skills\wechat-publish`

若无 `node`，用系统里的 node 完整路径执行同一脚本。

### 3. 交付给用户

1. 把 **`article.wechat.html` 的内容**（转换后的 HTML）放在 ```html 代码块里  
2. 一句话操作：**复制该 HTML → 公众号新建文章 → 正文粘贴 → 填标题/作者 → 预览发布**  
3. 若脚本 `WARN non-embedded image`，提醒用户先换成 base64 或素材库图  

需要给用户看源 MD 时，再附 ```markdown 代码块。

### 4. 主题怎么选（未指定时）

| 场景 | theme |
|------|--------|
| 默认/通用 | `minimal` |
| 干货知识 | `zhihu` |
| 技术笔记 | `juejin` |
| 深色科技 | `techPurple` |
| 品牌生活 | `wood` |
| 夜间 | `night` |

## 示例

用户：「把这份提纲写成公众号文，知乎风」

1. 写 `article.md`（含 base64 或 PLACEHOLDER 图）  
2. `node .../scripts/convert.js article.md -t zhihu -o article.wechat.html --author "松君杂货铺"`  
3. 回复：正文简述 + ```html 成品 + 「复制粘贴进公众号」  

## 故障

| 问题 | 处理 |
|------|------|
| `node` 不是命令 | `Get-Command node` 或用完整路径 |
| Unknown theme | 使用上表合法 id |
| 图警告 | 嵌 base64 或改 PLACEHOLDER |
| HTML 模式失败 | 确认加了 `--html` |

## 边界

- 本技能**不**操作 mp.weixin.qq.com 后台  
- 样式细节见 `references/image-style.md`（可选）  
- 与 `wechat-content` 冲突时以本技能为准  
