---
name: wechat-content
description: 生成或改写适合微信公众号发布的 Markdown / HTML 内容时使用。约束格式、外链、图片（优先 base64 内嵌，支持 MD 图片与内联 img 双写法）与内联样式，配合「公众号注入」工具转换/注入。当用户要求写公众号文章、排版、发布图文，或提到「公众号」「微信排版」「MD 转公众号」时触发。
---

# 公众号内容格式规范（wechat-content）

本技能约束 AI 生成的 **Markdown / HTML**，使其能被「公众号注入」工具稳定转换为微信兼容排版。

## 设计目标

- 转换后在公众号编辑器中 **视觉效果不崩**
- 只使用编辑器白名单标签 + 内联样式
- 图片优先 **base64 内嵌**，便于「复制 → 粘贴」进公众号
- 图片四周装饰（边框/圆角/阴影/滤镜等）有统一分档，默认走标准样式套件
- 外链有明确处理策略（正文少放可点击外链）

## Markdown 写作规范

### 允许且推荐的语法

| 语法 | 示例 | 说明 |
|------|------|------|
| 标题 | `#` / `##` / `###` / `####` | 最深到 H4，H5/H6 会降级 |
| 粗体 | `**重要**` | |
| 斜体 | `*强调*` | |
| 删除线 | `~~过时~~` | |
| 行内代码 | `` `code` `` | |
| 代码块 | 三个反引号 + 可选语言 | 支持高亮背景，不支持语法着色库 |
| 引用 | `> 文本` | |
| 列表 | `-` 或 `1.` | 嵌套列表支持有限，最多两层 |
| 表格 | 标准 MD 表格 | 不支持合并单元格 |
| 图片 | `![alt](data:image/...;base64,....)` | **优先内嵌**；需要阴影/圆角时改用内联 HTML `<img>`，见下方图片规则 |
| 内联图片标签 | `<img src="data:..." alt="..." style="..."/>` | 用于边框/圆角/阴影/滤镜等图片四周装饰；见图片样式大全 |
| 链接 | `[文字](url)` | 见下方外链规则 |
| 分割线 | `---` | |

### 不要用 / 避免

- HTML 标签混排（**例外**：图片需要阴影/圆角时，允许仅用内联 `<img>`，见图片样式；其余标签走 HTML 模式）
- 脚注、定义列表、任务列表（`- [ ]`）— 工具会当普通文本
- 表情符号依赖字体差异的排版
- 超过 4 层的标题层级
- 复杂嵌套：引用里再套代码块套列表（能解析，但观感不可控）

### 篇幅建议

- 单篇正文字数建议 **≤ 20000**（公众号上限约 5 万，但长文体验差）
- 段落之间空一行
- 每 3–5 段插一个小标题或引用，避免大段纯文本

## HTML 模式规范

若用户直接提供 HTML：

### 允许标签

`p, div, section, span, h1-h6, strong, b, em, i, s, del, code, pre, blockquote, ul, ol, li, img, a, br, hr, table, thead, tbody, tr, th, td, figure, figcaption, mark, u`

### 会剥离

`script, style, iframe, object, embed, link, meta, form, input, button` 以及未知标签（保留子内容）

### 样式

- 允许元素上的 `style="..."` 内联样式（工具会与主题合并，内联优先）
- **不要** 写 `<style>` 块、外部 CSS、`class` 依赖
- 不要用 `position: fixed/sticky`、复杂 flex 多列、伪元素

## 图片规则（关键：优先内嵌）

公众号 **外链图不能长期稳定使用**。生成内容时，**图片优先做成 base64 内嵌**，这样：

- 预览能直接显示
- 用工具「复制到剪贴板 → 粘贴到公众号」时，内嵌图更容易被编辑器接收/转存
- 降低「粘贴后图裂」的概率

### 优先级（从高到低）

1. **首选：base64 内嵌**（推荐，本技能默认要求）

   标准 Markdown（无样式，最稳）：

   ```markdown
   ![封面头图](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...)
   ```

   HTML 混排（可带阴影/圆角等内联 style，工具同样支持）：

   ```html
   <img src="data:image/jpeg;base64,/9j/4AAQ..." alt="封面头图" style="box-shadow:0 8px 24px rgba(0,0,0,.18);border-radius:12px;display:block;margin:16px auto;max-width:100%"/>
   ```

   两种写法可同一篇混用；转换工具都会识别 `data:` 并保留 img 上的合法内联样式。

