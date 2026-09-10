---
name: wechat-publish
description: 一站式生成可直接粘贴进微信公众号的成品。产出已内联样式的公众号兼容 HTML（可选附 Markdown 源），覆盖图片 base64、六套主题、标题作者。不含自动注入/半自动发文。当用户要求写公众号图文、要「能直接贴进公众号」的内容时触发。
---

# 公众号发布一站式（wechat-publish）

目标：**最终交付物 = 可直接复制进公众号编辑器的成品**，而不是还要手工排版的草稿。

本技能**只负责产出可粘贴内容**，不包含自动注入、半自动发文、Console 写编辑器等流程。

---

## 1. 交付什么（强制）

### A. 成品 HTML（默认）

用一个 ```html 代码块输出 **完整、已内联样式** 的正文片段（不要 `<html>/<head>` 外壳）：

```html
<section style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;font-size:16px;color:#222222;line-height:1.75;padding:20px 16px">
  <h1 style="font-size:24px;font-weight:700;line-height:1.4;margin:32px 0 16px;color:#111111;padding-bottom:12px;border-bottom:2px solid #111111">文章标题</h1>
  <p style="font-size:16px;line-height:1.75;margin:0 0 16px;color:#222222">正文……</p>
</section>
```

用户复制后，在公众号新建文章正文区粘贴即可。

### B. Markdown 源（可选）

用户还要可编辑源时另附 ```markdown；图片须为 `data:` 或可下载 https。

### C. 元信息

- **标题**：…
- **作者**：默认 **松君杂货铺**（用户未指定则用此）
- **主题**：minimal / zhihu / juejin / techPurple / wood / night

---

## 2. 本地预览工具（可选，非必须）

目录：`D:\桌面\豆包\公众号注入\`

仅用于本地预览与复制，**不引导自动注入**：

| 路径 | 用途 |
|------|------|
| `index.html` | 打开后可粘贴 MD/HTML → 转换预览 → **复制到剪贴板** |
| `skill/SKILL.md` | 格式细则副本 |

推荐用户路径：成品 HTML 或 MD → `index.html` 预览 → 复制到剪贴板 → 公众号正文 `Ctrl+V`。

---

## 3. 主题内联样式速查

字体：`-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif`  
等宽：`Menlo, Consolas, 'Courier New', 'PingFang SC', monospace`

### minimal 极简白（默认）

| 元素 | style |
|------|--------|
| section | `background-color:#ffffff;font-family:<FONT>;font-size:16px;color:#222222;line-height:1.75;padding:20px 16px` |
| h1 | `font-size:24px;font-weight:700;line-height:1.4;margin:32px 0 16px;color:#111111;padding-bottom:12px;border-bottom:2px solid #111111` |
| h2 | `font-size:20px;font-weight:700;line-height:1.4;margin:28px 0 14px;color:#111111;padding-left:12px;border-left:4px solid #111111` |
| h3 | `font-size:17px;font-weight:600;margin:24px 0 12px;color:#111111` |
| p | `font-size:16px;line-height:1.75;margin:0 0 16px;color:#222222` |
| strong | `font-weight:700;color:#111111` |
| code | `font-family:<MONO>;font-size:14px;background-color:#f5f5f5;color:#c7254e;padding:2px 6px;border-radius:3px` |
| pre | `font-family:<MONO>;font-size:13px;line-height:1.6;background-color:#f7f7f7;color:#333333;padding:16px;border-radius:6px;margin:16px 0;white-space:pre-wrap;word-break:break-all;border:1px solid #eeeeee` |
| blockquote | `margin:16px 0;padding:12px 16px;background-color:#f9f9f9;border-left:4px solid #dddddd;color:#666666;font-size:15px;line-height:1.7` |
| img | `max-width:100%;height:auto;border-radius:8px;display:block;margin:16px auto;box-shadow:0 4px 16px rgba(0,0,0,0.15)` |
| table | `width:100%;border-collapse:collapse;margin:16px 0;font-size:14px` |
| th | `background-color:#fafafa;color:#111111;font-weight:600;padding:10px 12px;border:1px solid #eeeeee;text-align:left` |
| td | `padding:10px 12px;border:1px solid #eeeeee;color:#333333` |
| hr | `border:none;border-top:1px solid #eeeeee;margin:28px 0` |

