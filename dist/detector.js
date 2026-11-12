/* PLC Detector product presentation and download links. */
(() => {
  const copy = {
    intro: [
      "A desktop tool for PLC discovery, diagnostics and project monitoring.",
      "用于 PLC 发现、通信诊断和项目监视的桌面工具。",
    ],
    learn: ["Explore PLC Detector", "了解 PLC Detector"],
    download: ["Downloads", "下载"],
    back: ["All products", "全部产品"],
    features: [
      [
        ["Device discovery", "设备发现"],
        ["Find PLCs over USB or Ethernet.", "通过 USB 或以太网查找 PLC。"],
      ],
      [
        ["Diagnostics", "通信诊断"],
        [
          "Verify communication and check the status of supported devices.",
          "验证连接，查看受支持设备的运行状态。",
        ],
      ],
      [
        ["Project monitoring", "项目监视"],
        [
          "Load the project definition to view signals and trends.",
          "载入配套的项目定义，查看数据和趋势。",
        ],
      ],
    ],
    publicRelease: ["Public release", "公开版本"],
    localRelease: ["Local preview", "本地预览"],
    comingSoon: ["Coming Soon", "即将推出"],
    windows: ["Download for Windows", "下载 Windows 版"],
    local: ["Local review only", "仅供本地审阅"],
    localCopy: [
      "This preview serves a local copy of the public installer.",
      "此预览提供公开安装包的本机副本。",
    ],
    pending: ["Public download pending approval", "公开下载等待确认"],
    systems: [
      "Windows 10 or later · 64-bit",
      "Windows 10 或更高版本 · 64 位",
    ],
    downloadNote: ["Features shown are from 0.7.0.", "产品介绍基于 0.7.0。"],
  };

  const translate = (language, pair) => pair[language === "zh" ? 1 : 0];

  function section(language) {
    const t = (key) => translate(language, copy[key]);
    return `<section class="detector-section" id="plc-detector">
      <div class="wrap detector-summary reveal">
        <h2>PLC Detector</h2>
        <div>
          <p class="bodycopy">${t("intro")}</p>
          <a class="text-link detector-link" href="/products/plc-detector">${t("learn")} ↗</a>
        </div>
      </div>
    </section>`;
  }

  function render(language) {
    const t = (key) => translate(language, copy[key]);
    const r = window.PLC_DETECTOR_RELEASE;
    const candidate = window.PLC_DETECTOR_PREVIEW;
    const preview =
      candidate?.version === r.version &&
      candidate?.sha256 === r.sha256 &&
      candidate?.url === "/__preview/downloads/" + r.file
        ? candidate
        : null;
    const publicUrl = r.publicationApproved && r.productionUrl;
    const url = preview?.url || publicUrl;
    const download = url
      ? `<a class="button detector-download" href="${url}" download="${r.file}">${t("windows")} ↓</a>`
      : `<button class="button detector-download" disabled>${t("windows")}</button>`;
    const downloadStatus = publicUrl
      ? t("publicRelease")
      : preview
        ? t("localRelease")
        : t("pending");
    const downloadNote = preview ? t(publicUrl ? "localCopy" : "local") : "";

    return `<div class="detector-page">
      <div class="page-hero wrap">
        <a class="text-link detector-back" href="/products">← ${t("back")}</a>
        <div class="detector-hero-layout">
          <div>
            <h1>PLC Detector</h1>
            <p class="detector-intro">${t("intro")}</p>
            <a class="button" href="#detector-download">${t("download")} ↓</a>
          </div>
          <div class="detector-graphic" aria-hidden="true">
            <span class="detector-orbits"><span class="detector-sweep"></span></span>
            <span class="detector-connection detector-connection-top"></span>
            <span class="detector-connection detector-connection-bottom"></span>
            <span class="detector-connection detector-connection-right"></span>
            <span class="detector-graphic-core"></span>
          </div>
        </div>
      </div>
      <div class="wrap detector-features">
        ${copy.features.map(([title, body]) => `<article>
          <h2>${translate(language, title)}</h2>
          <p>${translate(language, body)}</p>
        </article>`).join("")}
      </div>
      <section class="detector-download-section" id="detector-download">
        <div class="wrap">
          <div class="section-intro reveal">
            <h2>${t("download")}</h2>
            <p class="bodycopy">${t("downloadNote")}</p>
          </div>
          <div class="detector-download-grid">
            <article class="detector-download-card">
              <div class="detector-download-heading">
                <h3>Windows</h3><span class="detector-status${url ? "" : " pending"}">${downloadStatus}</span>
              </div>
              <p class="detector-version">v${r.version} <span>· ${(r.bytes / 1e6).toFixed(1)} MB</span></p>
              <p>${t("systems")}</p>
              ${download}
              ${downloadNote ? `<p class="detector-review-note">${downloadNote}</p>` : ""}
            </article>
            <article class="detector-download-card detector-linux">
              <div class="detector-download-heading">
                <h3>Linux</h3><span class="detector-status pending">${t("comingSoon")}</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>`;
  }

  let stopScan;

  function mountScan() {
    stopScan?.();
    stopScan = null;
    const graphic = document.querySelectorAll(".detector-graphic")[0];
    if (!graphic || !("IntersectionObserver" in window)) return;

    let inView = false;
    const syncScan = () => {
      graphic.classList.toggle("is-scanning", inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncScan();
    });
    observer.observe(graphic);
    document.addEventListener("visibilitychange", syncScan);
    stopScan = () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncScan);
    };
  }

  window.PLCDetector = {
    section,
    render,
    mountScan,
    description: (language) => translate(language, copy.intro),
  };
})();
