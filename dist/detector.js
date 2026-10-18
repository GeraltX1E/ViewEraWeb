/* Real PLC Detector screenshots and verified release metadata; no PLC transport. */
(() => {
  const copy = {
    position: ["PLC Discovery & Communication Tool", "PLC 自动发现与通信工具"],
    intro: [
      "An independent desktop application in the ViewEra / ICCH ecosystem. Discover PLC candidates, identify supported protocols and verify communication before connecting them to your industrial workflow.",
      "ViewEra / ICCH 生态中的独立桌面应用，简化 PLC 设备发现、支持协议识别和通信连接验证，为工业系统接入提供依据。",
    ],
    relation: [
      "PLC Detector handles discovery and communication checks. PLC Studio provides the on-site HMI; ICCH Hub Desktop and Mobile extend the view to remote devices.",
      "PLC Detector 专注设备发现与通信验证；PLC Studio 提供现场 HMI，ICCH Hub Desktop 与 Mobile 将视图延伸到远程设备。",
    ],
    learn: ["Explore PLC Detector", "了解 PLC Detector"],
    download: ["Downloads", "下载"],
    back: ["All products", "全部产品"],
    featureTitle: ["Discovery. With evidence.", "发现设备，验证连接。"],
    features: [
      [
        ["PLC discovery", "PLC 自动发现"],
        [
          "Automatically inspect physical wired IPv4 adapters and probe a bounded local address range. Manual connection settings remain available.",
          "自动检查物理有线 IPv4 网卡，在有限本地地址范围探测设备；同时保留手动连接设置。",
        ],
      ],
      [
        ["Protocol identification", "通信协议识别"],
        [
          "FINS/TCP and FINS/UDP probing with response validation. An open port alone is not treated as a verified PLC.",
          "支持 FINS/TCP 与 FINS/UDP 探测及响应校验；仅端口开放不会被视为 PLC 已验证。",
        ],
      ],
      [
        ["Connection and state verification", "连接与状态验证"],
        [
          "Distinguish network detection, protocol verification and successful PLC status reads. Inspect the evidence for each connection.",
          "区分网络发现、协议验证和 PLC 状态读取成功，逐级展示连接证据。",
        ],
      ],
      [
        ["Data reads and communication tests", "数据读取与通信测试"],
        [
          "Read a field-confirmed DM UInt16 test word and compare readback. A test write requires explicit session and address authorization.",
          "读取现场确认的 DM UInt16 测试字并比较回读结果；测试写入需单独确认会话、地址和授权。",
        ],
      ],
      [
        ["Diagnostics and logs", "通信诊断与日志"],
        [
          "Inspect raw request/response frames, elapsed times and errors. Export communication records for troubleshooting.",
          "查看原始请求与响应、耗时及错误信息，并导出通信记录用于排查。",
        ],
      ],
    ],
    scope: [
      "Current protocol scope: FINS/TCP and FINS/UDP. Discovery is bounded, not a universal PLC scanner. No physical PLC compatibility acceptance has been completed.",
      "当前协议范围为 FINS/TCP 与 FINS/UDP。自动发现范围有限，不是全协议 PLC 扫描器；尚未完成真实 PLC 兼容性验收。",
    ],
    screenshot: [
      "Actual Windows application · Disconnected state",
      "真实 Windows 软件界面 · 未连接设备状态",
    ],
    screenshotNote: [
      "Captured from PLC Detector 0.2.0. The application UI is currently Chinese. No simulated PLC results or connected devices have been added to these screenshots.",
      "截图来自 PLC Detector 0.2.0，软件当前为中文界面；未在截图中加入模拟 PLC 结果或已连接设备。",
    ],
    verification: ["Communication verification screen", "通信验证界面"],
    verificationCaption: [
      "Address confirmation and readback controls, locked while disconnected.",
      "地址确认与读回比较界面；未连接设备时相关操作保持禁用。",
    ],
    diagnostics: ["Advanced connection and diagnostics", "高级连接与诊断设置"],
    diagnosticsCaption: [
      "Manual adapter, IP, FINS protocol, node and timeout settings.",
      "手动配置网卡、IP、FINS 协议、节点及超时参数。",
    ],
    downloadTitle: ["Choose your system.", "选择你的系统。"],
    available: ["Available", "可用"],
    comingSoon: ["Coming Soon", "即将推出"],
    windows: ["Download for Windows", "下载 Windows 版"],
    linux: ["Linux — Coming Soon", "Linux — 即将推出"],
    linuxBody: [
      "A Linux version is planned. No Linux download is available yet.",
      "Linux 版本计划后续推出，暂不提供下载。",
    ],
    local: [
      "Local review only · Not publicly released",
      "仅供本地审阅 · 尚未公开发布",
    ],
    pending: ["Public download pending approval", "公开下载等待确认"],
    systems: [
      "Installer target: Windows 10 or later, 64-bit.",
      "安装器目标系统：Windows 10 或更高版本，64 位。",
    ],
    runtime: [
      "Qt / MinGW runtimes and plugins are included. No Qt SDK is required. Standalone startup was checked on the current Windows machine; other systems and installation/uninstallation still require acceptance testing.",
      "已包含 Qt / MinGW 运行库与插件，无需安装 Qt SDK。已在当前 Windows 电脑验证独立启动；其他系统及安装、卸载仍需验收。",
    ],
    unsigned: [
      "This review installer is not code-signed.",
      "当前审阅安装包未进行代码签名。",
    ],
    checksum: ["SHA-256 checksum", "SHA-256 校验值"],
    releaseNote: [
      "Windows 0.2.0 is available. Linux is coming soon.",
      "Windows 0.2.0 已发布，Linux 版本即将推出。",
    ],
  };
  let locale = "en";
  const pair = (x) => x[locale === "zh" ? 1 : 0],
    t = (k) => pair(copy[k]);
  const image = (name, alt, lazy = true) =>
    `<img src="/assets/plc-detector/${name}.png" width="${name === "diagnostics" ? 820 : 1160}" height="${name === "diagnostics" ? 760 : 900}" alt="${alt}" ${lazy ? 'loading="lazy"' : ""}>`;
  function section(language) {
    locale = language;
    return `<section class="detector-section" id="plc-detector"><div class="wrap"><div class="section-intro reveal"><div><p class="eyebrow">ICCH / PLC DETECTOR</p><h2>PLC Detector</h2><p class="detector-position">${t("position")}</p></div><div><p class="bodycopy">${t("intro")}</p><a class="text-link detector-link" href="/products/plc-detector">${t("learn")} ↗</a></div></div><a class="detector-product-image reveal" href="/products/plc-detector" aria-label="${t("learn")}">${image("discovery", t("screenshot"))}</a><p class="concept-note">${t("screenshot")}</p></div></section>`;
  }
  function render(language) {
    locale = language;
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
    return `<div class="detector-page"><div class="page-hero wrap"><a class="text-link detector-back" href="/products">← ${t("back")}</a><p class="eyebrow">VIEWERA / ICCH</p><h1>PLC Detector</h1><p class="detector-subtitle">${t("position")}</p><p class="bodycopy">${t("intro")}</p><div class="actions"><a class="button" href="#detector-download">${t("download")} ↓</a></div></div><section class="detector-overview wrap"><figure class="detector-product-image reveal">${image("discovery", t("screenshot"), false)}<figcaption>${t("screenshot")}</figcaption></figure><p class="detector-caption">${t("screenshotNote")}</p><p class="detector-relation bodycopy">${t("relation")}</p></section><section class="wrap detector-capabilities"><div class="section-intro reveal"><h2>${t("featureTitle")}</h2></div><div class="principles detector-features">${copy.features.map((x, i) => `<article class="reveal"><span class="number">0${i + 1}</span><h3>${pair(x[0])}</h3><p>${pair(x[1])}</p></article>`).join("")}</div><div class="detector-gallery">${["verification", "diagnostics"].map((k) => `<details><summary>${t(k)} <span aria-hidden="true">+</span></summary><figure>${image(k, t(k))}<figcaption>${t(k + "Caption")}</figcaption></figure></details>`).join("")}</div></section><section class="detector-download-section" id="detector-download"><div class="wrap"><div class="section-intro reveal"><div><p class="eyebrow">PLC DETECTOR / ${t("download")}</p><h2>${t("downloadTitle")}</h2></div><p class="bodycopy">${t("releaseNote")}</p></div><div class="detector-download-grid"><article class="detector-download-card"><div class="detector-download-heading"><h3>Windows</h3><span class="detector-status">${t("available")}</span></div><p class="detector-version">v${r.version} <span>· x64 · ${(r.bytes / 1e6).toFixed(1)} MB</span></p><p>${t("systems")}</p>${download}<p class="detector-review-note">${preview ? t("local") : publicUrl ? "" : t("pending")}</p></article><article class="detector-download-card detector-linux"><div class="detector-download-heading"><h3>Linux</h3><span class="detector-status pending">${t("comingSoon")}</span></div><p>${t("linuxBody")}</p><button class="button" disabled>${t("linux")}</button></article></div></div></section></div>`;
  }
  window.PLCDetector = {
    section,
    render,
    description: (language) => {
      locale = language;
      return t("intro");
    },
  };
})();
