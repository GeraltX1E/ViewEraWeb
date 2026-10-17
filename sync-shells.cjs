const fs = require("node:fs");
const vm = require("node:vm");
process.chdir(__dirname);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("dist/config.js", "utf8"), sandbox);
const origin = sandbox.window.SITE_CONFIG.origin;
const base = fs.readFileSync("dist/index.html", "utf8");
for (const [route, label] of Object.entries({
  platform: "Hub",
  products: "Products",
  technology: "Technology",
  vision: "Vision",
  about: "About Us",
  contact: "Contact",
})) {
  const title = `${label} — ICCH · ViewEra`;
  const html = base
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*/, `$1${title}`)
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*/,
      `$1${origin}/${route}`,
    )
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*/, `$1${origin}/${route}`);
  fs.mkdirSync(`dist/${route}`, { recursive: true });
  fs.writeFileSync(`dist/${route}/index.html`, html);
}
console.log("Six direct-entry shells synchronized.");
