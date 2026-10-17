/* Customizable PLC Studio concept. Synthetic state only; no device transport. */
(() => {
  const copy = {
    tabs: [
      ["Overview", "产线总览"],
      ["Process", "工艺流程"],
      ["Analytics", "数据分析"],
      ["Recipes", "工艺配方"],
      ["Alarms", "告警中心"],
      ["Devices", "设备连接"],
      ["Operations", "操作回执"],
    ],
    lines: [
      ["SMT Assembly", "SMT 贴片"],
      ["Reflow Soldering", "回流焊"],
      ["AOI Inspection", "AOI 检测"],
      ["PCB Testing", "PCB 测试"],
      ["Packaging", "包装与分拣"],
    ],
    local: ["Factory floor / Industrial PC", "工厂现场 / 工业电脑"],
    concept: ["Configurable concept workspace", "可定制的概念工作空间"],
    line: ["Production line", "产线"],
    scenario: ["Demo scenario", "演示场景"],
    scenarios: [
      ["Ready", "就绪"],
      ["Local interlock", "现场联锁"],
      ["Disconnected", "通信中断"],
    ],
    output: ["Shift output", "班次产量"],
    yield: ["First-pass yield", "一次良品率"],
    cycle: ["Cycle time", "周期时间"],
    availability: ["Availability", "设备可用率"],
    production: ["Production rhythm", "生产节奏"],
    quality: ["Quality distribution", "质量分布"],
    trend: ["Process signals", "工艺信号"],
    activity: ["Device activity", "设备活动"],
    actual: ["Output", "产量"],
    target: ["Reference", "参考值"],
    good: ["Good", "合格"],
    rework: ["Rework", "返工"],
    reject: ["Reject", "不良"],
    normalized: [
      "Relative signal level · % of demo range",
      "相对信号水平 · 演示量程百分比",
    ],
    temperature: ["Temperature", "温度"],
    pressure: ["Pressure", "压力"],
    power: ["Power", "功率"],
    unavailable: ["Data unavailable", "数据不可用"],
    unavailableBody: [
      "The demo link is disconnected. Live values and charts are unavailable.",
      "演示链路已断开，实时数值与图表不可用。",
    ],
    state: ["State", "状态"],
    running: ["Running", "运行中"],
    held: ["Held by interlock", "联锁保持"],
    offline: ["Offline", "离线"],
    context: ["Line context", "产线上下文"],
    conditions: ["Local conditions", "现场条件"],
    authorized: ["Operator authorized", "操作员已授权"],
    authority: ["Local authority retained", "现场控制权保留"],
    fresh: ["Fresh device data", "设备数据有效"],
    interlock: ["Interlock clear", "联锁已满足"],
    pass: ["Ready", "满足"],
    blocked: ["Blocked", "阻止"],
    setpoints: ["Recipe setpoints", "配方设定值"],
    versions: ["Recipe versions", "配方版本"],
    recipe: ["Recipe", "配方"],
    version: ["Version", "版本"],
    status: ["Status", "状态"],
    active: ["Selected", "当前选择"],
    draft: ["Draft", "草稿"],
    staged: [
      "Preview → local review → application feedback",
      "预览 → 现场复核 → 应用反馈",
    ],
    recipeNote: [
      "Preview changes in the concept workspace before any on-site application.",
      "在概念工作空间预览变更，再进入现场复核流程。",
    ],
    alarmTimeline: ["Event timeline", "事件时间线"],
    alarmTypes: ["Events by category", "事件分类"],
    warning: ["Warning", "警告"],
    information: ["Information", "信息"],
    acknowledged: ["Reviewed in demo", "演示中已复核"],
    alarmMessages: [
      ["AOI sample awaiting review", "AOI 样本待复核"],
      ["Recipe reference loaded", "配方参考已加载"],
      ["Shift context created", "班次上下文已建立"],
    ],
    connection: ["Connection topology", "连接拓扑"],
    tags: ["Signal monitor", "信号监视"],
    signal: ["Signal", "信号"],
    value: ["Value", "数值"],
    qualityLabel: ["Quality", "数据质量"],
    valid: ["Demo / available", "演示 / 可用"],
    unknown: ["Unknown", "未知"],
    request: ["Run demo inspection", "演示检测任务"],
    previewRecipe: ["Preview recipe change", "预览配方变更"],
    reviewAlarm: ["Review demo alert", "复核演示告警"],
    reset: ["Reset request", "重置请求"],
    idle: [
      "Choose a scenario, then follow a local inspection request.",
      "选择场景，查看一次现场检测请求的处理过程。",
    ],
    phases: [
      ["Intent", "操作意图"],
      ["Authorization", "权限校验"],
      ["Local validation", "现场校验"],
      ["Accepted", "请求受理"],
      ["Completed", "任务完成"],
      ["Feedback", "结果回执"],
    ],
    requestBlocked: [
      "Stopped by local interlock before acceptance.",
      "现场联锁未满足，请求在受理前停止。",
    ],
    requestOffline: [
      "Device link unavailable. Request was not accepted.",
      "设备链路不可用，请求未被受理。",
    ],
    requestDone: [
      "Demo inspection completed. Feedback returned to the workspace.",
      "演示检测已完成，结果已回传至工作空间。",
    ],
    requestRunning: [
      "Following the simulated request path…",
      "正在演示请求处理路径…",
    ],
    recipeFeedback: [
      "Recipe change previewed. No values were written.",
      "已预览配方变更，未写入任何参数。",
    ],
    reviewFeedback: [
      "Demo alert reviewed in this session.",
      "本次会话中的演示告警已复核。",
    ],
    note: [
      "Illustrative modules and synthetic data. Actual functions, screens and integrations are scoped to each customer and production line.",
      "功能模块与数据均为概念演示，实际功能、界面及集成范围按客户需求与产线设计确定。",
    ],
    sample: ["Sample", "样本"],
    nodes: [
      ["Line PLC", "产线 PLC"],
      ["Drive", "驱动器"],
      ["Vision", "视觉设备"],
      ["Remote I/O", "远程 I/O"],
    ],
  };
  const createState = () => ({
    tab: 0,
    line: 0,
    scenario: "ready",
    reviewed: false,
    recipePreview: false,
    recipeIndex: 0,
    notice: "",
    request: { step: -1, status: "idle" },
  });
  const state = createState();
  let language = "en";
  const pair = (x) => x[language === "zh" ? 1 : 0],
    t = (k) => pair(copy[k]);
  const number = (x) => (x === null ? "—" : x.toLocaleString("en-US"));
  function read(s, time = 0) {
    const available = s.scenario !== "offline";
    const output =
      [3520, 2980, 2640, 2340, 1000][s.line] +
      (s.line === 4 ? 0 : (s.scenario === "ready" ? time : 0) * (7 + s.line));
    const weights = [7, 10, 12, 15, 16, 14, 14, 12];
    let cumulative = 0,
      previous = 0;
    const hours = weights.map((w) => {
      cumulative += w;
      const next = Math.round((output * cumulative) / 100);
      const n = next - previous;
      previous = next;
      return n;
    });
    return {
      available,
      output: available ? output : null,
      yield: available ? 98.6 : null,
      cycle: available ? [8.4, 12.6, 6.2, 10.8, 5.1][s.line] : null,
      availability: available ? 96.2 : null,
      hours: available ? hours : [],
      temperature: available
        ? Number(
            (
              [24.8, 242.5, 28.2, 31.4, 23.6][s.line] +
              Math.sin(time * 0.3 + s.line) * 0.4
            ).toFixed(1),
          )
        : null,
      request: { ...s.request },
    };
  }
  function advanceRequest(s) {
    if (s.request.status !== "running") return;
    s.request.step++;
    if (s.request.step === 2 && s.scenario !== "ready")
      s.request.status = s.scenario === "offline" ? "offline" : "blocked";
    else if (s.request.step === 5) s.request.status = "completed";
  }
  function startRequest(s) {
    s.request = { step: 0, status: "running" };
    s.notice = "";
  }
  const resetRequest = () => {
    state.request = { step: -1, status: "idle" };
    state.notice = "";
  };
  function selectTab(n) {
    if (Number.isInteger(n) && n >= 0 && n < copy.tabs.length) state.tab = n;
  }
  function selectLine(n) {
    if (Number.isInteger(n) && n >= 0 && n < 5) {
      state.line = n;
      resetRequest();
      state.reviewed = false;
      state.recipePreview = false;
      state.recipeIndex = 0;
    }
  }
  function setScenario(s) {
    if (["ready", "interlock", "offline"].includes(s)) {
      state.scenario = s;
      resetRequest();
    }
  }
  function action(kind) {
    if (kind === "request") {
      state.tab = 6;
      startRequest(state);
    } else if (kind === "reset") resetRequest();
    else if (kind === "recipe") {
      state.recipePreview = true;
      state.recipeIndex = (state.recipeIndex + 1) % 3;
      state.notice = "recipeFeedback";
    } else if (kind === "review") {
      state.reviewed = true;
      state.notice = "reviewFeedback";
    }
  }
  const card = (title, body, extra = "") =>
    `<article class="studio-card ${extra}"><h4>${title}</h4>${body}</article>`;
  const empty = () =>
    `<div class="studio-unavailable"><strong>— ${t("unavailable")}</strong><p>${t("unavailableBody")}</p></div>`;
  function bars(d) {
    if (!d.available) return empty();
    const max = Math.max(...d.hours) * 1.24;
    return `<div class="studio-legend"><span><i></i>${t("actual")}</span><span><i class="reference"></i>${t("target")}</span></div><div class="studio-bars" role="img" aria-label="${t("production")}: ${number(d.output)}"><div class="studio-gridlines"></div>${d.hours.map((v, i) => `<div class="studio-bar-pair"><div><i class="bar-ref" style="height:${((v * 1.12) / max) * 100}%"></i><i style="height:${(v / max) * 100}%"><span>${v}</span></i></div><small>${String(8 + i).padStart(2, "0")}</small></div>`).join("")}</div><p class="studio-chart-note">08:00–16:00 · ${t("sample")} ${number(d.output)}</p>`;
  }
  function donut(d) {
    if (!d.available) return empty();
    return `<div class="studio-quality"><div class="studio-donut" role="img" aria-label="${t("yield")} 98.6%"><div><strong>98.6<span>%</span></strong><small>${t("good")}</small></div></div><div class="studio-quality-key">${["good", "rework", "reject"].map((k, i) => `<div><i class="quality-${i}"></i><span>${t(k)}</span><b>${[98.6, 0.9, 0.5][i]}%</b></div>`).join("")}</div></div>`;
  }
  function signals(d, time) {
    if (!d.available) return empty();
    const colors = ["#587b67", "#d2a477", "#9c94bc"];
    const paths = colors
      .map((color, j) => {
        const points = Array.from(
          { length: 36 },
          (_, i) =>
            `${(i * 600) / 35},${95 - (Math.sin(i * 0.25 + time * 0.16 + j) * 11 + Math.sin(i * 0.61 + j) * 3 + j * 19)}`,
        ).join(" ");
        return `<polyline points="${points}" stroke="${color}"/>`;
      })
      .join("");
    return `<p class="studio-chart-note">${t("normalized")}</p><svg class="studio-signals" viewBox="0 0 600 150" role="img" aria-label="${t("trend")}"><path d="M0 30H600M0 65H600M0 100H600M0 135H600" stroke="#e5eae5"/>${paths}</svg><div class="studio-legend">${["temperature", "pressure", "power"].map((k, i) => `<span><i style="background:${colors[i]}"></i>${t(k)}</span>`).join("")}</div>`;
  }
  function heatmap(d, time) {
    if (!d.available) return empty();
    return `<div class="studio-heatmap" role="img" aria-label="${t("activity")}">${copy.lines.map((x, i) => `<div><span>${pair(x)}</span>${Array.from({ length: 8 }, (_, j) => `<i style="--level:${[0.22, 0.42, 0.65, 0.9][(i + j + Math.floor(time / 4)) % 4]}"></i>`).join("")}</div>`).join("")}</div><div class="studio-scale"><span>08:00</span><span>16:00</span></div>`;
  }
  function conditions() {
    return `<div class="studio-conditions">${[
      "authorized",
      "authority",
      "fresh",
      "interlock",
    ]
      .map((k, i) => {
        const ok =
          (i !== 2 || state.scenario !== "offline") &&
          (i !== 3 || state.scenario === "ready");
        return `<div><span>${t(k)}</span><b class="${ok ? "" : "warn"}">${ok ? "✓" : "—"} ${t(ok ? "pass" : "blocked")}</b></div>`;
      })
      .join("")}</div>`;
  }
  function eventList() {
    return `<ol class="studio-events">${copy.alarmMessages.map((x, i) => `<li><time>${["09:41", "09:36", "08:00"][i]}</time><i class="${i === 0 && !state.reviewed ? "warn" : ""}"></i><div><strong>${pair(x)}</strong><small>${i === 0 && state.reviewed ? t("acknowledged") : t(i === 0 ? "warning" : "information")}</small></div></li>`).join("")}</ol>`;
  }
  function process(d) {
    return `<div class="studio-process" aria-label="${pair(copy.tabs[1])}">${copy.lines.map((x, i) => `<div class="${state.line === i ? "selected" : ""}"><span>0${i + 1}</span><svg viewBox="0 0 64 48" aria-hidden="true"><rect x="8" y="9" width="48" height="29" rx="5"/><path d="M16 18h11v12H16zM35 18h12M35 24h12M35 30h7M4 43h56"/></svg><b>${pair(x)}</b><small>${state.scenario === "offline" ? "—" : i === state.line && state.scenario === "interlock" ? t("held") : t("running")}</small></div>`).join("")}</div><div class="studio-card-grid">${card(
      t("context"),
      `<div class="studio-sensors">${[
        [t("temperature"), d.temperature, "°C"],
        [t("cycle"), d.cycle, "s"],
        [t("availability"), d.availability, "%"],
      ]
        .map(
          ([label, value, unit], i) =>
            `<div class="studio-sensor sensor-${i}"><span>${label}</span><strong>${value === null ? "—" : value}<small>${value === null ? "" : unit}</small></strong><i></i></div>`,
        )
        .join("")}</div>`,
    )}${card(t("conditions"), conditions())}</div>`;
  }
  function recipes(d) {
    return `<div class="studio-card-grid">${card(t("versions"), `<div class="studio-table-wrap"><table><thead><tr><th>${t("recipe")}</th><th>${t("version")}</th><th>${t("status")}</th></tr></thead><tbody>${["PCB-A", "PCB-B", "PCB-C"].map((name, i) => `<tr><td>${name}</td><td>v${[2.4, 1.8, 1.2][i]}</td><td><span class="studio-tag">${t(i === state.recipeIndex ? "active" : "draft")}</span></td></tr>`).join("")}</tbody></table></div><p class="studio-chart-note">${t("recipeNote")}</p>`)}${card(
      t("setpoints"),
      `<div class="studio-setpoints">${["temperature", "pressure", "power"]
        .map(
          (k, i) =>
            `<div><span>${t(k)}</span><b>${
              d.available
                ? [
                    [68, 45, 76],
                    [72, 49, 68],
                    [61, 52, 81],
                  ][state.recipeIndex][i] + "%"
                : "—"
            }</b><div><i style="width:${
              d.available
                ? [
                    [68, 45, 76],
                    [72, 49, 68],
                    [61, 52, 81],
                  ][state.recipeIndex][i]
                : 0
            }%"></i></div></div>`,
        )
        .join("")}</div><p class="studio-chart-note">${t("normalized")}</p>`,
    )}</div><div class="studio-route-note">${state.recipePreview ? "✓ " : ""}${t("staged")}</div>`;
  }
  function alarms() {
    return `<div class="studio-card-grid">${card(t("alarmTimeline"), eventList())}${card(
      t("alarmTypes"),
      `<div class="studio-category-bars">${[
        [t("quality"), 1],
        [t("recipe"), 1],
        [t("context"), 1],
      ]
        .map(
          ([label, n], i) =>
            `<div><span>${label}</span><i style="--bar:${45 + i * 16}%"></i><b>${n}</b></div>`,
        )
        .join("")}</div><p class="studio-chart-note">${t("concept")}</p>`,
    )}</div>`;
  }
  function devices(d) {
    return `${card(
      t("connection"),
      `<div class="studio-topology"><strong>PLC Studio</strong><span>↔</span><b>${pair(copy.nodes[0])}</b><span>↔</span><div>${copy.nodes
        .slice(1)
        .map((x) => `<span>${pair(x)}</span>`)
        .join("")}</div></div>`,
    )}<div class="studio-card-grid">${card(
      t("tags"),
      `<div class="studio-table-wrap"><table><thead><tr><th>${t("signal")}</th><th>${t("value")}</th><th>${t("qualityLabel")}</th></tr></thead><tbody>${[
        [
          "Process.Temperature",
          d.temperature === null ? "—" : d.temperature + " °C",
        ],
        ["Production.Count", number(d.output)],
        ["Cycle.Elapsed", d.cycle === null ? "—" : d.cycle + " s"],
        [
          "Control.Ready",
          d.available ? (state.scenario === "ready" ? "true" : "false") : "—",
        ],
      ]
        .map(
          ([name, value]) =>
            `<tr><td>${name}</td><td>${value}</td><td>${t(d.available ? "valid" : "unknown")}</td></tr>`,
        )
        .join("")}</tbody></table></div>`,
    )}${card(t("conditions"), conditions())}</div>`;
  }
  function requestText() {
    if (state.request.status === "blocked") return t("requestBlocked");
    if (state.request.status === "offline") return t("requestOffline");
    if (state.request.status === "completed") return t("requestDone");
    if (state.request.status === "running") return t("requestRunning");
    return t("idle");
  }
  function operations() {
    return `<div class="studio-card-grid">${card(pair(copy.tabs[6]), `<ol class="studio-request-steps">${copy.phases.map((x, i) => `<li class="${state.request.step > i || state.request.status === "completed" ? "done" : state.request.step === i ? "current" : ""}"><span>${state.request.step > i ? "✓" : String(i + 1).padStart(2, "0")}</span>${pair(x)}</li>`).join("")}</ol><p class="studio-request-result">${requestText()}</p>`)}${card(t("conditions"), conditions())}</div>`;
  }
  function analytics(d, time) {
    const stability = d.available
      ? `<svg class="studio-scatter" viewBox="0 0 400 170" role="img" aria-label="${language === "zh" ? "周期稳定性散点图" : "Cycle stability scatter plot"}"><path d="M25 20V145H385M25 60H385M25 100H385" stroke="#e4eadd" fill="none"/><rect x="25" y="50" width="360" height="55" fill="#eaf0e3"/>${Array.from({ length: 28 }, (_, i) => `<circle cx="${35 + i * 12.3}" cy="${78 + Math.sin(i * 0.9 + time * 0.1) * 22 + Math.cos(i * 1.6) * 8}" r="${i % 6 === 0 ? 4 : 3}" fill="${i % 6 === 0 ? "#c5a37b" : "#8ba47b"}"/>`).join("")}<text x="25" y="165">01</text><text x="365" y="165">28</text></svg><p class="studio-chart-note">${language === "zh" ? "连续周期样本 · 阴影为演示参考区间" : "Consecutive cycle samples · Shaded demo reference range"}</p>`
      : empty();
    const comparison = d.available
      ? `<div class="studio-line-comparison">${copy.lines.map((x, i) => `<div><span>${pair(x)}</span><div><i style="width:${[91, 84, 76, 67, 35][i]}%"></i></div><b>${[3520, 2980, 2640, 2340, 1000][i].toLocaleString("en-US")}</b></div>`).join("")}</div><p class="studio-chart-note">${language === "zh" ? "班次参考快照 · 用于比较演示" : "Reference shift snapshot · Illustrative comparison"}</p>`
      : empty();
    return `<div class="studio-card-grid">${card(t("production"), bars(d))}${card(language === "zh" ? "周期稳定性" : "Cycle stability", stability)}${card(language === "zh" ? "产线参考对比" : "Line comparison", comparison)}${card(t("trend"), signals(d, time))}</div>`;
  }
  function content(d, time) {
    if (state.tab === 1) return process(d);
    if (state.tab === 2) return analytics(d, time);
    if (state.tab === 3) return recipes(d);
    if (state.tab === 4) return alarms();
    if (state.tab === 5) return devices(d);
    if (state.tab === 6) return operations();
    return `<div class="studio-card-grid">${card(t("production"), bars(d), "studio-wide")}${card(t("quality"), donut(d))}${card(t("trend"), signals(d, time), "studio-wide")}${card(t("activity"), heatmap(d, time))}</div>`;
  }
  function metrics(d) {
    return [
      [
        t("output"),
        d.output === null ? null : number(d.output),
        language === "zh" ? "件" : "pcs",
      ],
      [t("yield"), d.yield, "%"],
      [t("cycle"), d.cycle, "s"],
      [t("availability"), d.availability, "%"],
    ]
      .map(
        ([label, value, unit]) =>
          `<div><span>${label}</span><strong>${value === null ? "—" : value}<small>${value === null ? "" : unit}</small></strong><i>${t(d.available ? "sample" : "unavailable")}</i></div>`,
      )
      .join("");
  }
  function render(locale, playing, time, reduced = false) {
    language = locale;
    const d = read(state, time);
    return `<div class="studio-app"><div class="studio-chrome"><div><span class="studio-emblem">▥</span><strong>PLC Studio</strong><span class="studio-byline">/ ICCH</span></div><span>${t("local")}</span><span class="studio-tag">${t("concept")}</span></div><div class="studio-workspace"><aside class="studio-nav" aria-label="PLC Studio"><p>WORKSPACE</p>${copy.tabs.map((x, i) => `<button data-studio-tab="${i}" aria-pressed="${state.tab === i}"><span aria-hidden="true">${["▦", "⌘", "⌁", "☷", "◇", "⊞", "↗"][i]}</span>${pair(x)}</button>`).join("")}<div class="studio-nav-bottom">ViewEra<br><span>ICCH / PLC Studio</span></div></aside><div class="studio-main"><div class="studio-toolbar"><div><p>${t("local")}</p><h3>${pair(copy.tabs[state.tab])}</h3></div><div class="studio-selects"><label>${t("line")}<select data-studio-line>${copy.lines.map((x, i) => `<option value="${i}" ${state.line === i ? "selected" : ""}>${pair(x)}</option>`).join("")}</select></label><label>${t("scenario")}<select data-studio-scenario>${copy.scenarios.map((x, i) => `<option value="${["ready", "interlock", "offline"][i]}" ${state.scenario === ["ready", "interlock", "offline"][i] ? "selected" : ""}>${pair(x)}</option>`).join("")}</select></label></div></div><div class="studio-context"><span><i class="${state.scenario}"></i>${pair(copy.lines[state.line])}</span><b>${t(state.scenario === "offline" ? "offline" : state.scenario === "interlock" ? "held" : "running")}</b></div><div class="studio-kpis" data-studio-metrics>${metrics(d)}</div><div class="studio-content" data-studio-content>${content(d, time)}</div><div class="studio-actions"><button data-studio-action="request" ${state.request.status === "running" ? "disabled" : ""}>${t("request")} ↗</button>${state.tab === 3 ? `<button data-studio-action="recipe">${t("previewRecipe")}</button>` : ""}${state.tab === 4 ? `<button data-studio-action="review">${t("reviewAlarm")}</button>` : ""}${state.tab === 6 ? `<button data-studio-action="reset">${t("reset")}</button>` : ""}<button data-play aria-pressed="${playing}">${reduced ? (locale === "zh" ? "下一帧数据" : "Next sample") : locale === "zh" ? (playing ? "暂停演示" : "播放演示") : playing ? "Pause demo" : "Play demo"}</button></div><p class="studio-feedback" role="status" data-studio-feedback>${state.notice ? t(state.notice) : requestText()}</p></div></div><div class="studio-footnote">${t("note")}</div></div>`;
  }
  function update(root, locale, time) {
    language = locale;
    const d = read(state, time);
    root
      .querySelectorAll('[data-studio-action="request"]')
      .forEach((el) => (el.disabled = state.request.status === "running"));
    root
      .querySelectorAll("[data-studio-metrics]")
      .forEach((el) => (el.innerHTML = metrics(d)));
    root
      .querySelectorAll("[data-studio-content]")
      .forEach((el) => (el.innerHTML = content(d, time)));
    root
      .querySelectorAll("[data-studio-feedback]")
      .forEach(
        (el) =>
          (el.textContent = state.notice ? t(state.notice) : requestText()),
      );
  }
  window.PLCStudio = {
    render,
    update,
    selectTab,
    selectLine,
    setScenario,
    action,
    resetRequest,
    advance: () => advanceRequest(state),
    createState,
    read,
    startRequest,
    advanceRequest,
    snapshot: () => ({ ...state, request: { ...state.request } }),
  };
})();