2. **次选：已上传的公众号图床**

   ```markdown
   ![架构图](https://mmbiz.qpic.cn/xxxxxxxx/0)
   ```

   粘贴/发布后最稳，但需要先上传素材库。

3. **仅在无图可用时：占位 URL**

   ```markdown
   ![架构示意图：三层调用关系](https://mmbiz.qpic.cn/PLACEHOLDER_ARCHITECTURE)
   ```

   并在文末注明「占位图，发布前请替换为内嵌或素材库地址」。

### 禁止 / 不推荐

- **不要**默认使用 `https://example.com/xxx.jpg` 这类可公开访问的外链当正式配图
- **不要**使用本地相对路径（`./images/a.png`、`/assets/x.jpg`）— 粘到公众号必挂
- **不要**在正式稿里依赖远程图床 CDN（除非你确认会立即转内嵌或素材库）

### base64 使用约束

| 项目 | 建议 |
|------|------|
| 格式 | 优先 `image/jpeg`、`image/png`、`image/gif`、`image/webp` |
| 单图体积 | 尽量 **≤ 1MB**（过大的 base64 可能粘贴失败或拖慢预览） |
| 宽度 | 封面/大图建议 1080px 宽；正文插图 720–1080px |
| alt | 必须有中文 `alt`，便于审查与无障碍 |
| 数量 | 一篇内嵌图不宜过多；长文可拆成多篇或改用素材库 |

### 生成时怎么写（按你的能力选一条，禁止假装）

| 你有没有「本地图片文件 / 已生成的图」 | 必须怎么写 |
|--------------------------------------|------------|
| **有**（image_gen 落盘、用户给了路径） | 读文件 → base64 → `![alt](data:image/jpeg;base64,...)` 完整写进 MD |
| **没有**，只能写文案 | **不要编造 base64，不要编造假 mmbiz 链接**。写占位，并在文末提醒用工具转换 |

无图能力时的占位写法（工具可识别）：

```markdown
![封面：工具界面示意](https://PLACEHOLDER.local/cover.jpg)
```

或在文末清单：

```markdown
> 图片清单（待内嵌）：封面、流程图 — 请在「公众号注入」工具点「外链图转内嵌」
```

**豆包 / 无生图模型注意：** 你没有图片二进制时，输出占位即可；用户侧用工具把可下载外链转成 base64，或手动传素材库。**禁止**输出 `data:image/...,AAAA` 这类假 base64。

- 转换工具会列出所有 `<img src>`：`data:` 视为已内嵌；外链/本地/PLACEHOLDER 会警告

### 外链图 → 内嵌（用户侧，必做）

若 MD 里是可下载的 `https://...jpg/png`：

1. 启动 `启动半自动服务.cmd`（或 `auto_inject.py serve`）
2. 打开 `index.html` → 点 **「外链图转内嵌」**
3. 工具经本机服务下载图片并改写成 `data:` 后，再复制/注入

浏览器直连外链常被 CORS 拦，所以走本机服务，不靠页面 fetch。

### 图片样式（四周处理大全）

Markdown 语法 `![...](...)` **无法携带任何样式**。需要装饰图片时，把 Markdown 图片语法替换为**内联 HTML `<img>`（或必要时 `figure` 包一层）+ 内联 `style`**。

图片「四周」的处理可分六类。公众号编辑器对部分能力支持有限，下表已标注；**默认仍走标准样式套件**，其余按需选用。

#### 类别总览（选型速查）

| 类别 | 代表写法 | 公众号兼容 | 适用场景 |
|------|----------|------------|----------|
| 1 边框 | `border` / 相框白边 | 好 | 分割感、复古相框 |
| 2 圆角 | `border-radius` | 好 | 正式稿默认 |
| 3 阴影 | `box-shadow` | 好 | 层次感（默认） |
| 4 形状裁剪 | `clip-path` | 弱/不稳 | 异形装饰图，慎用 |
| 5 滤镜 | `filter: drop-shadow` 等 | 中（视版本） | 透明 PNG 抠图投影 |
| 6 叠加装饰 | 渐变容器 / 角标 | 部分可用；伪元素 hover 不可用 | 头图接正文、标签 |

#### 0. 标准样式套件（正式稿默认）

正文插图、封面头图统一套用（三个属性一起写）：

