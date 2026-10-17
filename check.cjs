const fs = require("node:fs"),
  vm = require("node:vm"),
  assert = require("node:assert/strict"),
  path = require("node:path");
process.chdir(__dirname);
let count = 0;
function harness(
  language,
  route,
  reduce = false,
  email = "geraltxz@gmail.com",
) {
  const nodes = {},
    events = {},
    stored = {};
  let timers = 0;
  const node = (id) =>
    (nodes[id] ??= {
      innerHTML: "",
      textContent: "",
      attributes: {},
      open: false,
      setAttribute(k, v) {
        this.attributes[k] = v;
      },
      addEventListener() {},
      classList: { add() {}, remove() {}, toggle() {} },
      focus() {},
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
    });
  const doc = {
    documentElement: {},
    hidden: false,
    getElementById: node,
    querySelector: (s) =>
      s === ".icch-home"
        ? null
        : s === "[data-demo]"
          ? route === "/products"
            ? node("demo")
            : null
          : node(s),
    querySelectorAll: () => [],
    addEventListener: (k, v) => (events[k] = v),
  };
  const media = { matches: reduce, addEventListener() {} };
  const ctx = {
    window: { matchMedia: () => media, addEventListener() {}, scrollTo() {} },
    document: doc,
    location: { pathname: route },
    localStorage: {
      getItem: (k) => (k === "viewera-language" ? language : null),
      setItem: (k, v) => (stored[k] = v),
    },
    history: {
      pushState(_, __, p) {
        ctx.location.pathname = p;
      },
    },
    navigator: { clipboard: { writeText: async () => {} } },
    setInterval() {
      timers++;
      return 1;
    },
    clearInterval() {
      timers--;
    },
    console,
  };
  vm.createContext(ctx);
  for (const file of [
    "config.js",
    "content.js",
    "home-copy.js",
    "home-model.js",
    "home.js",
    "studio.js",
  ])
    vm.runInContext(fs.readFileSync("dist/" + file, "utf8"), ctx);
  ctx.window.SITE_CONFIG = { ...ctx.window.SITE_CONFIG, email };
  vm.runInContext(fs.readFileSync("dist/app.js", "utf8"), ctx);
  return {
    ctx,
    nodes,
    events,
    stored,
    node,
    media,
    get timers() {
      return timers;
    },
    run: (s) => vm.runInContext(s, ctx),
    click: (selector, object = {}) =>
      events.click({
        button: 0,
        target: { closest: (s) => (s === selector ? object : null) },
      }),
  };
}
for (const language of ["en", "zh"])
  for (const route of [
    "/",
    "/platform",
    "/products",
    "/technology",
    "/vision",
    "/about",
    "/contact",
  ])
    for (const reduce of [false, true]) {
      const h = harness(language, route, reduce);
      assert(h.nodes.main.innerHTML.includes("<h1"));
      assert(!h.nodes.main.innerHTML.includes("undefined"));
      assert(h.nodes.header.innerHTML.includes("ViewEra"));
      assert(h.ctx.document.title.includes("ViewEra"));
      assert.equal(
        h.ctx.document.documentElement.lang,
        language === "zh" ? "zh-CN" : "en",
      );
      assert(h.nodes.header.innerHTML.includes('aria-current="page"'));
      if (route === "/products") {
        for (const name of [
          "PLC Studio",
          "ICCH Hub Desktop",
          "ICCH Hub Mobile",
        ])
          assert(h.nodes.main.innerHTML.includes(name));
        assert(h.nodes.main.innerHTML.includes("data-home-cloud"));
        assert(h.nodes.main.innerHTML.includes("data-home-phone"));
      }
      if (route === "/platform")
        assert(h.nodes.main.innerHTML.includes("data-home-network"));
      if (route === "/about") assert(h.nodes.main.innerHTML.includes("985"));
      if (route === "/technology")
        assert(!/C\+\+|CMake|Qt Quick/.test(h.nodes.main.innerHTML));
      assert(!h.nodes.main.innerHTML.includes("Coming Soon"));
      for (const m of (
        h.nodes.main.innerHTML +
        h.nodes.header.innerHTML +
        h.nodes.footer.innerHTML
      ).matchAll(/href="(\/[^"]*)"/g))
        assert(fs.existsSync(path.join("dist", m[1], "index.html")), m[1]);
      if (route === "/contact")
        assert(h.nodes.main.innerHTML.includes("mailto:geraltxz@gmail.com"));
      if (route === "/") {
        assert(h.nodes.main.innerHTML.includes("data-home-cloud"));
        assert(h.nodes.main.innerHTML.includes("data-home-phone"));
        assert(!h.nodes.main.innerHTML.includes("Copper plating"));
      }
      if (route === "/products") {
        assert(h.nodes.main.innerHTML.includes("data-preview"));
        assert.equal(h.run("playing"), !reduce);
        assert.equal(h.timers, reduce ? 0 : 1);
        h.ctx.document.hidden = true;
        h.run("syncTimer()");
        assert.equal(h.timers, 0);
        h.ctx.document.hidden = false;
        h.run("syncTimer()");
        h.run("playing=false;syncTimer()");
        assert.equal(h.timers, 0);
        assert(h.nodes.main.innerHTML.includes("data-studio-tab"));
        assert(h.nodes.main.innerHTML.includes("studio-donut"));
        assert(h.nodes.main.innerHTML.includes("studio-heatmap"));
        assert(
          h.nodes.main.innerHTML.includes(
            language === "zh" ? "客户需求" : "customer requirements",
          ),
        );
        assert(!h.nodes.main.innerHTML.includes("tankgrid"));
        for (let i = 0; i < 7; i++) {
          h.ctx.window.PLCStudio.selectTab(i);
          const view = h.run("demoInterior()");
          assert(!view.includes("undefined"));
          assert(
            view.includes('data-studio-tab="' + i + '" aria-pressed="true"'),
          );
        }
        h.run("selectedLayer=0");
        assert(
          h
            .run("layerDetail()")
            .includes(
              language === "en"
                ? "Context beyond location."
                : "让视野，跨越空间。",
            ),
        );
      }
      if (route === "/products" && reduce) {
        const before = h.run("tick");
        h.click("[data-play]");
        assert.equal(h.run("tick"), before + 1);
        assert.equal(h.run("playing"), false);
        assert.equal(h.timers, 0);
      }
      h.click("[data-language]");
      assert.equal(
        h.ctx.document.documentElement.lang,
        language === "zh" ? "en" : "zh-CN",
      );
      assert.equal(
        h.stored["viewera-language"],
        language === "zh" ? "en" : "zh",
      );
      count++;
    }
