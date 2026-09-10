# wechat-publish-skill

微信公众号发布：**Skill 规范 + 本地 MD/HTML 转公众号工具**。

## 目录

| 路径 | 说明 |
|------|------|
| [skills/wechat-publish](skills/wechat-publish/SKILL.md) | 一站式 Skill：AI 直接产出可粘贴内联 HTML |
| [skills/wechat-content](skills/wechat-content/SKILL.md) | 格式细则（图片样式大全等） |
| [tool/index.html](tool/index.html) | **转换工具**：浏览器直接打开即可用 |
| [tool/js/](tool/js/) | Markdown 解析、主题、转换、剪贴板 |
| [tool/examples/](tool/examples/) | 示例 MD/HTML |

## 工具用法（MD 自动转公众号排版）

1. 下载或克隆本仓库  
2. 用浏览器打开 `tool/index.html`（无需服务器）  
3. 粘贴或上传 `.md` / `.html`  
4. 选主题 → **转换** → 预览  
5. **复制到剪贴板** → 公众号新建文章正文 `Ctrl+V`  

按钮：转换 | 外链图转内嵌（需本地服务，可选）| 复制到剪贴板 | 标题/作者 | 下载 HTML  

主题：`minimal` `zhihu` `juejin` `techPurple` `wood` `night`

## Skill 安装

```
~/.claude/skills/wechat-publish/SKILL.md
```

可选：`skills/wechat-content` 作细节补充。

## 说明

- 图片优先 `data:image/...;base64` 内嵌，粘贴不易裂  
- 作者默认可写「松君杂货铺」  
- 本仓库**不含**自动注入/半自动发文代码  
- License: MIT