| 属性 | 值 | 作用 |
|------|-----|------|
| `box-shadow` | `0 4px 16px rgba(0,0,0,0.15)` | 向下柔和投影，增加层次 |
| `border-radius` | `8px` | 圆角，观感更柔和 |
| `max-width` | `100%` | 手机端自适应，防止溢出 |

```html
<img src="data:image/jpeg;base64,/9j/4AAQ..." alt="封面头图" style="box-shadow: 0 4px 16px rgba(0,0,0,0.15); border-radius: 8px; max-width: 100%;"/>
```

嵌在 Markdown 正文中时，前后各留一个空行：

```markdown
## 背景

正文段落…

<img src="data:image/jpeg;base64,..." alt="三步装好示意图" style="box-shadow: 0 4px 16px rgba(0,0,0,0.15); border-radius: 8px; max-width: 100%;"/>

继续正文…
```

#### 1. 边框类（border）

| 效果 | 代码 | 备注 |
|------|------|------|
| 细实线边框 | `border: 1px solid #ddd` | 与圆角搭配自然 |
| 加粗强调边框 | `border: 2px solid #ccc` | 图表/截图框线 |
| 虚线边框 | `border: 1px dashed #ccc` | 示意/待定状态 |
| 相框白边（老照片） | `padding: 12px; background: #fff; border-radius: 4px` | 需外层容器或直接加在 `img`（padding 在 img 上表现因浏览器而异，优先外层 `span`/`figure`） |

```html
<img src="data:image/jpeg;base64,..." alt="架构图" style="border: 1px solid #ddd; border-radius: 8px; max-width: 100%; box-sizing: border-box;"/>
```

- **不要** `border` + 大 `box-shadow` 同时叠得太重（显脏）
- 相框效果优先用 `figure` 包一层：`<figure style="...padding/background..."><img .../></figure>`（`figure` 在允许标签内）

#### 2. 圆角类（border-radius）

| 效果 | 代码 | 适用 |
|------|------|------|
| 统一圆角（默认） | `border-radius: 8px` | 正式稿 |
| 克制圆角 | `border-radius: 4px` | 密集信息图 |
| 四角分别 | `border-radius: 8px 0 8px 0` | 刻意不对称装饰，慎用 |
| 圆形 | `border-radius: 50%` | 头像/图标；需等宽高 |
| 胶囊/全圆 | `border-radius: 999px` | 横幅裁切感 |

```html
<img src="data:image/png;base64,..." alt="作者头像" style="border-radius: 50%; max-width: 120px; max-height: 120px;"/>
```

- 内容图默认 **不要** `50%`/超大圆角裁切主体
- 圆角与 `box-shadow` 同时用时，阴影会随圆角走（正常）

#### 3. 阴影类（box-shadow）

| 效果 | 代码 | 适用 |
|------|------|------|
| 柔和投影（默认） | `0 4px 16px rgba(0,0,0,0.15)` | 正式稿 |
| 悬浮感（双层） | `0 4px 12px rgba(0,0,0,0.12), 0 12px 28px rgba(0,0,0,0.10)` | 强调大图 |
| 多方向 | `2px 2px 8px rgba(0,0,0,0.2), -2px -2px 8px rgba(0,0,0,0.1)` | 平衡浮起，少用 |
| 内阴影 | `inset 0 0 10px rgba(0,0,0,0.3)` | 凹陷感，仅特殊装饰 |
| 彩色光晕 | `0 0 20px rgba(80,140,255,0.5)` | 科技/活动图，慎用 |

```html
<img src="data:image/jpeg;base64,..." alt="数据看板" style="box-shadow: 0 4px 12px rgba(0,0,0,0.12), 0 12px 28px rgba(0,0,0,0.10); border-radius: 8px; max-width: 100%;"/>
```

- 透明度控制在 `rgba(0,0,0,0.10~0.20)` 为默认审美；彩色光晕仅用户点名或活动稿
- **不要**超过 3 层阴影

#### 4. 形状裁剪类（clip-path）

| 效果 | 代码 | 备注 |
|------|------|------|
| 菱形 | `clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)` | 装饰图 |
| 六边形 | `clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)` | 装饰图 |
| 斜角切 | `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)` | 右下斜切 |

- 公众号编辑器 / 部分 WebView **对 `clip-path` 支持不稳**，异形裁剪属高风险项
- 默认**不要**用；仅用户明确要求异形装饰，且接受预览验证后再粘贴
- 与 `box-shadow` 同用时阴影可能不随裁剪形状走，优先无阴影或改用 `drop-shadow`

