# GitHub Pages 部署与 viewera.site

## 发布方式

仓库 `GeraltX1E/ViewEraWeb` 的 `main` 通过 `.github/workflows/pages.yml` 发布。工作流先执行 `node check.cjs`，再上传 `dist`，使用 GitHub 官方 Pages Actions 部署。Pages 的构建来源须设为 GitHub Actions。

正式域名为 `https://viewera.site`。配置、canonical、Open Graph、sitemap 和 robots 已同步到此地址。Sites 身份文件保持不变。

## 首次启用前提

GitHub 当前套餐不支持这个私有仓库的 Pages（API 已返回 422）。免费部署需要用户明确同意将本官网仓库公开，或由用户安排支持私有 Pages 的付费套餐。尚未改变仓库可见性。

## DNS 记录

先在仓库 Settings → Pages 保存自定义域名 `viewera.site`，再调整 DNS，以免留下未绑定的域名指向。

| 主机记录 | 类型 | 值 |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | geraltx1e.github.io |

保留邮件 MX、邮件认证 TXT、NS 及无关子域名记录。若已有同名网站 A/AAAA/CNAME 冲突，先核实用途再更换。域名验证 TXT 以 GitHub 账号设置中实际生成的值为准，不编造。

GitHub DNS 检查和 HTTPS 证书就绪后启用 Enforce HTTPS。证书与 DNS 生效需要等待，不能仅凭提交工作流就认定域名已上线。

## 检查

发布后检查：首页与六个子路由直接访问、静态资源、中英文切换、PLC Studio 图表、HTTPS 和 canonical；核对工作流成功及实际域名访问。国内网络可用性仍需实测。
