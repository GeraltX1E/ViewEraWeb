const fs = require("node:fs"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(__dirname + "/dist/home-model.js", "utf8"),
  ctx,
);
const M = ctx.window.ICCHHomeModel;
let cases = 0;
function test(name, fn) {
  fn();
  cases++;
  console.log("PASS " + name);
}
test("Coherent first frame: 12480 units, 42 demo devices, 4 active lines", () => {
  const s = M.snapshot(M.create());
  assert.equal(s.output, 12480);
  assert.equal(s.devices, 42);
  assert.equal(s.active, 4);
  assert.equal(s.alerts, 1);
  assert.equal(
    s.lines.reduce((a, l) => a + l.output, 0),
    s.output,
  );
});
test("Counts grow monotonically; idle output stays fixed", () => {
  const m = M.create(),
    before = M.snapshot(m);
  m.tick = 10;
  const after = M.snapshot(m);
  assert(after.output > before.output);
  assert.equal(after.lines[4].output, before.lines[4].output);
  assert(
    after.lines.every((l, i) => Math.abs(l.temp - before.lines[i].temp) < 0.6),
  );
});
test("No acceptance before authorization and edge validation", () => {
  const m = M.create();
  M.start(m);
  assert.equal(m.request.step, 0);
  M.advance(m);
  assert.equal(m.request.step, 1);
  M.advance(m);
  assert.equal(m.request.step, 2);
  assert.equal(m.request.state, "running");
  M.advance(m);
  assert.equal(m.request.step, 3);
  M.advance(m);
  assert.equal(m.request.step, 4);
  M.advance(m);
  assert.equal(m.request.step, 5);
  assert.equal(m.request.state, "completed");
});
for (const scenario of ["interlock", "offline"])
  test(scenario + " stops before acceptance", () => {
    const m = M.create();
    M.scenario(m, scenario);
    M.start(m);
    for (let n = 0; n < 10; n++) M.advance(m);
    assert.equal(m.request.step, 2);
    assert.equal(
      m.request.state,
      scenario === "offline" ? "offline" : "blocked",
    );
    assert.equal(m.reviewed[0], false);
  });
test("Offline equipment has no fresh metrics or complete factory total", () => {
  const m = M.create();
  M.scenario(m, "offline");
  const s = M.snapshot(m);
  assert.equal(s.lines[0].status, "offline");
  for (const key of ["output", "temp", "cycle", "utilization"])
    assert.equal(s.lines[0][key], null);
  assert.equal(s.output, null);
  assert.equal(s.quality, "partial");
});
test("Changing target cancels the pending request", () => {
  const m = M.create();
  M.start(m);
  M.advance(m);
  M.select(m, 3);
  assert.equal(m.selected, 3);
  assert.equal(m.request.state, "idle");
  M.advance(m);
  assert.equal(m.request.step, -1);
});
test("Request reset has no late completion", () => {
  const m = M.create();
  M.start(m);
  M.reset(m);
  for (let i = 0; i < 8; i++) M.advance(m);
  assert.equal(m.request.state, "idle");
});
test("Only inspection of AOI clears that factory alert", () => {
  const m = M.create();
  M.start(m);
  for (let i = 0; i < 5; i++) M.advance(m);
  assert.equal(M.snapshot(m).alerts, 1);
  M.select(m, 2);
  M.start(m);
  for (let i = 0; i < 5; i++) M.advance(m);
  assert.equal(M.snapshot(m).alerts, 0);
  m.plant = 1;
  assert.equal(M.snapshot(m).alerts, 1);
});
test("Homepage model has no transport or credential interfaces", () => {
  const src =
    fs.readFileSync(__dirname + "/dist/home-model.js", "utf8") +
    fs.readFileSync(__dirname + "/dist/home.js", "utf8");
  assert(!/\b(fetch|WebSocket|XMLHttpRequest|sendBeacon)\s*\(/.test(src));
});
console.log(`${cases} synthetic workflow and data integrity checks passed.`);

// Controller lifecycle: fake DOM, real module, controllable media/visibility signals.
const callbacks = {},
  media = {
    matches: false,
    addEventListener: (event, fn) => (callbacks.media = fn),
  };
let activeTimers = 0;
const field = {
  dataset: {},
  textContent: "",
  classList: { add() {} },
  setAttribute() {},
  focus() {},
};
const root = {
  dataset: {},
  addEventListener: (event, fn) => (callbacks[event] = fn),
  removeEventListener() {},
  contains: () => false,
  querySelectorAll: (s) => (s === "[data-home-live]" ? [field] : []),
  querySelector: () => field,
};
const dom = {
  hidden: false,
  activeElement: null,
  querySelector: () => root,
  addEventListener: (event, fn) => (callbacks[event] = fn),
};
const lifecycle = {
  window: { matchMedia: () => media },
  document: dom,
  setInterval: () => {
    activeTimers++;
    return 1;
  },
  clearInterval: () => activeTimers--,
};
vm.createContext(lifecycle);
for (const name of ["home-copy.js", "home-model.js", "home.js"])
  vm.runInContext(
    fs.readFileSync(__dirname + "/dist/" + name, "utf8"),
    lifecycle,
  );
const component = lifecycle.window.ICCHHome;
component.mount("en");
assert.equal(activeTimers, 1);
dom.hidden = true;
callbacks.visibilitychange();
assert.equal(activeTimers, 0);
dom.hidden = false;
callbacks.visibilitychange();
assert.equal(activeTimers, 1);
callbacks.click({
  target: { closest: (s) => (s === "[data-home-play]" ? field : null) },
});
assert.equal(activeTimers, 0);
callbacks.click({
  target: { closest: (s) => (s === "[data-home-play]" ? field : null) },
});
assert.equal(activeTimers, 1);
media.matches = true;
callbacks.media();
assert.equal(activeTimers, 0);
callbacks.click({
  target: { closest: (s) => (s === "[data-home-play]" ? field : null) },
});
assert.equal(activeTimers, 0);
component.dispose();
assert.equal(activeTimers, 0);
const observed = [];
class FakeObserver {
  constructor(callback) {
    this.callback = callback;
    observed.push(this);
  }
  observe() {}
  disconnect() {}
}
lifecycle.window.IntersectionObserver = FakeObserver;
lifecycle.IntersectionObserver = FakeObserver;
media.matches = false;
component.mount("en");
callbacks.click({
  target: { closest: (s) => (s === "[data-home-play]" ? field : null) },
});
assert.equal(activeTimers, 0);
observed[0].callback([{ target: field, isIntersecting: true }]);
assert.equal(activeTimers, 1);
observed[0].callback([{ target: field, isIntersecting: false }]);
assert.equal(activeTimers, 0);
component.dispose();
console.log(
  "Home controller: offscreen/background pause, play/pause, reduced-motion and unmount cleanup passed.",
);