#### 5. 滤镜类（filter）

| 效果 | 代码 | 适用 |
|------|------|------|
| 跟随实际形状投影 | `filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2))` | **透明底 PNG 抠图**（`box-shadow` 会出方影子） |
| 复古/去色 | `filter: grayscale(100%)` | 首尾氛围图 |
| 轻微提亮 | `filter: brightness(1.05)` | 暗图微调 |
| 柔焦 | `filter: blur(0px)` 仅作占位；真模糊慎用 | 文章几乎用不到 |

```html
<img src="data:image/png;base64,..." alt="透明底图标" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); max-width: 160px;"/>
```

- **透明 PNG 必须用 `drop-shadow`，不要用 `box-shadow`**
- `drop-shadow` 与 `box-shadow` 不要同时重叠
- `blur` / 强烈滤镜会导致正文图不可读，默认禁用

#### 6. 叠加装饰类

| 效果 | 做法 | 公众号是否可用 |
|------|------|----------------|
| 底部渐变过渡（头图→正文） | 外层 `figure`/`div` + `background: linear-gradient(rgba(255,255,255,0) 0%, #fff 100%)`，图片在上并透明底部 | 基本可用（内联背景渐变） |
| 顶部/侧边遮罩过渡 | 同上，改渐变方向 | 基本可用 |
| 角标（「原创」「精选」） | **不用伪元素**；用内联 `<span>` 绝对定位 + 小字号，或更稳妥：把角标**烧进图片**或放在图旁文字 | 半可用（绝对定位偶发异常） |
| 悬停变色/放大 | CSS `:hover` | **公众号移动端无 hover，禁止使用** |
| 多图并排卡片 | `figure` + 内联 `display` / 简单 `table` 布局 | 表格布局更稳；复杂 flex 不用 |

```html
<figure style="margin: 0; position: relative; max-width: 100%;">
  <img src="data:image/jpeg;base64,..." alt="头图" style="display: block; width: 100%; border-radius: 8px 8px 0 0; max-width: 100%;"/>
  <div style="height: 48px; background: linear-gradient(rgba(255,255,255,0), #ffffff);"></div>
</figure>
```

- 伪元素 `::before` / `::after` **本技能禁止**（公众号会剥）
- hover 效果只在「本地网页预览」有意义，正式稿不要依赖

#### 使用决策

| 场景 | 推荐 |
|------|------|
| 只要「有图就行」 | 纯 Markdown `![alt](data:...)` |
| 正式发布稿默认 | 标准样式套件（圆角+柔和阴影+自适应） |
| 透明 PNG / logo 抠图 | 标准套件但阴影改 `filter: drop-shadow(...)` |
| 头图接正文 | 外层渐变容器（第 6 类），图本身可只留顶部圆角 |
| 复古相框 | `figure` 白底 padding，弱化 box-shadow |
| 用户点名去阴影 | 仅 `max-width: 100%`，或退回纯 MD |
| 多图同一风格 | 每张图 **完全相同** 的 style 字符串，禁止逐图微调 |
| clip-path / hover / 伪元素 | 默认禁用；用户强需求时先本地预览并告知风险 |

#### 查看器兼容性（必须告知用户）

- **支持内嵌 HTML 的查看器**：Typora、GitHub、VS Code 预览、Obsidian → 边框/圆角/阴影正常；`clip-path`、`filter` 因引擎而异
- **纯文本查看器**：直接显示原始 HTML → 若只需纯 MD 交换，改回 `![...](...)`
- **公众号注入工具**：`img`/`figure`/`span`/`div` 在允许标签内，内联 `style` 会合并保留；粘贴后请在公众号编辑器里再确认阴影/滤镜效果

#### 边界约束

- **只用内联 `style`**，禁止 `<style>` 块、`class`、外部 CSS
- 默认审美：低透明灰阴影、圆角 4/8px、克制边框；彩色光晕/内阴影/异形裁剪非默认
- 替换语法时**保留原有 base64 数据与中文 alt**，只改外壳标签
- 禁止：hover、伪元素、复杂 flex 多列、`position: sticky/fixed`
- `clip-path`、强 `filter` 属于风险项：默认不用，用了要提示验证

## 外链规则

