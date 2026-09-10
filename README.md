# wechat-publish-skill

微信公众号发布 Skill：**AI 调用内置 CLI** 把 Markdown/HTML 转成可粘贴进公众号的内联样式 HTML。

## 结构（Skill 与工具分离）

```
skills/wechat-publish/     # 主 Skill（含 CLI + 主题库副本）
  SKILL.md
  scripts/convert.js       # node convert.js in.md -t zhihu -o out.html
  scripts/lib/             # markdown / themes / converter
  references/image-style.md
skills/wechat-content/     # 可选：图片样式细则
tool/                      # 可选：本地网页预览器（非 Skill 本体）
```

**Skill 本体不依赖前端页面**；`tool/` 仅作本机预览，可删。

## 安装 Skill

复制 `skills/wechat-publish` 到：

```
~/.claude/skills/wechat-publish/
```

依赖：本机有 `node`。

## CLI

```bash
node ~/.claude/skills/wechat-publish/scripts/convert.js article.md \
  -t zhihu -o article.wechat.html --author "松君杂货铺"
```

主题：`minimal` `zhihu` `juejin` `techPurple` `wood` `night`

## 使用流程（给 AI）

1. 按需求写 Markdown  
2. 运行上方 CLI  
3. 把输出 HTML 交给用户 → 复制 → 公众号正文粘贴  

## License

MIT
