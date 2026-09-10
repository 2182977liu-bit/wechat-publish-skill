# 图片样式（可选参考）

正式稿默认 `img` 内联套件：

```text
box-shadow:0 4px 16px rgba(0,0,0,0.15;border-radius:8px;max-width:100%;display:block;margin:16px auto
```

（注意：完整为 `box-shadow:0 4px 16px rgba(0,0,0,0.15);...`）

## 优先级

1. `data:image/...;base64,...`  
2. `https://mmbiz.qpic.cn/...`  
3. `https://PLACEHOLDER.local/...`（需用户替换）  

禁止：本地路径、假 base64。

## 写法

- 无样式：`![中文alt](data:image/jpeg;base64,...)`  
- 有阴影/圆角：`<img src="data:..." alt="中文" style="..."/>`  
- 透明 PNG 投影：`filter:drop-shadow(...)`，勿用 `box-shadow`  

完整分类（边框/圆角/阴影/滤镜）可读仓库 skills/wechat-content/SKILL.md。
