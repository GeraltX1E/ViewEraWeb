/* Static concept only: no cloud or industrial control transport. */
const routes = [
  "/",
  "/platform",
  "/products",
  "/technology",
  "/vision",
  "/about",
  "/contact",
];
const C = window.SITE_COPY,
  config = window.SITE_CONFIG;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let lang = "en";
try {
  lang =
    localStorage.getItem("viewera-language") ||
    localStorage.getItem("plc-site-language") ||
    "en";
} catch {}
if (!["en", "zh"].includes(lang)) lang = "en";
let menuOpen = false,
  selectedLayer = 1,
  tick = 0;
let playing = !reducedMotion.matches,
  demoVisible = false,
  demoTimer = null,
  revealObserver,
  demoObserver,
  lastPreviewTrigger;
const pair = (x) => x[lang === "zh" ? 1 : 0],
  t = (k) => pair(C[k]);
const esc = (x) =>
  String(x).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const arrow = '<span aria-hidden="true">↗</span>';
const mark =
  '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 6 15.8 26 27.5 6" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m18 6-6 10" stroke="currentColor" stroke-opacity=".4" stroke-width="3.5" stroke-linecap="round"/></svg>';
const paths = [
  '<path d="M18 43h-4a10 10 0 0 1-1-20 17 17 0 0 1 33-1 11 11 0 0 1 3 21H34"/><path d="M25 50V30m-7 7 7-7 7 7"/>',
  '<rect x="8" y="11" width="48" height="34" rx="5"/><path d="M23 54h18M32 45v9M17 23h11m-11 8h20m-20 7h29"/>',
  '<rect x="22" y="23" width="20" height="18" rx="3"/><rect x="4" y="4" width="13" height="10" rx="2"/><rect x="47" y="4" width="13" height="10" rx="2"/><path d="M10 14v18h12m32-18v18H42M32 41v13M24 54h16"/>',
];
const icon = (i) =>
  `<svg viewBox="0 0 64 64" aria-hidden="true">${paths[i]}</svg>`;
const link = (url, label, primary = false) =>
  `<a href="${url}" class="${primary ? "button" : "text-link"}">${label}${arrow}</a>`;
