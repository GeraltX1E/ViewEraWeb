---
name: viewera-delivery
description: Validate and deliver ViewEraWeb changes with static checks, browser previews and verified Git and Sites publication.
---

# 官网交付

先核对 Git diff 与用户修改。源文件在 `dist/`，无额外编译。执行 `node check.cjs`；公共 HTML 改动执行 `node sync-shells.cjs`。界面改动需真实浏览器检查双语、八个路由、桌面/窄屏、焦点和模拟行为。

确认离线数据不可用、联锁/断线阻止请求、暂停/后台/离屏/reduced-motion 停止自动演示。可手动推进，不允许任何真实控制或持久化命令。

提交和发布前核对范围；不输出 token。用户授权 Git 推送或合并后验证远端分支 SHA。Sites 发布按 Sites Skill 使用现有身份、域名和访问范围。

交付修改内容、实际测试结果、预览和 Git 提交。未执行的检查或未实现的产品功能不得写成已验证。