const contact = harness("en", "/contact", false, "team@example.test");
assert(contact.nodes.main.innerHTML.includes("mailto:team@example.test"));
const unknown = harness("en", "/missing");
assert(unknown.nodes.main.innerHTML.includes("404 / VIEWERA"));
const css = fs.readFileSync("dist/style.css", "utf8");
assert(/prefers-reduced-motion:\s*reduce/.test(css));
assert(/prefers-reduced-transparency:\s*reduce/.test(css));
assert(/prefers-contrast:\s*more/.test(css));
for (const route of [
  "platform",
  "products",
  "technology",
  "vision",
  "about",
  "contact",
]) {
  const shell = fs.readFileSync(`dist/${route}/index.html`, "utf8");
  assert(
    shell.match(/rel="canonical"\s+href="([^"]+)"/)[1].endsWith("/" + route),
  );
  assert(
    shell
      .match(/property="og:url"\s+content="([^"]+)"/)[1]
      .endsWith("/" + route),
  );
  assert(
    shell
      .match(/property="og:title"\s+content="([^"]+)"/)[1]
      .includes("ICCH · ViewEra"),
  );
}
const index = fs.readFileSync("dist/index.html", "utf8");
for (const file of ["config.js", "content.js", "app.js"])
  assert(index.includes("/" + file));
assert.equal(
  JSON.parse(fs.readFileSync(".openai/hosting.json")).project_id,
  "appgprj_6ad3930e487081918116a3848f1486fb",
);
console.log(
  `${count} route/language/motion combinations passed; demo state, pause/background behavior, navigation links, metadata, contact and 404 checked.`,
);
require("./home-check.cjs");
require("./studio-check.cjs");