function demoInterior() {
  return window.PLCStudio.render(lang, playing, tick, reducedMotion.matches);
}
function showcase() {
  return `<div class="showcase reveal"><div class="showcase-caption"><div><span class="eyebrow">PLC STUDIO / ICCH</span><p>${t("productCaption")}</p></div><button class="preview-button" data-preview>${t("preview")} <span aria-hidden="true">⤢</span></button></div><div class="product-stage">${config.previewImage ? `<img class="product-image" src="${esc(config.previewImage)}" alt="${t("previewAlt")}">` : `<div class="demo" data-demo>${demoInterior()}</div>`}</div><p class="concept-note">${t("demoNote")}</p></div>`;
}
function layerDetail() {
  return `<p class="eyebrow">${pair(C.layerEyebrows[selectedLayer])}</p><h3>${pair(C.layerTitles[selectedLayer])}</h3><p>${pair(C.layerBodies[selectedLayer])}</p><span class="layer-meta">${pair(C.layerMeta[selectedLayer])}</span>`;
}
function architecture() {
  return `<div class="architecture reveal" aria-label="${t("archLabel")}"><div class="architecture-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="arch-nodes" role="group" aria-label="${t("archLabel")}">${C.layerNames.map((x, i) => `<button class="arch-node ${selectedLayer === i ? "active" : ""}" data-layer="${i}" aria-pressed="${selectedLayer === i}" aria-controls="layer-detail">${icon(i)}<span>${pair(x)}</span><small>0${i + 1}</small></button>`).join('<span class="arch-connector" aria-hidden="true"><i></i></span>')}</div><div class="architecture-base"><span>ICCH</span><span>${t("concept")}</span></div></div><div class="layer-detail" id="layer-detail">${layerDetail()}</div></div>`;
}
function cta() {
  return `<section class="cta"><div class="wrap reveal"><p class="eyebrow">${t("ctaK")}</p><h2>${t("cta")}</h2><p>${t("ctaBody")}</p>${link("/contact", t("touch"), true)}</div></section>`;
}
function home() {
  return window.ICCHHome.render(lang);
}
function pageHero(eyebrow, title, intro) {
  return `<div class="page-hero wrap"><p class="eyebrow">${eyebrow}</p><h1>${t(title)}</h1><p class="bodycopy">${t(intro)}</p></div>`;
}
function page(route) {
  if (route === "/") return home();
  if (route === "/platform")
    return `${pageHero("VIEWERA / ICCH", "platformTitle", "platformIntro")}<section class="platform-body wrap">${window.ICCHHome.component("network", lang)}<p class="architecture-note">${t("archNote")}</p><div class="section-intro reveal"><h2>${t("responsibilities")}</h2></div><div class="principles">${C.principles.map((x, i) => `<article class="reveal"><span class="number">0${i + 1}</span><h3>${pair(x[0])}</h3><p>${pair(x[1])}</p></article>`).join("")}</div></section>${cta()}`;
  if (route === "/products")
    return `${pageHero("VIEWERA / PRODUCTS", "productsTitle", "productsIntro")}<p class="customization-note">${t("customization")}</p><section class="studio-section"><div class="wrap"><div class="section-intro reveal"><div><p class="eyebrow">${t("studioK")}</p><h2>${t("studioTitle")}</h2></div><p class="bodycopy">${t("studioBody")}</p></div>${showcase()}<div class="studio-traits">${C.studioTraits.map((x) => `<span>${pair(x)}</span>`).join("")}</div></div></section><div class="icch-home icch-support support-products"><section class="wrap"><div class="section-intro reveal"><h2>ICCH Hub Desktop</h2><p class="bodycopy">${t("desktopBody")}</p></div>${window.ICCHHome.component("desktop", lang)}<div class="support-mobile-row"><div class="section-intro reveal"><h2>ICCH Hub Mobile</h2><p class="bodycopy">${t("mobileBody")}</p></div>${window.ICCHHome.component("mobile", lang)}</div>${window.ICCHHome.playback(lang)}<p class="architecture-note">${t("remotePreview")}</p><p class="architecture-note">${t("productRelation")}</p></section></div>${cta()}`;
  if (route === "/technology")
    return `${pageHero("ICCH / TECHNOLOGY", "techTitle", "techIntro")}<section class="technology wrap"><div class="tech-grid">${C.techNames.map((x, i) => `<article class="tech reveal"><span class="number">0${i + 1}</span><h2>${pair(x)}</h2><p>${pair(C.techBodies[i])}</p><span class="tech-status">${t("direction")}</span></article>`).join("")}</div><p class="architecture-note">${t("techNote")}</p></section>${cta()}`;
  if (route === "/vision")
    return `${pageHero("VIEWERA / OUR VISION", "visionTitle", "visionIntro")}<section class="vision-body wrap"><div class="vision-lines">${C.visionItems.map((x, i) => `<article class="reveal"><span class="number">0${i + 1}</span><div><h2>${pair(x[0])}</h2><p>${pair(x[1])}</p></div></article>`).join("")}</div><div class="future-statement reveal"><p class="eyebrow">VIEWERA</p><h2>${t("futureLine")}</h2></div></section>${cta()}`;
  if (route === "/about")
    return `${pageHero("VIEWERA / ABOUT US", "aboutTitle", "aboutIntro")}<section class="vision-body wrap"><div class="vision-lines">${C.aboutItems.map((x, i) => `<article class="reveal"><span class="number">0${i + 1}</span><div><h2>${pair(x[0])}</h2><p>${pair(x[1])}</p></div></article>`).join("")}</div></section>${cta()}`;
  if (route === "/contact") {
    const email = esc(config.email);
    return `${pageHero("VIEWERA / CONTACT", "contactTitle", "contactIntro")}<section class="contact-section wrap"><div class="contact-panel reveal">${mark}<p class="eyebrow">VIEWERA × YOU</p><h2>${t("emailTitle")}</h2>${`<a class="contact-email" href="mailto:${esc(config.email)}">${email}</a><div class="actions">${link("mailto:" + esc(config.email), t("emailAction"), true)}<button class="text-button" id="copy-email">${t("emailCopy")}</button></div><p id="copy-status" role="status"></p>`}</div></section>`;
  }
  return `<div class="page-hero wrap"><p class="eyebrow">404 / VIEWERA</p><h1>${t("notFound")}</h1><p class="bodycopy">${t("notFoundBody")}</p>${link("/", t("backHome"), true)}</div>`;
}
function render() {
  window.ICCHHome.dispose();
  window.PLCStudio.resetRequest();
  const route = location.pathname.replace(/\/$/, "") || "/",
    index = routes.indexOf(route);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  const links = C.nav
    .map(
      (x, i) =>
        `<a href="${routes[i]}" ${route === routes[i] ? 'class="active" aria-current="page"' : ""}>${pair(x)}</a>`,
    )
    .join("");
  document.getElementById("header").innerHTML =
    `<nav class="nav wrap" aria-label="${t("mainNav")}"><a class="brand" href="/" aria-label="ViewEra">${mark}<span>ViewEra</span></a><div class="navlinks ${menuOpen ? "open" : ""}" id="navigation">${links}</div><div class="nav-tools"><button class="language" data-language aria-label="${lang === "zh" ? "Switch to English" : "切换为中文"}"><span ${lang === "en" ? 'class="selected"' : ""}>EN</span><i>/</i><span ${lang === "zh" ? 'class="selected"' : ""}>中文</span></button><button class="menu-button ${menuOpen ? "open" : ""}" aria-label="${t("menu")}" aria-expanded="${menuOpen}" aria-controls="navigation"><i></i><i></i></button></div></nav>`;
  document.getElementById("main").innerHTML = page(route);
  document.getElementById("footer").innerHTML =
    `<div class="wrap"><div class="footer-main"><div><a class="brand" href="/">${mark}<span>ViewEra</span></a><p class="footer-manifesto">${t("footerLine")}</p></div><div class="footer-product"><span class="eyebrow">${t("footerProduct")}</span><span>${t("footerDesktop")}</span><p>${t("footerStatus")}</p></div><div class="footer-links">${links}</div></div><div class="footer-bottom"><span>${t("rights")}</span><button class="language" data-language>English / 简体中文</button></div></div>`;
  document.querySelector(".skip").textContent = t("skip");
  document.querySelector(".close").setAttribute("aria-label", t("close"));
  document.getElementById("preview").setAttribute("aria-label", t("preview"));
  document.title =
    index === 0
      ? lang === "zh"
        ? "ViewEra — ICCH · 让工业控制，突破边界"
        : "ViewEra — ICCH · Control Beyond Boundaries"
      : index > 0
        ? pair(C.nav[index]) + " — ICCH · ViewEra"
        : "404 — ViewEra";
  for (const [selector, value] of [
    ['meta[name="description"]', t("seoDesc")],
    ['meta[property="og:title"]', document.title],
    ['meta[property="og:description"]', t("seoDesc")],
    ['meta[property="og:url"]', config.origin + route],
    ['meta[property="og:locale"]', lang === "zh" ? "zh_CN" : "en_US"],
    ['link[rel="canonical"]', config.origin + route],
  ])
    document
      .querySelector(selector)
      ?.setAttribute(selector.startsWith("link") ? "href" : "content", value);
  setupMotion();
  window.ICCHHome.mount(lang);
}
function refreshDemo() {
  document.querySelectorAll("[data-demo]").forEach((el) => {
    el.innerHTML = demoInterior();
    const nav = el.querySelector(".studio-nav");
    const active = nav?.querySelector('[aria-pressed="true"]');
    if (nav && active && nav.scrollWidth > nav.clientWidth)
      nav.scrollLeft =
        active.offsetLeft -
        nav.offsetLeft -
        nav.clientWidth / 2 +
        active.offsetWidth / 2;
  });
  syncTimer();
}
function refreshArchitecture() {
  document.querySelectorAll("[data-layer]").forEach((b) => {
    const active = Number(b.dataset.layer) === selectedLayer;
    b.setAttribute("aria-pressed", String(active));
    b.classList.toggle("active", active);
  });
  document.querySelectorAll(".layer-detail").forEach((p) => {
    p.innerHTML = layerDetail();
    p.classList.remove("changed");
    void p.offsetWidth;
    p.classList.add("changed");
  });
}
function updateDemoValues() {
  tick++;
  window.PLCStudio.advance();
  window.PLCStudio.update(document, lang, tick);
}
function syncTimer() {
  const allowed =
    playing &&
    !reducedMotion.matches &&
    !document.hidden &&
    (demoVisible || document.getElementById("preview").open) &&
    document.querySelector("[data-demo]");
  if (allowed && !demoTimer) demoTimer = setInterval(updateDemoValues, 1400);
  if (!allowed && demoTimer) {
    clearInterval(demoTimer);
    demoTimer = null;
  }
}
function setupMotion() {
  revealObserver?.disconnect();
  demoObserver?.disconnect();
  demoVisible = false;
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            revealObserver.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("reveal-ready");
      revealObserver.observe(el);
    });
    demoObserver = new IntersectionObserver(
      (entries) => {
        demoVisible = entries.some((x) => x.isIntersecting);
        syncTimer();
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll("[data-demo]")
      .forEach((el) => demoObserver.observe(el));
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("in-view"));
    demoVisible = true;
  }
  syncTimer();
}
function closePreview() {
  document.getElementById("preview").close();
  document.getElementById("preview-content").innerHTML = "";
  syncTimer();
  lastPreviewTrigger?.focus();
}
document.addEventListener("click", async (e) => {
  const target = e.target,
    anchor = target.closest("a");
  if (
    anchor &&
    routes.includes(anchor.getAttribute("href")) &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.shiftKey &&
    !e.altKey &&
    e.button === 0
  ) {
    e.preventDefault();
    history.pushState({}, "", anchor.getAttribute("href"));
    menuOpen = false;
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("main").focus({ preventScroll: true });
    return;
  }
  if (target.closest("[data-language]")) {
    lang = lang === "en" ? "zh" : "en";
    try {
      localStorage.setItem("viewera-language", lang);
    } catch {}
    render();
    return;
  }
  const menu = target.closest(".menu-button");
  if (menu) {
    menuOpen = !menuOpen;
    menu.classList.toggle("open", menuOpen);
    menu.setAttribute("aria-expanded", String(menuOpen));
    document.getElementById("navigation").classList.toggle("open", menuOpen);
    return;
  }
  const layer = target.closest("[data-layer]");
  if (layer) {
    selectedLayer = Number(layer.dataset.layer);
    refreshArchitecture();
    return;
  }
  const studioTab = target.closest("[data-studio-tab]");
  const studioAction = target.closest("[data-studio-action]");
  if (studioTab || studioAction) {
    const selector = studioTab
      ? `[data-studio-tab="${studioTab.dataset.studioTab}"]`
      : `[data-studio-action="${studioAction.dataset.studioAction}"]`;
    const scope = target.closest("dialog") ? "dialog " : "main ";
    if (studioTab)
      window.PLCStudio.selectTab(Number(studioTab.dataset.studioTab));
    else window.PLCStudio.action(studioAction.dataset.studioAction);
    refreshDemo();
    document.querySelector(scope + selector)?.focus({ preventScroll: true });
    return;
  }
  if (target.closest("[data-play]")) {
    if (reducedMotion.matches) {
      updateDemoValues();
      return;
    }
    playing = !playing;
    const inDialog = !!target.closest("dialog");
    refreshDemo();
    document
      .querySelector(`${inDialog ? "dialog " : "main "}[data-play]`)
      ?.focus({ preventScroll: true });
    return;
  }
  if (target.closest("[data-preview]")) {
    lastPreviewTrigger = target.closest("[data-preview]");
    document.getElementById("preview-content").innerHTML = config.previewImage
      ? `<img class="product-image" src="${esc(config.previewImage)}" alt="${t("previewAlt")}">`
      : `<div class="demo" data-demo>${demoInterior()}</div><p class="concept-note">${t("demoNote")}</p>`;
    document.getElementById("preview").showModal();
    syncTimer();
    return;
  }
  if (target.closest(".close")) {
    closePreview();
    return;
  }
  if (target.closest("#copy-email")) {
    try {
      await navigator.clipboard.writeText(config.email);
      document.getElementById("copy-status").textContent = t("copied");
    } catch {
      document.getElementById("copy-status").textContent = t("copyFail");
    }
  }
});
document.addEventListener("change", (e) => {
  const line = e.target.matches("[data-studio-line]");
  const scenario = e.target.matches("[data-studio-scenario]");
  if (!line && !scenario) return;
  const scope = e.target.closest("dialog") ? "dialog " : "main ";
  tick = 0;
  if (line) window.PLCStudio.selectLine(Number(e.target.value));
  else window.PLCStudio.setScenario(e.target.value);
  refreshDemo();
  document
    .querySelector(
      scope + (line ? "[data-studio-line]" : "[data-studio-scenario]"),
    )
    ?.focus({ preventScroll: true });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOpen) {
    menuOpen = false;
    document.getElementById("navigation").classList.remove("open");
    const b = document.querySelector(".menu-button");
    b.classList.remove("open");
    b.setAttribute("aria-expanded", "false");
    b.focus();
  }
});
document.getElementById("preview").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closePreview();
});
document.getElementById("preview").addEventListener("cancel", (e) => {
  e.preventDefault();
  closePreview();
});
document.addEventListener("visibilitychange", syncTimer);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) playing = false;
  refreshDemo();
});
window.addEventListener("popstate", () => {
  menuOpen = false;
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
});
window.addEventListener(
  "scroll",
  () =>
    document
      .getElementById("header")
      .classList.toggle("scrolled", window.scrollY > 12),
  { passive: true },
);
render();
