---
name: viewera-web
description: Maintain the standalone ViewEra and ICCH bilingual static website, seven routes, product concepts, responsive layout and local previews.
---

# ViewEra / ICCH 官网

先读根 AGENTS.md；UI 工作先读 `../apple-design/SKILL.md`。在根 `dist/` 编辑，保留首页设计语言。`content.js` 为共享双语文案，`app.js` 为路由，`home*` 为云端与移动演示，`studio.js` 与 `studio.css` 为 PLC Studio 概念工作空间。

保持 `/`、`/platform`、`/products`、`/technology`、`/vision`、`/about`、`/contact`。公共外壳修改后执行 `node sync-shells.cjs`。维护 title、description、Open Graph、lang、导航和 sitemap。

产品定义遵循用户最新决定。三款产品可按客户和产线定制；模拟模块集中说明概念性质，不转写为商用能力承诺。不改动 Sites 身份，不新增真实 PLC 连接。

运行 `node check.cjs`，用 `node preview.cjs` 查看实际双语页面、交互和移动布局。按用户授权使用 Sites Skill 发布。
