# ViewEraWeb

ViewEra / ICCH 双语产品官网的独立源码仓库。后续官网开发在此仓库进行；来源为 `GeraltX1E/PLCcontroller` 的 `sites/plc-studio/`。

## 本地运行

```sh
node check.cjs
node preview.cjs
```

打开 http://127.0.0.1:4173 。无安装依赖或编译步骤。也可使用 `python -m http.server 4173 --directory dist`。

## 文件

- `dist/` 是可直接部署的静态源码，不能作为临时构建目录删除。
- `content.js` / `app.js` 管理双语内容、七个路由及共享交互；`config.js` 配置品牌、邮箱与 origin。
- `home-*.js` / `home.js` / `home.css` 实现首页及复用的云端、移动端概念界面。
- `studio.js` / `studio.css` 实现七模块 PLC Studio 概念工作空间。
- `check.cjs`、`home-check.cjs`、`studio-check.cjs` 检查路由、语言、模拟数据与请求边界。
- `sync-shells.cjs` 同步六个子路由直接入口；修改 `dist/index.html` 后执行。
- `.openai/hosting.json` 保留现有 Sites 身份，静态输出目录为 `dist`。
- `AGENTS.md` 与 `.agents/skills/` 提供本仓库独立适用的开发规则；Apple Skill 保留上游原文与版权。

## 内容与边界

ViewEra 是品牌，ICCH 是工业云控中枢。产品为现场工业电脑上的 PLC Studio，以及远程访问现场的 ICCH Hub Desktop / Mobile。功能、界面和设备集成可按客户需求与产线设计定制。演示使用本地模拟数据，不连接或控制工业设备；官网里的假设模块不代表已交付桌面能力。

路由：`/`、`/platform`（Hub）、`/products`、`/technology`、`/vision`、`/about`、`/contact`。

## 部署与迁移

当前站点：https://plc-studio-icch.leafyfrog36.chatgpt.site 。保持既有 Sites project_id、域名和访问范围。Sites 的托管源仓库与 GitHub 分开同步；修改后按 Sites Skill 打包及发布。

`docs/history/` 保留拆分前的设计与验证记录，其中的旧目录、数量和测试结论属于当时快照。当前命令与范围以本 README、AGENTS.md 和代码为准。

PLCcontroller 仍保留迁移快照。它的 `src/application/softwareUpdateAgent/web/` 是桌面局域网更新模块的操作页，不属于本官网，因此未迁入本仓库。
