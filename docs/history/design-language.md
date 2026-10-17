# ViewEra Design Language 与 Apple Skill 集成

记录日期：2026-10-17。网站与 Qt/QML UI 任务共用设计原则，各端实现与工业控制权限保持独立。

## 第三方来源

- 仓库：https://github.com/emilkowalski/skills/tree/apple-skill
- 分支：`apple-skill`；核对提交：`a94a079bcb3e8052ada9d75039d242d11e441873`。
- 实际 Skill：`skills/apple-design/SKILL.md`。
- 作者 README 推荐 `npx skills@latest add emilkowalski/skills`。本次用同一官方 skills CLI 1.7.2，限定 URL 分支、`--skill apple-design --agent codex --yes`，项目安装到 `.agents/skills/apple-design/`。未全局安装其他 skills。
- 默认 PATH 的 Node 16 不符合 CLI 要求；使用现有 Node 24 运行 CLI 完成安装，未改变系统 Node 安装。
- 原文保持不变；附 `LICENSE`、`UPSTREAM-README.md`，安装锁定信息在根 `skills-lock.json`。MIT 版权声明按上游保留，不改写归属。
- 当前任务已直接读取并应用 Skill；未来 UI 任务由根 AGENTS.md 引用，后续回合可发现项目 skill。未假定当前会话技能列表动态刷新。

## 独立设计语言

ViewEra 是整体科技品牌；ICCH 是核心工业云控中枢；PLC Studio 是其当前桌面工业 HMI 实现。中枢完整名称 Industrial Cloud Control Hub / 工业云控中枢，口号 Control Beyond Boundaries. / 让工业控制，突破边界。

以系统字体、充足空间、精确的层级、石墨黑与矿物蓝构建品牌。保留既有蓝色识别方向，将原 PLC 专属图标转为 ViewEra 的开放视域符号。内容先讲产品与使用体验，技术基础进入 Technology 页面。

动效是产品解释：首页界面揭示、HMI 选缸与曲线视图、云边设备的职责切换。普通反馈约 120–220ms，展示入场约 600–800ms，使用无回弹的平稳曲线。用户可随时切换，不等待动画结束。不添加无需求的拖拽或弹簧库。

HMI 演示只有模拟状态、选择和查看，无真实控制命令。概念说明集中在展示区域。后台、离屏、暂停或 reduced-motion 时停止自动数据推进。用户仍可手动选缸和切换视图。无字体/脚本 CDN，无追踪服务。

## 仓库与部署

GitHub 主仓库保管完整源码，官网不再使用嵌套 Git 仓库。迁移前的网站 Git 元数据完整保存在本机忽略目录 `.tools/site-source-git-before-viewera-20261017`。Sites 源码同步在独立忽略目录 `.tools/viewera-site-hosting` 操作，不改变根开发分支。

网站保留原 project_id、origin 与六个直接路由。Sites 当前公开访问属性来自本次 get_site 实查；发布保留访问范围，不自动切换权限。其他部署目标仍可直接上传 `dist/`。
