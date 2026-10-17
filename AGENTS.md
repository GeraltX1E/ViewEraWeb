# ViewEraWeb 开发指南

这是独立官网仓库。中文沟通，先检查 Git 状态，保留用户已有修改。

## 产品与内容

- ViewEra → ICCH（Industrial Cloud Control Hub / 工业云控中枢）。产品仅为 PLC Studio、ICCH Hub Desktop、ICCH Hub Mobile。
- PLC Studio 位于工厂产线工业电脑，连接和操作对应 PLC 系统；Desktop / Mobile 通过互联网访问工业现场。
- 功能、界面、集成可按客户需求和产线设计定制；具体范围按项目确认。
- 演示为假设模块和模拟数据，不代表真实设备反馈或当前桌面软件已实现全部功能。离线、未知、联锁不得显示为正常。
- 不虚构客户、性能、认证、公司、学校或人员。About Us 团队背景已由用户确认可公开，后续不自行扩展。

## 工作方式

- UI 工作先读 `.agents/skills/apple-design/SKILL.md`，再读 `viewera-web`；交付读 `viewera-delivery`。
- 以现有首页为设计标准，复用矿物绿、浅色材质、系统字体、留白与轻量展示动效，不擅自重做品牌。
- `dist/` 为源文件，禁止作为缓存清理；保持七个直接路由及完整中英文对应。
- 优先 transform/opacity，立即反馈，后台、离屏、暂停和 reduced-motion 停止自动模拟，保留手动推进。
- 请求演示须保留授权、现场校验、联锁与回执顺序；不增加真实设备控制接口。

## 检查与交付

- `node sync-shells.cjs` 同步公共外壳；`node check.cjs` 执行全部检查；`node preview.cjs` 本地预览。
- 实际浏览器检查双语、路由、桌面/手机、键盘和演示；单元检查不能替代视觉检查。
- 站点身份在 `.openai/hosting.json`，默认保持域名、project_id 和访问范围。使用 Sites 发布时按安装的 Sites Skill 执行。
- 提交、推送、合并和发布依用户授权；核对远端 SHA，未验证不写通过。
- 本仓库不含 C++ 桌面应用或局域网更新操作页，不引入其构建依赖。
