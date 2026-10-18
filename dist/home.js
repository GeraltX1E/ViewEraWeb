/* Home-only presentation. All interactions stay inside the synthetic model. */
(() => {
  const M = window.ICCHHomeModel,
    C = window.ICCH_HOME_COPY;
  const model = M.create();
  let locale = "en",
    root = null,
    timer = null,
    observer = null,
    scrollObserver = null,
    visible = new Map();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let playing = !motion.matches;
  const pair = (x) => x[locale === "zh" ? 1 : 0],
    t = (k) => pair(C[k]);
  const num = (x) =>
    x === null
      ? "—"
      : Math.round(x).toLocaleString(locale === "zh" ? "zh-CN" : "en-US");
  const glyphs = [
    '<rect x="7" y="28" width="50" height="20" rx="4"/><path d="M13 28V16h15v12m9 0V12h14v16M4 54h56M19 38h8m9 0h8"/><path d="M18 16V9h5v7"/>',
    '<rect x="7" y="22" width="50" height="29" rx="5"/><path d="M15 36h34M15 43h34M17 14c-7-5 7-6 0-12m15 12c-7-5 7-6 0-12m15 12c-7-5 7-6 0-12"/>',
    '<path d="M8 47h48M14 47V26h36v21M32 26V13m-8 0h16"/><circle cx="32" cy="32" r="8"/><path d="m28 32 3 3 5-6"/>',
    '<rect x="10" y="11" width="44" height="40" rx="6"/><path d="M19 39h5l4-13 7 17 5-10h6M22 19h20"/>',
    '<path d="m10 23 22-12 22 12v26L32 59 10 49Z"/><path d="m10 23 22 12 22-12M32 35v24M21 17l22 12"/>',
  ];
  const deviceIcon = (i) =>
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[i]}</svg>`;
  const badge = (line) =>
    `<span class="home-status ${line.status}"><i></i>${pair(C.statuses[line.status])}</span>`;
  function chart(line, mini = false) {
    const min = Math.min(...line.history) - 0.2,
      max = Math.max(...line.history) + 0.2;
    const points = line.history
      .map(
        (v, i) => `${(i * 600) / 25},${100 - ((v - min) / (max - min)) * 70}`,
      )
      .join(" ");
    return `<svg class="home-chart ${mini ? "mini" : ""}" viewBox="0 0 600 120" preserveAspectRatio="none" role="img" aria-label="${t("history")}"><path d="M0 25H600M0 65H600M0 105H600" stroke="currentColor" opacity=".09"/><polyline data-home-chart="${line.index}" points="${line.quality === "unavailable" ? "" : points}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
  }
  function metrics(snapshot) {
    return `<div class="home-metrics"><div><span>${t("output")}</span><strong data-home-value="total">${num(snapshot.output)}</strong><small>${t("units")}</small></div><div><span>${t("yield")}</span><strong>${snapshot.yield}<em>%</em></strong></div><div><span>${t("oee")}</span><strong>${snapshot.oee}<em>%</em></strong></div><div><span>${t("active")}</span><strong data-home-value="active">${snapshot.active}<em>/ 5</em></strong></div></div>`;
  }
  function cloud(variant = "hero") {
    const s = M.snapshot(model);
    return `<div class="home-cloud-chrome"><span class="home-cloud-logo"><b>ICCH</b><i>${t("cloud")}</i></span><span class="home-cloud-user">${t("simulated")}<i>V</i></span></div><div class="home-cloud-body"><aside class="home-cloud-sidebar"><span class="current">▦ <i>${t("overview")}</i></span><span>⌁ <i>${t("analytics")}</i></span><span>▧ <i>${t("devices")}</i></span><span>◇ <i>${t("alerts")}</i></span><small>VIEWERA</small></aside><div class="home-cloud-main"><div class="home-cloud-heading"><div><p>${model.plant === 0 ? t("factory") : t("workshop")}</p><h3>${t("overview")}</h3></div><span class="home-small-status">${t("updated")}</span></div>${metrics(s)}<div class="home-line-cards">${s.lines.map((line, i) => `<button class="home-line-card line-${i} ${i === model.selected ? "selected" : ""}" data-home-line="${i}" data-view="${variant}" aria-pressed="${i === model.selected}"><span class="line-card-top">${deviceIcon(i)}${badge(line)}</span><strong>${pair(C.lines[i])}</strong><span class="line-card-value"><b data-home-value="count-${i}">${num(line.output)}</b> ${t("units")}</span><span class="line-card-foot">${line.quality === "unavailable" ? t("offlineData") : i === 2 && !model.reviewed[model.plant] ? t("alertText") : t("simulated")}</span></button>`).join("")}</div><div class="home-cloud-bottom"><div><span>${t("analytics")}</span>${chart(s.lines[model.selected], true)}</div><div class="home-summary"><span>${t("deviceCount")}</span><strong>42</strong><small>${t("alerts")} <b data-home-value="alerts">${s.alerts}</b></small></div></div></div></div>`;
  }
  function phone(mode = "hero") {
    const s = M.snapshot(model),
      line = s.lines[model.selected];
    return `<div class="home-phone-status"><span>9:41</span><span aria-hidden="true">▮▮▮ ▰</span></div><div class="home-phone-title"><b>ICCH</b><span>${t("mobile")}</span></div><div class="home-phone-factory"><span>${t("factories")}</span><select data-home-factory data-view="${mode}" aria-label="${t("selectFactory")}"><option value="0" ${model.plant === 0 ? "selected" : ""}>${t("factory")}</option><option value="1" ${model.plant === 1 ? "selected" : ""}>${t("workshop")}</option></select></div><div class="home-phone-stats"><div><span>${t("output")}</span><strong data-home-value="total">${num(s.output)}</strong></div><div><span>${t("active")}</span><strong data-home-value="active">${s.active}<em>/5</em></strong></div></div><div class="home-phone-lines">${s.lines.map((x, i) => `<button data-home-line="${i}" data-view="phone-${mode}" aria-pressed="${i === model.selected}" class="${i === model.selected ? "selected" : ""}"><span class="phone-line-icon line-${i}">${deviceIcon(i)}</span><span><strong>${pair(C.lines[i])}</strong>${badge(x)}</span><span class="phone-line-arrow">›</span></button>`).join("")}</div><div class="home-phone-footer"><span>${t("concept")}</span><span class="home-request-mini" data-home-request-message>${requestText()}</span></div><div class="home-phone-handle" aria-hidden="true"></div>`;
  }
  function detail() {
    const s = M.snapshot(model),
      line = s.lines[model.selected];
    return `<div class="home-detail-header"><div><p>${t("lineDetails")}</p><h3>${pair(C.lines[model.selected])}</h3></div>${badge(line)}</div><div class="home-detail-metrics"><div><span>${t("temperature")}</span><strong data-home-value="temperature">${line.temp === null ? "—" : line.temp.toFixed(1)}<small>°C</small></strong></div><div><span>${t("cycle")}</span><strong>${line.cycle === null ? "—" : line.cycle}<small>s</small></strong></div><div><span>${t("utilization")}</span><strong>${line.utilization === null ? "—" : line.utilization}<small>%</small></strong></div></div><div class="home-detail-chart"><span>${line.quality === "unavailable" ? t("offlineData") : t("history")}</span>${chart(line)}<div><span>−25 s</span><span>−10 s</span><span>0 s</span></div></div><p class="home-detail-note">${t("concept")}</p>`;
  }
  function requestText() {
    const r = model.request;
    return r.state === "idle"
      ? t("ready")
      : r.state === "running"
        ? pair(C.requestPhases[r.step])
        : t(
            r.state === "completed"
              ? "completed"
              : r.state === "blocked"
                ? "blocked"
                : "offline",
          );
  }
  function requestPanel() {
    const r = model.request;
    return `<div class="home-request-toolbar"><label>${t("scenario")}<select data-home-scenario ${r.state === "running" ? "disabled" : ""}>${["ready", "interlock", "offline"].map((x, i) => `<option value="${x}" ${model.scenario === x ? "selected" : ""}>${pair(C.scenarios[i])}</option>`).join("")}</select></label><span>${t("simulated")}</span></div><div class="home-request-target">${deviceIcon(model.selected)}<div><p>${model.plant === 0 ? t("factory") : t("workshop")}</p><h3>${pair(C.lines[model.selected])}</h3><span>${model.scenario === "ready" ? pair(C.scenarios[0]) : model.scenario === "interlock" ? pair(C.scenarios[1]) : pair(C.scenarios[2])}</span></div></div><ol class="home-request-steps">${C.requestPhases.map((x, i) => `<li class="${r.step > i || r.state === "completed" ? "done" : r.step === i ? "current" : ""} ${r.step === i && ["blocked", "offline"].includes(r.state) ? "blocked" : ""}" ${r.step === i ? 'aria-current="step"' : ""}><span>${r.step > i || r.state === "completed" ? "✓" : String(i + 1).padStart(2, "0")}</span>${pair(x)}</li>`).join("")}</ol><p class="home-request-feedback ${r.state}" role="status">${requestText()}</p><div class="home-request-actions"><button class="button" data-home-request ${r.state === "running" ? "disabled" : ""}>${t("task")} <span aria-hidden="true">↗</span></button>${r.state === "running" && (!playing || motion.matches) ? `<button class="text-button" data-home-advance>${t("advance")} →</button>` : ""}<button class="text-button" data-home-play data-play-context="request" aria-pressed="${playing && !motion.matches}">${t(motion.matches ? "next" : playing ? "pause" : "play")}</button><button class="text-button" data-home-reset>${t("reset")}</button></div>`;
  }
  function flow() {
    const labels = C.flowLabels;
    return `<div class="home-network-core"><span class="home-network-brand">ICCH</span><span>${pair(labels[1])}</span><div class="home-web-mobile"><span>Web</span><i>+</i><span>Mobile</span></div></div><div class="home-network-internet"><i></i><span>${pair(labels[2])}</span><i></i></div><div class="home-network-columns">${[0, 1, 2].map((x) => `<div class="home-field-stack"><span class="home-edge-number">0${x + 1}</span><div class="home-edge-computer"><div class="home-edge-screen"><b>PLC Studio</b><span></span><span></span><span></span></div><i></i><strong>${t("edge")}</strong></div><div class="home-field-link"></div><a class="home-detector" href="/products/plc-detector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="10" cy="10" r="6"/><circle cx="10" cy="10" r="2"/><path d="m15 15 5 5M10 2v2M2 10h2"/></svg><span><b>PLC Detector</b><small>${t("detectorRole")}</small></span></a><div class="home-field-link"></div><div class="home-plc"><span>PLC</span><i></i><i></i><i></i><i></i></div><div class="home-field-link"></div><div class="home-equipment">${deviceIcon(x)}<span>${pair(C.lines[x])}</span></div></div>`).join("")}</div><div class="home-network-foot"><span>${pair(labels[5])}</span><span>${t("returnFlow")}</span></div>`;
  }
  function controls() {
    return `<div class="home-playback" role="group" aria-label="${t("controls")}"><span>${t("concept")}</span><button data-home-play data-play-context="hero" aria-pressed="${playing && !motion.matches}"><span aria-hidden="true">${playing && !motion.matches ? "Ⅱ" : "▷"}</span> ${t(motion.matches ? "next" : playing ? "pause" : "play")}</button></div>`;
  }
  function render(language) {
    locale = language;
    return `<div class="icch-home"><section class="home-hero"><div class="home-hero-copy"><p class="eyebrow home-intro">${t("introduce")}</p><div class="home-wordmark">ICCH</div><h1>${locale === "zh" ? "让工业控制，<br><span>突破边界。</span>" : "Control beyond <br><span>boundaries.</span>"}</h1><p class="home-hero-sub">${t("sub")}</p><div class="actions"><a class="button" href="#icch-experience">${t("try")} <span>↓</span></a><a class="text-link" href="/platform">${t("explore")} ↗</a></div></div><div class="home-hero-stage" data-home-live><div class="home-desktop hero-cloud" data-home-cloud="hero">${cloud()}</div><div class="home-handset hero-phone" data-home-phone="hero">${phone()}</div><span class="home-stage-caption">${t("concept")}</span></div><p class="home-disclaimer">${t("disclaimer")}</p>${controls()}</section><section class="home-remote"><div class="home-section-copy reveal"><p class="eyebrow">${t("remoteK")}</p><h2>${t("remoteTitle")}</h2><p>${t("remoteBody")}</p></div><div class="home-remote-scene reveal" data-home-live><div class="home-room"><div class="home-room-window"><i></i><i></i></div><div class="home-room-table"></div><div class="home-room-plant"><i></i><i></i><i></i></div><span>${t("locationHome")}</span></div><div class="home-handset remote-phone" data-home-phone="remote">${phone("remote")}</div><div class="home-remote-bridge"><span>ICCH</span><i></i></div><div class="home-factory-context"><p>${t("locationFactory")}</p><div class="home-factory-visual">${deviceIcon(0)}${deviceIcon(1)}${deviceIcon(2)}</div><strong>${model.plant === 0 ? t("factory") : t("workshop")}</strong><span>${t("updated")}</span></div></div></section><section class="home-unified" id="icch-experience"><div class="home-section-copy reveal"><p class="eyebrow">${t("unifK")}</p><h2>${t("unifTitle")}</h2><p>${t("unifBody")}</p></div><div class="home-unified-product reveal" data-home-live><div class="home-desktop" data-home-cloud="unified">${cloud("unified")}</div><div class="home-device-detail" data-home-detail>${detail()}</div></div></section><section class="home-connection"><div class="home-section-copy reveal"><p class="eyebrow">${t("flowK")}</p><h2>${t("flowTitle")}</h2><p>${t("flowBody")}</p></div><div class="home-network reveal" data-home-network>${flow()}</div><div class="home-flow-controls" role="group" aria-label="${t("flowK")}">${C.flowSteps.map((x, i) => `<button data-home-flow="${i}" aria-pressed="${i === 0}"><span>0${i + 1}</span>${pair(x)}</button>`).join("")}</div><p class="home-flow-explainer" data-home-flow-text>${pair(C.flowDescriptions[0])}</p><p class="home-authority">${t("authority")}</p><p class="home-architecture-note">${t("architectureNote")}</p></section><section class="home-operations"><div class="home-section-copy reveal"><p class="eyebrow">${t("experienceK")}</p><h2>${t("experienceTitle")}</h2><p>${t("experienceBody")}</p></div><div class="home-operation-stage reveal" data-home-live><div class="home-request-panel" data-home-request-panel>${requestPanel()}</div><div class="home-operation-context"><div class="home-handset operation-phone" data-home-phone="operations">${phone("operations")}</div><p>${t("disclaimer")}</p></div></div></section><section class="home-closing"><p class="eyebrow">VIEWERA / ICCH</p><h2>${t("closingTitle")}</h2><p>${t("closingBody")}</p><a class="button" href="/products">${t("products")} <span>↗</span></a></section></div>`;
  }
  function restoreFocus(key) {
    if (key) root?.querySelector(key)?.focus({ preventScroll: true });
  }
  function refresh(focusKey) {
    if (!root) return;
    root.dataset.requestStep = String(model.request.step);
    setFlow(
      model.request.step >= 5
        ? 3
        : model.request.step >= 3
          ? 2
          : model.request.step >= 1
            ? 1
            : 0,
    );
    root
      .querySelectorAll("[data-home-cloud]")
      .forEach((el) => (el.innerHTML = cloud(el.dataset.homeCloud)));
    root
      .querySelectorAll("[data-home-phone]")
      .forEach((el) => (el.innerHTML = phone(el.dataset.homePhone)));
    root
      .querySelectorAll("[data-home-detail]")
      .forEach((el) => (el.innerHTML = detail()));
    root
      .querySelectorAll("[data-home-request-panel]")
      .forEach((el) => (el.innerHTML = requestPanel()));
    const plantName = root.querySelector(".home-factory-context>strong");
    if (plantName)
      plantName.textContent = model.plant === 0 ? t("factory") : t("workshop");
    root.querySelectorAll("[data-home-play]").forEach((el) => {
      el.setAttribute("aria-pressed", String(playing && !motion.matches));
      el.innerHTML = `<span aria-hidden="true">${playing && !motion.matches ? "Ⅱ" : "▷"}</span> ${t(motion.matches ? "next" : playing ? "pause" : "play")}`;
    });
    restoreFocus(focusKey);
    sync();
  }
  function updateValues() {
    const s = M.snapshot(model),
      line = s.lines[model.selected];
    root.querySelectorAll("[data-home-value]").forEach((el) => {
      const key = el.dataset.homeValue;
      if (key === "total") el.textContent = num(s.output);
      else if (key === "active") el.innerHTML = `${s.active}<em>/ 5</em>`;
      else if (key === "alerts") el.textContent = s.alerts;
      else if (key === "temperature")
        el.innerHTML = `${line.temp === null ? "—" : line.temp.toFixed(1)}<small>°C</small>`;
      else if (key.startsWith("count-"))
        el.textContent = num(s.lines[Number(key.slice(6))].output);
    });
    root.querySelectorAll("[data-home-chart]").forEach((el) => {
      const data = s.lines[Number(el.dataset.homeChart)];
      const min = Math.min(...data.history) - 0.2,
        max = Math.max(...data.history) + 0.2;
      el.setAttribute(
        "points",
        data.quality === "unavailable"
          ? ""
          : data.history
              .map(
                (v, i) =>
                  `${(i * 600) / 25},${100 - ((v - min) / (max - min)) * 70}`,
              )
              .join(" "),
      );
    });
  }
  function setFlow(n) {
    const network = root.querySelector("[data-home-network]");
    if (!network) return;
    network.dataset.flow = String(n);
    root
      .querySelectorAll("[data-home-flow]")
      .forEach((el) =>
        el.setAttribute(
          "aria-pressed",
          String(Number(el.dataset.homeFlow) === n),
        ),
      );
    root.querySelector("[data-home-flow-text]").textContent = pair(
      C.flowDescriptions[n],
    );
  }
  function updateRequest() {
    const active = root.contains(document.activeElement)
      ? document.activeElement
      : null;
    const focusKey = active?.matches("[data-home-reset]")
      ? "[data-home-reset]"
      : active?.matches("[data-home-advance]")
        ? "[data-home-advance]"
        : active?.matches("[data-home-play]")
          ? `[data-home-play][data-play-context="${active.dataset.playContext}"]`
          : null;
    setFlow(
      model.request.step >= 5
        ? 3
        : model.request.step >= 3
          ? 2
          : model.request.step >= 1
            ? 1
            : 0,
    );
    root
      .querySelectorAll("[data-home-request-panel]")
      .forEach((el) => (el.innerHTML = requestPanel()));
    root
      .querySelectorAll("[data-home-request-message]")
      .forEach((el) => (el.textContent = requestText()));
    root.dataset.requestStep = String(model.request.step);
    if (model.request.state === "completed") refresh();
    restoreFocus(focusKey);
  }
  function step() {
    model.tick++;
    updateValues();
    if (model.request.state === "running") {
      M.advance(model);
      updateRequest();
    }
  }
  function sync() {
    const allowed =
      root &&
      playing &&
      !motion.matches &&
      !document.hidden &&
      [...visible.values()].some(Boolean);
    if (allowed && !timer) timer = setInterval(step, 1800);
    if (!allowed && timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function dispose() {
    if (timer) clearInterval(timer);
    timer = null;
    observer?.disconnect();
    scrollObserver?.disconnect();
    visible.clear();
    if (root) {
      root.removeEventListener("click", click);
      root.removeEventListener("change", change);
    }
    root = null;
  }
  function click(e) {
    const line = e.target.closest("[data-home-line]");
    if (line) {
      const view = line.dataset.view;
      M.select(model, Number(line.dataset.homeLine));
      refresh(`[data-view="${view}"][data-home-line="${model.selected}"]`);
      return;
    }
    if (e.target.closest("[data-home-play]")) {
      if (motion.matches) {
        step();
        return;
      }
      playing = !playing;
      const context =
        e.target.closest("[data-home-play]").dataset.playContext || "hero";
      refresh(`[data-home-play][data-play-context="${context}"]`);
      return;
    }
    if (e.target.closest("[data-home-request]")) {
      M.start(model);
      refresh("[data-home-reset]");
      return;
    }
    if (e.target.closest("[data-home-reset]")) {
      M.reset(model);
      refresh("[data-home-reset]");
      return;
    }
    if (e.target.closest("[data-home-advance]")) {
      M.advance(model);
      updateRequest();
      restoreFocus(
        model.request.state === "running"
          ? "[data-home-advance]"
          : "[data-home-request]",
      );
      return;
    }
    const flowButton = e.target.closest("[data-home-flow]");
    if (flowButton) {
      const n = Number(flowButton.dataset.homeFlow);
      setFlow(n);
      return;
    }
  }
  function change(e) {
    if (e.target.matches("[data-home-factory]")) {
      M.reset(model);
      model.plant = Number(e.target.value);
      refresh(`[data-home-factory][data-view="${e.target.dataset.view}"]`);
      return;
    }
    if (e.target.matches("[data-home-scenario]")) {
      M.scenario(model, e.target.value);
      refresh("[data-home-scenario]");
    }
  }
  function mount(language) {
    dispose();
    locale = language;
    root = document.querySelector(".icch-home");
    if (!root) return;
    root.addEventListener("click", click);
    root.addEventListener("change", change);
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((x) => visible.set(x.target, x.isIntersecting));
          sync();
        },
        { threshold: 0.08 },
      );
      root.querySelectorAll("[data-home-live]").forEach((el) => {
        visible.set(el, false);
        observer.observe(el);
      });
      scrollObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((x) => {
            if (x.isIntersecting) {
              x.target.classList.add("network-visible");
              scrollObserver.unobserve(x.target);
            }
          }),
        { threshold: 0.22 },
      );
      root
        .querySelectorAll("[data-home-network]")
        .forEach((el) => scrollObserver.observe(el));
    } else {
      visible.set(root, true);
      root
        .querySelectorAll("[data-home-network]")
        .forEach((el) => el.classList.add("network-visible"));
    }
    sync();
  }
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", () => {
    if (motion.matches) playing = false;
    if (root) refresh();
  });
  function component(kind, language) {
    locale = language;
    if (kind === "network")
      return `<div class="icch-home icch-support"><div class="home-network reveal" data-home-network>${flow()}</div><div class="home-flow-controls" role="group" aria-label="${t("flowK")}">${C.flowSteps.map((x, i) => `<button data-home-flow="${i}" aria-pressed="${i === 0}"><span>0${i + 1}</span>${pair(x)}</button>`).join("")}</div><p class="home-flow-explainer" data-home-flow-text>${pair(C.flowDescriptions[0])}</p></div>`;
    return kind === "desktop"
      ? `<div class="support-desktop" data-home-live><div class="home-desktop" data-home-cloud="unified">${cloud("unified")}</div></div>`
      : `<div class="support-mobile" data-home-live><div class="home-handset" data-home-phone="remote">${phone("remote")}</div></div>`;
  }
  function playback(language) {
    locale = language;
    return controls();
  }
  window.ICCHHome = { render, mount, dispose, component, playback };
})();
