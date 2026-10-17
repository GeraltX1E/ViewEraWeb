/* Pure synthetic model. No network, credentials, industrial commands or persistence. */
(() => {
  const specs = [
    {
      status: "running",
      output: 3520,
      rate: 3,
      temp: 24.6,
      yield: 99.2,
      oee: 90.1,
      cycle: 8.4,
      devices: 10,
    },
    {
      status: "running",
      output: 2980,
      rate: 2,
      temp: 242.2,
      yield: 99.1,
      oee: 89.3,
      cycle: 11.8,
      devices: 8,
    },
    {
      status: "warning",
      output: 2640,
      rate: 2,
      temp: 26.1,
      yield: 97.8,
      oee: 84.2,
      cycle: 9.6,
      devices: 9,
    },
    {
      status: "running",
      output: 2340,
      rate: 2,
      temp: 25.3,
      yield: 98.3,
      oee: 85.9,
      cycle: 13.1,
      devices: 9,
    },
    {
      status: "idle",
      output: 1000,
      rate: 0,
      temp: 23.4,
      yield: 98.6,
      oee: 87.5,
      cycle: 10.4,
      devices: 6,
    },
  ];
  const create = () => ({
    tick: 0,
    selected: 0,
    plant: 0,
    scenario: "ready",
    request: { step: -1, state: "idle", line: null, plant: null },
    reviewed: [false, false],
  });
  function snapshot(model) {
    const plantOffset = model.plant === 1 ? -0.03 : 0;
    const lines = specs.map((s, i) => {
      const offline = model.scenario === "offline" && i === model.selected;
      const reviewed = model.reviewed[model.plant] && i === 2;
      const count = s.output + s.rate * model.tick;
      return {
        ...s,
        index: i,
        status: offline ? "offline" : reviewed ? "running" : s.status,
        output: offline ? null : Math.round(count * (1 + plantOffset)),
        temp: offline ? null : s.temp + Math.sin(model.tick * 0.12 + i) * 0.28,
        utilization: offline ? null : s.status === "idle" ? 0 : 86 + i,
        cycle: offline ? null : s.cycle,
        quality: offline ? "unavailable" : "synthetic",
        history: Array.from(
          { length: 26 },
          (_, x) => s.temp + Math.sin((x + model.tick) * 0.16 + i) * 0.35,
        ),
      };
    });
    const valid = lines.filter((x) => x.quality !== "unavailable");
    return {
      lines,
      output:
        valid.length === lines.length
          ? valid.reduce((a, x) => a + x.output, 0)
          : null,
      active: lines.filter((x) => ["running", "warning"].includes(x.status))
        .length,
      devices: 42,
      alerts: lines.filter(
        (x) => x.status === "warning" || x.status === "offline",
      ).length,
      yield: 98.6,
      oee: 87.4,
      quality: valid.length === lines.length ? "synthetic" : "partial",
    };
  }
  function start(model) {
    if (model.request.state === "running") return false;
    model.request = {
      step: 0,
      state: "running",
      line: model.selected,
      plant: model.plant,
    };
    return true;
  }
  function advance(model) {
    if (model.request.state !== "running") return;
    // No acceptance can occur until authorization and local validation have passed.
    if (model.request.step === 2 && model.scenario !== "ready") {
      model.request.state =
        model.scenario === "offline" ? "offline" : "blocked";
      return;
    }
    if (model.request.step < 5) model.request.step++;
    if (model.request.step === 5) {
      model.request.state = "completed";
      if (model.request.line === 2) model.reviewed[model.request.plant] = true;
    }
  }
  function reset(model) {
    model.request = { step: -1, state: "idle", line: null, plant: null };
  }
  function select(model, index) {
    if (model.request.state === "running") reset(model);
    model.selected = Math.max(0, Math.min(4, index));
  }
  function scenario(model, value) {
    if (!["ready", "interlock", "offline"].includes(value)) return;
    reset(model);
    model.scenario = value;
  }
  window.ICCHHomeModel = {
    create,
    snapshot,
    start,
    advance,
    reset,
    select,
    scenario,
  };
})();
