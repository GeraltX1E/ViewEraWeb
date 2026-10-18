const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const ctx = { window: {} };
for (const file of ["detector-release.js", "detector.js"])
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "dist", file), "utf8"),
    ctx,
  );
const R = ctx.window.PLC_DETECTOR_RELEASE,
  P = ctx.window.PLCDetector;
assert.equal(R.version, "0.2.0");
assert(/^[a-f0-9]{64}$/.test(R.sha256));
assert(R.bytes > 0);
assert.equal(R.file, `PLCDetector-${R.version}-Cpp-Setup-x64.exe`);
const publicUrl =
  "https://github.com/GeraltX1E/ViewEraWeb/releases/download/plc-detector-v0.2.0/" +
  R.file;
assert.equal(R.productionUrl, publicUrl);
assert.equal(R.publicationApproved, true);
for (const language of ["en", "zh"]) {
  const html = P.render(language);
  assert(html.includes("PLC Detector"));
  assert(html.includes(language === "en" ? "FINS/TCP" : "FINS/TCP"));
  assert(html.includes("FINS/UDP"));
  assert(!html.includes("undefined"));
  assert(html.includes('href="' + publicUrl + '"'));
  assert(!html.includes('class="button detector-download" disabled'));
  assert(
    html.includes(
      language === "en" ? "Linux — Coming Soon" : "Linux — 即将推出",
    ),
  );
  assert(!/href="[^"]*linux/i.test(html));
  assert(!html.includes('class="detector-requirements"'));
  assert(!html.includes("Current protocol scope:"));
  assert(!html.includes("当前协议范围为"));
  assert(html.includes(R.version));
  ctx.window.PLC_DETECTOR_PREVIEW = {
    url: "/__preview/downloads/" + R.file,
    version: R.version,
    sha256: R.sha256,
  };
  const preview = P.render(language);
  assert(preview.includes('href="/__preview/downloads/' + R.file + '"'));
  assert(
    preview.includes(language === "en" ? "Local review only" : "仅供本地审阅"),
  );
  ctx.window.PLC_DETECTOR_PREVIEW.sha256 = "stale";
  assert(P.render(language).includes('href="' + publicUrl + '"'));
  delete ctx.window.PLC_DETECTOR_PREVIEW;
  ctx.window.PLC_DETECTOR_RELEASE = {
    ...R,
    publicationApproved: false,
    productionUrl: null,
  };
  assert(
    P.render(language).includes('class="button detector-download" disabled'),
  );
  ctx.window.PLC_DETECTOR_RELEASE = R;
  for (const image of html.matchAll(/src="(\/assets\/plc-detector\/[^"]+)"/g)) {
    const data = fs.readFileSync(path.join(__dirname, "dist", image[1]));
    assert.equal(data.subarray(1, 4).toString(), "PNG");
    assert(data.readUInt32BE(16) > 0);
  }
}
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
}
assert(
  !files(path.join(__dirname, "dist")).some((f) => /\.(exe|zip)$/i.test(f)),
);
assert(
  !fs
    .readFileSync(path.join(__dirname, "dist/index.html"), "utf8")
    .includes("/__preview/"),
);
assert(
  fs
    .readFileSync(path.join(__dirname, "dist/sitemap.xml"), "utf8")
    .includes("/products/plc-detector"),
);
console.log(
  "Detector bilingual product, screenshots, metadata, local/public download separation and Linux Coming Soon checks passed.",
);
