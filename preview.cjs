// Local review server. Installation files never enter dist or the deployment archive.
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  vm = require("node:vm");
const root = path.resolve(__dirname, "dist"),
  port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
const sandbox = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "detector-release.js"), "utf8"),
  sandbox,
);
const release = sandbox.window.PLC_DETECTOR_RELEASE;
const endpoint = "/__preview/downloads/" + release.file;
let localDownload = null;
const mapping = path.join(__dirname, ".tools", "detector-download.json");
if (fs.existsSync(mapping)) {
  const candidate = path.resolve(
    __dirname,
    JSON.parse(fs.readFileSync(mapping, "utf8")).file,
  );
  const allowed = path.resolve(__dirname, "artifacts", "downloads");
  if (
    path.dirname(candidate) !== allowed ||
    path.basename(candidate) !== release.file
  )
    throw new Error(
      "Preview artifact must be the named package under artifacts/downloads.",
    );
  const stat = fs.statSync(candidate);
  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(candidate))
    .digest("hex");
  if (stat.size !== release.bytes || hash !== release.sha256)
    throw new Error("Preview installer does not match release metadata.");
  localDownload = { file: candidate, size: stat.size, mtime: stat.mtimeMs };
}
const server = http.createServer((req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host || "")) {
    res.writeHead(403).end();
    return;
  }
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (pathname === "/__preview/detector-config.js") {
      const value = localDownload
        ? { url: endpoint, version: release.version, sha256: release.sha256 }
        : null;
      res
        .writeHead(200, { "Content-Type": types[".js"] })
        .end(
          req.method === "HEAD"
            ? ""
            : "window.PLC_DETECTOR_PREVIEW=" + JSON.stringify(value) + ";",
        );
      return;
    }
    if (pathname.startsWith("/__preview/downloads/")) {
      if (pathname !== endpoint || !localDownload) {
        res.writeHead(404).end();
        return;
      }
      const stat = fs.statSync(localDownload.file);
      if (
        stat.size !== localDownload.size ||
        stat.mtimeMs !== localDownload.mtime
      ) {
        res.writeHead(409).end("Preview package changed; restart preview.");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/vnd.microsoft.portable-executable",
        "Content-Length": localDownload.size,
        "Content-Disposition": 'attachment; filename="' + release.file + '"',
      });
      if (req.method === "HEAD") res.end();
      else fs.createReadStream(localDownload.file).pipe(res);
      return;
    }
    let target = path.resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory())
      target = path.join(target, "index.html");
    const found = fs.existsSync(target);
    if (!found) target = path.join(root, "index.html");
    if (path.extname(target) === ".html") {
      const html = fs
        .readFileSync(target, "utf8")
        .replace(
          "</head>",
          '<script src="/__preview/detector-config.js"></script></head>',
        );
      res
        .writeHead(found ? 200 : 404, { "Content-Type": types[".html"] })
        .end(req.method === "HEAD" ? "" : html);
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(target)] || "application/octet-stream",
    });
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(target).pipe(res);
  } catch {
    res.writeHead(400).end();
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Local: http://127.0.0.1:${port}`);
  console.log(
    localDownload
      ? `Local review download ready: ${release.file} (${release.bytes} bytes)`
      : "No local review installer configured; public download stays disabled.",
  );
});
