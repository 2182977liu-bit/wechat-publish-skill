# wechat-publish-skill

> 把 Markdown / HTML 转成 **微信公众号可直接粘贴** 的内联样式排版。  
> Skill 内置 CLI，AI 按需求调用即可产出成品，无需手写整页 style。

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![Skill](https://img.shields.io/badge/type-A%20Skill%20%2B%20CLI-blue)

---

## 这是什么

很多公众号排版工具要么绑网页、要么让 AI 手写一堆内联样式。本仓库把两者拆开：

| 层 | 职责 |
|----|------|
| **Skill** | 告诉 AI 何时用、怎么写 MD、怎么跑 CLI |
| **CLI** | 确定性转换：MD/HTML → 公众号兼容 HTML（内联 style） |
| **tool/** | 可选的本机网页预览（复制粘贴用），**不是** Skill 本体 |

```text
需求/提纲
   ↓  写 Markdown
article.md
   ↓  node scripts/convert.js
article.wechat.html   ← 复制 → 公众号正文粘贴
```

---

## 功能一览

- 六套主题：极简白 / 知乎蓝 / 掘金橙 / 科技紫 / 暖木棕 / 深夜黑  
- 支持标题、加粗斜体、引用、列表、表格、代码块、分割线  
- 图片：`![alt](data:...)` 与 `<img src="data:" style="...">` 均可  
- 自动套用公众号白名单标签 + **元素级内联样式**  
- 可附加作者行（默认建议「松君杂货铺」，可改）  
- **不包含**自动发文 / 注入后台（保持干净、可审计）

---

## 仓库结构

```text
wechat-publish-skill/
├── README.md
├── LICENSE
├── skills/
│   ├── wechat-publish/          ← 主 Skill（推荐安装这个）
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   │   ├── convert.js       ← CLI 入口
│   │   │   └── lib/             ← markdown / themes / converter
│   │   └── references/
│   │       └── image-style.md
│   └── wechat-content/          ← 可选：图片四周样式细则
└── tool/                        ← 可选：本机网页预览器
    ├── index.html
    ├── css/
    ├── js/
    └── examples/
```

---

## 快速开始

### 1. 安装 Skill

把主技能目录复制到客户端技能根目录：

```bash
# Claude Code 等（示例）
cp -r skills/wechat-publish ~/.claude/skills/wechat-publish
```

Windows 示例：

```powershell
Copy-Item -Recurse skills\wechat-publish "$env:USERPROFILE\.claude\skills\wechat-publish"
```

依赖：本机已安装 **Node.js ≥ 16**。

### 2. 写一篇 Markdown

```markdown
# 如何把本地文章发到公众号

> 一句话导语。

## 小节

正文支持 **加粗**、`行内代码`、列表和表格。

![封面](data:image/jpeg;base64,/9j/4AAQ...)
```

### 3. 转换

```bash
node skills/wechat-publish/scripts/convert.js article.md \
  -t zhihu \
  -o article.wechat.html \
  --author "松君杂货铺"
```

### 4. 粘贴发布

1. 打开 `article.wechat.html`，复制其中 HTML  
2. 公众号后台 → 新建文章 → 正文区粘贴  
3. 填标题、作者 → 预览 → 发布  

---

## CLI 参考

```text
node scripts/convert.js <input.md> [options]
```

| 参数 | 说明 |
|------|------|
| `-t, --theme <id>` | 主题，见下表 |
| `-o, --out <file>` | 输出文件；省略则打印到 stdout |
| `--html` | 源文件按 HTML 处理（非 Markdown） |
| `--title <text>` | 源无 H1 时前置标题 |
| `--author <text>` | 文末追加作者行 |
| `--wrap` | 包一层本地预览页 |
| `-h, --help` | 帮助 |

### 主题

| id | 风格 | 适用 |
|----|------|------|
| `minimal` | 极简白（默认） | 通用长文 |
| `zhihu` | 知识蓝 | 干货 / 科普 |
| `juejin` | 技术橙蓝 | 工程笔记 |
| `techPurple` | 深色紫 | 产品 / 发布稿 |
| `wood` | 暖木棕 | 品牌 / 生活 |
| `night` | 深夜黑 | 夜间阅读 |

### 示例

```bash
# 默认主题，只输出到终端
node skills/wechat-publish/scripts/convert.js draft.md

# 知乎风 + 作者
node skills/wechat-publish/scripts/convert.js draft.md -t zhihu \
  -o out.html --author "松君杂货铺"

# HTML 源
node skills/wechat-publish/scripts/convert.js page.html --html -t night -o out.html
```

成功时 stderr 类似：

```text
Wrote D:\...\out.html (1308 chars, 0 data: imgs)
```

若出现：

```text
WARN non-embedded image: https://...
```

说明仍有外链图，请改成 `data:image/...;base64,...` 或公众号素材库地址后再发。

---

## Skill 行为（给 AI / Agent）

触发后应：

1. 按用户需求写好 Markdown（图片优先 base64）  
2. **调用** `scripts/convert.js` 生成 HTML  
3. 交付：```html 成品 + 「复制 → 公众号粘贴」说明  

明确不做：

- 自动登录 / 注入 / 发布公众号后台  
- 手写整篇无脚本的巨型内联 HTML（应走 CLI）  
- 编造假 base64  

作者默认：**松君杂货铺**（用户未指定时）。

---

## 可选：本机网页预览

若希望图形界面预览：

1. 浏览器打开 `tool/index.html`  
2. 粘贴 MD → 选主题 → 转换 → 复制到剪贴板  

`tool/` 与 Skill 解耦，可整目录删除而不影响 CLI。

---

## 图片规范（摘要）

| 优先级 | 写法 |
|--------|------|
| 1 | `data:image/jpeg;base64,...`（粘贴最稳） |
| 2 | `https://mmbiz.qpic.cn/...` |
| 3 | `https://PLACEHOLDER.local/...`（占位，发布前替换） |
| 禁止 | 本地路径、假 base64、未说明的公网外链正式图 |

正式稿默认图片样式：

```html
<img src="data:image/jpeg;base64,..." alt="中文说明"
     style="box-shadow:0 4px 16px rgba(0,0,0,0.15);border-radius:8px;max-width:100%;display:block;margin:16px auto"/>
```

更多：见 `skills/wechat-content/SKILL.md`。

---

## 故障排查

| 现象 | 处理 |
|------|------|
| `node` 不是内部或外部命令 | 安装 Node 或使用完整路径 |
| `Unknown theme` | 使用上表合法 id |
| 样式被公众号「洗掉」 | 确认复制的是转换后的 HTML，不是 Markdown 原文 |
| 粘贴后图裂 | 改用 base64 内嵌；超大图可先压缩 |
| Skill 未触发 | 确认目录名与 frontmatter `name` 均为 `wechat-publish` |

---

## 贡献

欢迎 PR：主题、CLI 参数、解析边界、文档。请保持：

- 转换逻辑确定性（可测）  
- Skill 指令简短可执行  
- 不引入账号密码 / 自动发文  

---

## License

[MIT](LICENSE) © 2182977liu-bit
