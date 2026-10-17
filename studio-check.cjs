const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(__dirname + "/dist/studio.js", "utf8"), ctx);
const P = ctx.window.PLCStudio;
let checks = 0;
function check(name, fn) {
  fn();
  checks++;
  console.log("PASS " + name);
}
check("Hourly production chart reconciles to the selected line output", () => {
  const s = P.createState();
  for (let line = 0; line < 5; line++)
    for (let time = 0; time < 15; time++) {
      s.line = line;
      const d = P.read(s, time);
      assert.equal(
        d.hours.reduce((sum, n) => sum + n, 0),
        d.output,
      );
      assert(d.hours.every((n) => n >= 0));
    }
});
check("Offline metrics and charts are unavailable", () => {
  const s = P.createState();
  s.scenario = "offline";
  const d = P.read(s, 12);
  for (const key of ["output", "yield", "cycle", "availability", "temperature"])
    assert.equal(d[key], null);
  assert.equal(d.hours.length, 0);
});
check("Idle and interlocked lines do not accumulate production", () => {
  const s = P.createState();
  s.line = 4;
  assert.equal(P.read(s, 0).output, P.read(s, 30).output);
  s.line = 0;
  s.scenario = "interlock";
  assert.equal(P.read(s, 0).output, P.read(s, 30).output);
});
check(
  "Inspection is accepted only after authorization and local validation",
  () => {
    const s = P.createState();
    P.startRequest(s);
    assert.equal(s.request.step, 0);
    P.advanceRequest(s);
    assert.equal(s.request.step, 1);
    P.advanceRequest(s);
    assert.equal(s.request.step, 2);
    P.advanceRequest(s);
    assert.equal(s.request.step, 3);
    P.advanceRequest(s);
    P.advanceRequest(s);
    assert.equal(s.request.status, "completed");
  },
);
for (const scenario of ["interlock", "offline"])
  check(scenario + " blocks before acceptance", () => {
    const s = P.createState();
    s.scenario = scenario;
    P.startRequest(s);
    for (let i = 0; i < 10; i++) P.advanceRequest(s);
    assert.equal(s.request.step, 2);
    assert.equal(
      s.request.status,
      scenario === "offline" ? "offline" : "blocked",
    );
  });
check("Changing line or scenario cancels the in-flight request", () => {
  P.action("request");
  P.selectLine(2);
  assert.equal(P.snapshot().request.status, "idle");
  P.action("request");
  P.setScenario("interlock");
  assert.equal(P.snapshot().request.status, "idle");
});
check("Recipe preview and alert review are local session states", () => {
  P.action("recipe");
  assert.equal(P.snapshot().recipePreview, true);
  assert.equal(P.snapshot().recipeIndex, 1);
  P.action("review");
  assert.equal(P.snapshot().reviewed, true);
  P.resetRequest();
  P.advance();
  assert.equal(P.snapshot().request.status, "idle");
});
check("All seven modules render in both languages and offline mode", () => {
  for (const language of ["en", "zh"])
    for (const scenario of ["ready", "interlock", "offline"]) {
      P.setScenario(scenario);
      for (let tab = 0; tab < 7; tab++) {
        P.selectTab(tab);
        const html = P.render(language, false, 0, true);
        assert(!html.includes("undefined"));
        assert(
          html.includes('data-studio-tab="' + tab + '" aria-pressed="true"'),
        );
        if (scenario === "offline" && [0, 2].includes(tab))
          assert(html.includes("studio-unavailable"));
      }
    }
});
check(
  "Concept has no network transport, credentials or persistent commands",
  () => {
    const source = fs.readFileSync(__dirname + "/dist/studio.js", "utf8");
    assert(
      !/\b(fetch|XMLHttpRequest|WebSocket|EventSource|localStorage|sessionStorage)\b/.test(
        source,
      ),
    );
  },
);
console.log(`${checks} PLC Studio concept checks passed.`);
