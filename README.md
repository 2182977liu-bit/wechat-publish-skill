# wechat-publish-skill

微信公众号发布相关 Skill：生成**可直接粘贴进公众号**的内联样式 HTML。

## 包含

| 目录 | 说明 |
|------|------|
| [skills/wechat-publish](skills/wechat-publish/SKILL.md) | 一站式：交付内联 HTML 成品 + 主题样式 + 图片规范（默认优先） |
| [skills/wechat-content](skills/wechat-content/SKILL.md) | 格式细则（图片四周阴影/圆角/滤镜等） |

## 安装（Claude Code / 支持 SKILL.md 的客户端）

把 `skills/wechat-publish`（可选再加 `skills/wechat-content`）复制到：

```
~/.claude/skills/wechat-publish/SKILL.md
```

或在本机 MiMo Desktop 的技能目录下放置同名文件夹。

## 产出约定（wechat-publish）

- 正文为**已内联 style** 的 HTML 片段
- 图片优先 `data:image/...;base64,...`
- 作者默认「松君杂货铺」（可在生成时改）
- 不包含自动注入/半自动发文流程；用户复制 HTML 后在公众号后台粘贴

## 主题

minimal / zhihu / juejin / techPurple / wood / night — 详见 SKILL.md 内样式速查。

## License

MIT
