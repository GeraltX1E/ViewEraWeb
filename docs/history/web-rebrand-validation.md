# ViewEra / ICCH 官网升级验证记录

日期：2026-10-17。范围：展示站、品牌章程、UI/UX 开发规范与第三方 skill 集成。桌面 C++/QML 功能源码未在本次重设计中修改。

## 基线与开发分支

- GitHub：https://github.com/GeraltX1E/PLCcontroller
- 升级前基线：`892684c2128abdfc65ff35cedfda34cd7fa869ba`，推送至 `main`，`ls-remote` 核对相符。
- 从该提交创建 `feat/newWeb`；本次后续修改均在该分支，未合并到 main。
- 网站源码按普通文件纳入主仓库。既有嵌套 Git 元数据完整保留于本机忽略目录，部署包、缓存、运行数据与 PLCsrc 继续忽略。
- 未改变原站 project_id、origin 或访问范围；线上实际发布结果以 Sites 工具返回为准。

## 网站验证

1. `node --check`：app.js、content.js、config.js 及本地辅助脚本语法检查。
2. `node sync-shells.cjs`：同步五个直接入口，保留每页 SEO 标题与 canonical。
3. `node check.cjs`：24 个路由 × 语言 × motion 组合通过。验证页面渲染、内部链接、品牌、语言偏好、空邮箱/配置邮箱、404、模拟选缸与趋势内容、暂停和后台计时器停止、reduced-motion 手动推进以及固定 Sites 身份。
4. 本地 HTTP 首页实际返回 200。
5. 真实浏览器检查 390×844、834×1112、1280×800 三种视口；中英文六个路由共 36 个入口均有正确主标题，无横向溢出，语言偏好跨页面保持。
6. 额外检查 320px 首页，发现并修正图示网格最小宽度导致的溢出，复查无横向溢出。
7. 交互实查：选中第 08 缸并更新上下文，切换趋势视图，暂停模拟，手机菜单开合和跳转，云端/边缘职责切换。
8. Products 预览弹窗打开后聚焦关闭按钮；Escape 关闭并返回触发按钮。
9. 查看首页、HMI 趋势、Platform、Products 与手机中文页面截图；浏览器 error/warn 日志为空。

不使用 TypeScript、npm 构建或独立 lint 配置，静态源文件即可部署。没有为本次任务引入这些工具链。

## 动效边界

自动数据为合成数据，不连接真实云端或 PLC。动效偏好通过 VM 的两种 matchMedia 状态验证，并检查 CSS 降级规则；未声称切换操作系统设置进行浏览器媒体仿真。屏幕阅读器、真实手机硬件与中国大陆公网访问未实测。

## Skill

项目安装 apple-design，原文与指定提交匹配，保留 MIT License、上游 README 和官方 CLI 安装锁定文件。根 AGENTS.md 只为 UI/UX 任务引入该参考；网页/桌面 skill 补充相应触发规则。Qt 动效仍用 Qt 原生实现。

## 现有桌面工程验证

本次执行根 `build.ps1`，Qt Release 配置、构建、本地运行文件部署成功，4 项 CTest（core_behaviors、presentation_behaviors、software_update_behaviors、qt_ui_smoke）全部通过。未制作安装器。工具输出提示可选 Vulkan 头文件及 D3D12 shader DLL 未发现；构建与测试未因此失败，本次未验证这些可选图形功能。

Skill 官方 quick_validate.py 因环境缺少 PyYAML 未能运行；已改为检查三个相关 SKILL.md 的 frontmatter、目录/名称一致性、description 长度和指南本地链接。第三方原文另与锁定上游提交核对相同。