### zhihu 知乎蓝

白底容器同上；h1/h2/strong `color:#0084ff`；blockquote `background:#f0f6ff;border-left:4px solid #0084ff`；th `background:#f0f6ff;color:#0084ff;border:1px solid #dbeafe`

### juejin 掘金橙

h1 `color:#1e80ff`；strong `color:#1e80ff`；blockquote `background:#fff7e8;border-left:4px solid #ff7d00`；code `background:#fff7e8;color:#ff7d00`

### techPurple 科技紫

section `background-color:#0f0c29;color:#e8e6f0`；h1/h2 `color:#a78bfa`；blockquote 渐变底 + `border-left:4px solid #a78bfa`；pre 深底

### wood 暖木棕

section `background:#faf6f1;color:#3d2c29`；标题 `#5c4033`；blockquote `#fff8ee` + `#c4a574`

### night 深夜黑

section `#1a1a1a;color:#d4d4d4`；标题 `#ffffff`；h2 左条 `#60a5fa`；blockquote `#242424`

**输出时每个元素都必须带 style**；禁止 `class`、`<style>` 块。完整键值以工具 `js/themes.js` 为准。

---

## 4. 图片规范

| 优先级 | 写法 |
|--------|------|
| 1 | `data:image/jpeg;base64,...`（`![alt](data:)` 或 `<img src="data:" style="...">`） |
| 2 | `https://mmbiz.qpic.cn/...` |
| 3 | `https://PLACEHOLDER.local/...` 占位 + 文末说明需替换 |
| 禁止 | 本地路径、假 base64、假 mmbiz、未说明的公网外链当正式配图 |

- 正式稿 img 默认：`box-shadow:0 4px 16px rgba(0,0,0,0.15);border-radius:8px;max-width:100%;display:block;margin:16px auto`
- 透明 PNG 用 `filter:drop-shadow(...)`，不用 `box-shadow`
- **无图二进制时禁止编造 `data:image/...,AAAA`**

---

## 5. 使用方式（只写给用户）

1. 复制交付的 ```html 代码块  
2. 公众号后台 → 新建文章 → 正文区粘贴  
3. 填标题、作者（松君杂货铺）→ 预览 → 发布  
4. 若有 `data:` 大图粘贴失败：在 `index.html` 转换后用「复制到剪贴板」再试  

外链放文末「参考链接」，重要链接用「阅读原文」。

---

## 6. 生成流程

```text
1. 定标题、主题、作者（默认松君杂货铺）
2. 写结构：H1 → 引导 → H2/H3 → 图/表/代码 → 总结
3. 图：data: 或 PLACEHOLDER；正式图套 img 标准样式
4. 全文套内联 style → 输出 ```html 成品
5. 文末：标题/作者/主题 + 「复制 HTML → 公众号正文粘贴」
```

### 骨架

```html
<section style="<容器>">
  <h1 style="<h1>">标题</h1>
  <blockquote style="<blockquote>">导语</blockquote>
  <h2 style="<h2>">小节</h2>
  <p style="<p>">段落</p>
  <pre style="<pre>"><code>…</code></pre>
  <hr style="border:none;border-top:1px solid #eeeeee;margin:28px 0"/>
  <p style="<p>"><strong style="<strong>">作者</strong>：松君杂货铺</p>
</section>
```

---

## 7. 禁止

- 自动注入 / 半自动发文 / 引导用户跑 Playwright、Console 写编辑器  
- `<script>`、`<style>` 块、外部 CSS、`class`  
- hover、伪元素、复杂 flex、`position:fixed/sticky`  
- 脚注、任务列表、合并单元格  
- 假 base64  

---

## 8. 检查清单

- [ ] 已交付内联 style 的 ```html 成品  
- [ ] 元素均有 style  
- [ ] 图为 `data:` 或已标明 PLACEHOLDER  
- [ ] 标题/作者/主题已写；作者默认松君杂货铺  
- [ ] 操作只写「复制 → 公众号粘贴」  
- [ ] 无注入/半自动步骤  
- [ ] 无 script/class/假 data  

---

## 9. 与 wechat-content

`wechat-content` 为格式细节（图片阴影/圆角大全等）。**默认优先本技能**交付可粘贴成品；细节冲突以本技能为准。