- 正文超链接在公众号中 **经常被拦截**（尤其非认证账号）
- 规范写法：正文只留文字，把 URL 放到文末「参考链接」列表，并提示用户设置「阅读原文」
- 若必须保留 `<a>`，链接文字要能独立理解（不要「点这里」）

## 推荐文章结构模板

```markdown
# 文章标题

> 一句话导语或核心结论

<img src="data:image/jpeg;base64,...." alt="封面头图" style="box-shadow: 0 4px 16px rgba(0,0,0,0.15); border-radius: 8px; max-width: 100%;"/>

## 背景 / 问题

正文段落…

## 方案 / 正文

### 小节

- 要点
- 要点

<img src="data:image/jpeg;base64,...." alt="正文插图" style="box-shadow: 0 4px 16px rgba(0,0,0,0.15); border-radius: 8px; max-width: 100%;"/>

```代码
示例
```

| 对比项 | A | B |
|--------|---|---|
| … | … | … |

## 总结

结论段落。

---

**参考链接**

1. 名称说明（URL 备用，建议放阅读原文）
```

## 与「公众号注入」工具的配合

项目路径：`D:\桌面\豆包\公众号注入\`（清理后只保留：`index.html`、`css/`、`js/`、`scripts/`、`examples/`、`skill/`、`tests/`、启动 cmd）

### 工具界面要点

| 控件 | 作用 |
|------|------|
| Markdown / HTML 模式 | 与源文件格式一致 |
| 主题 | `minimal` `zhihu` `juejin` `techPurple` `wood` `night` |
| **转换** | 按当前主题重新转换左侧源内容 |
| **外链图转内嵌** | 经本机 `serve` 把可下载 `https` 图改成 `data:`（需先启动服务） |
| **复制到剪贴板** | 富文本复制；失败时自动 execCommand 兜底 |
| 标题 / 作者 | 半自动与 Console 注入会填入编辑器；作者默认 **松君杂货铺** |
| 生成注入代码 | 在**文章编辑页** Console 粘贴，填标题/作者/正文 |
| 半自动注入 | POST 到 `http://127.0.0.1:8765/inject`，自动打开文章编辑页并写入 |

### 推荐用户流程

1. 浏览器打开 `index.html`  
2. 粘贴/上传本技能规范下的 MD（图片应为 `data:` 或可下载外链）  
3. 外链图 → 先点「外链图转内嵌」（需 `启动半自动服务.cmd`）  
4. 填标题（可空则自动取首级标题）、作者（默认松君杂货铺）  
5. 转换预览 → 复制到剪贴板，或半自动/Console 注入  
6. 公众号编辑页人工预览 → 保存草稿 / 发表  

### 半自动依赖

```bat
启动半自动服务.cmd   :: http://127.0.0.1:8765
首次登录.cmd         :: 仅首次保存 .browser-profile
```

命令行：`python scripts\auto_inject.py login|detect|serve|inject`

## 质量检查清单

生成 MD/HTML 后自检：

- [ ] 标题层级不超过 H4
- [ ] 无 `<script>` / `<style>` / 外部 CSS
- [ ] **图片使用 `data:image/...;base64,` 内嵌**（或已确认的 `mmbiz.qpic.cn`）
- [ ] **无本地相对路径图片**
- [ ] **不默认用公网外链图当正式配图**；只有外链时文末注明「外链图转内嵌」
- [ ] **未编造假 base64 / 假 mmbiz**（无图能力时用 PLACEHOLDER 占位）
- [ ] 单图 base64 尽量 ≤ 1MB，有中文 alt
- [ ] **正式稿配图已用内联 `<img>` + 标准样式套件**（阴影 `0 4px 16px rgba(0,0,0,0.15)` / 圆角 `8px` / `max-width: 100%`）
- [ ] 透明 PNG 的投影用的是 `drop-shadow` 而非 `box-shadow`
- [ ] 图片 `style` 仅内联在标签上；`![alt](data:)` 与 `<img style>` 可混用
- [ ] 未使用 hover、伪元素、复杂 flex；`clip-path` / 强滤镜仅在用户强需求且已提示验证
- [ ] 外链不要依赖可点击
- [ ] 代码块语言标签已写
- [ ] 表格无合并单元格
- [ ] 段落之间有空行
- [ ] 无任务列表 / 脚注等不支持语法
- [ ] 若给出示例文件，路径放在 `examples/`，不要依赖已删除的 `build/` 产物

