# PLC Detector 官网集成 · Phase 1 本地审阅

## 范围

Products 保留原有三款产品，新增 PLC Detector 展示区与 `/products/plc-detector` 详情。页面与图片说明完整提供中英文。当前分支 `codex/plc-detector-preview`；未经用户确认不推送、不部署、不创建公开 Release。原首页、PLC Studio 演示及发布工作流未修改。

## 当前能力与截图依据

独立项目 PLC-Detector 当前代码版本 0.2.0。检查了 CMakeLists、engine、network_discovery、detector、main、测试和打包脚本。能力范围是有限物理有线 IPv4 发现、FINS/TCP 与 FINS/UDP 响应识别、分层连接/状态验证、现场确认的 DM UInt16 测试字读写回读与通信记录。写入须另行确认和授权。未添加其他协议或未确认的功能承诺，Linux 仅 Coming Soon。

三张图片由当前部署目录运行 `--self-test` 新生成，覆盖发现入口、未连接设备时禁用的通信验证以及高级配置。没有扫描现场或伪造成功设备；英文页面注明当前软件 UI 为中文。

## Windows 审阅包

- `PLCDetector-0.2.0-Cpp-Setup-x64.exe`，版本 0.2.0。
- 32331838 bytes，约 32.3 MB。
- SHA-256：`fa950dde743c962d0505e2921b1b1058ae8c3f1450f334a80aaec065e22a1483`。
- 安装器目标 Windows 10 或更高版本、x64；随附 Qt 6.12 / MinGW 运行库和插件，无需 Qt SDK。
- 未签名；当前 Windows 上独立启动检查通过，其他机器/系统、实际安装/卸载与真实 PLC 均未验收。
- 只修正 NSIS 安装说明中的旧 Mock 内容和运行库说明后重新打包，核心通信与软件 UI 未修改。原始包备份保存在 Detector 的忽略目录 artifacts/package-history/。

## 仅本地下载

包置于 Git 忽略的 `artifacts/downloads/`，不进入 dist。`.tools/detector-download.json` 内容为：

```json
{"file":"artifacts/downloads/PLCDetector-0.2.0-Cpp-Setup-x64.exe"}
```

`node preview.cjs` 仅监听 127.0.0.1，启动时校验目录、文件名、大小和 SHA-256。页面通过本机注入配置启用对应附件下载；版本、哈希或文件名不匹配时不显示有效下载按钮。GET/HEAD 提供附件名与 Content-Length。完整下载后核对文件哈希。

正式 productionUrl 为 null、publicationApproved 为 false。没有配置不存在的公开地址；普通静态部署下 Windows 下载禁用。Linux 只有状态和禁用按钮。

## 验证

- 网站 32 组路由/语言/动效检查、10 项首页模型及生命周期检查、10 项 PLC Studio 检查通过。
- Detector 检查覆盖双语、PNG 资源、发布关闭、本地与静态状态、过期配置拒绝、Linux 禁用、dist 不包含安装包。
- Detector 现有构建目录 CTest 3/3 通过（行为回环、UI、仓库隔离）。部署目录仅系统 PATH 的 UI 自检退出 0，报告无错误，无实机访问。
- 网站为静态源码，无额外编译；安装器通过现有 NSIS 脚本本地重新生成。
- 浏览器检查中文 Products/Detector 在 1280、834、390、320 宽度，英文在 1280、390、320 宽度，无页面横向溢出；移动导航、详情入口和图片展开可用。

## 下一阶段须经用户确认

确认页面、截图与当前未签名安装包是否可公开后，再核对 PLC-Detector 仓库访问范围、已有版本/标签及 Release 资产。随后发布对应版本包、验证公开下载地址，再启用正式 URL 并发布官网。不覆盖既有正式资产。Phase 1 不执行上述操作。


## 官网发布授权 · 2026-10-19

用户已确认将当前官网版本推送至 ViewEraWeb 并发布到线上。发布目标为 origin/main，沿用 GitHub Pages 工作流和 viewera.site，不改变 Sites 身份或仓库可见性。

本次包含 Detector 真实截图与详情页、架构图中的 Detector 节点、四产品导航子菜单，以及用户指定的两处文案删除。此前被撤销的大型产品卡片和架构重设计不包含在发布版本中。

Windows 安装包公开下载单独确认；在确认之前，release metadata 保持 publicationApproved=false、productionUrl=null，线上明确显示等待确认，不使用本地预览地址。
