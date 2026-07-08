const pages = [
  { id: "dashboard", label: "首页概览" },
  { id: "writer", label: "一键写作" },
  { id: "rewrite", label: "一键改写" },
  { id: "benefits", label: "会员权益" },
  { id: "orders", label: "订单记录" },
  { id: "invite", label: "邀请奖励" },
  { id: "settings", label: "账户设置" },
  { id: "support", label: "客服中心" },
];

const navList = document.querySelector("#navList");
const pageTitle = document.querySelector("#pageTitle");
const app = document.querySelector("#app");
const appShell = document.querySelector(".app-shell");
const sidebar = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-button");
const toastRegion = document.querySelector("#toastRegion");
const modalRoot = document.querySelector("#modalRoot");
const validRoutes = new Set(pages.map((page) => page.id));
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const dashboardData = {
  user: {
    remainingCredits: 86,
    memberStatus: "Pro 会员",
    expirationDate: "2026-12-31",
    drafts: 12,
  },
  recentTasks: [
    {
      title: "小红书种草文案：智能护眼台灯",
      type: "一键写作",
      status: "已完成",
      time: "今天 09:42",
      route: "writer",
      actionLabel: "继续写作",
    },
    {
      title: "公众号开头改写：AI 面试陪练",
      type: "一键改写",
      status: "待优化",
      time: "昨天 18:10",
      route: "rewrite",
      actionLabel: "去改写",
    },
    {
      title: "短视频口播脚本：暑期课程招新",
      type: "一键写作",
      status: "草稿",
      time: "周一 14:25",
      route: "writer",
      actionLabel: "打开草稿",
    },
  ],
  quickActions: [
    { title: "新建写作", description: "从主题生成完整内容", route: "writer" },
    { title: "智能改写", description: "润色、扩写或换风格", route: "rewrite" },
    { title: "升级会员", description: "查看额度与专属权益", route: "benefits" },
    { title: "联系客服", description: "处理订单与使用问题", route: "support" },
  ],
  usageTrend: [
    { label: "周一", value: 34 },
    { label: "周二", value: 52 },
    { label: "周三", value: 46 },
    { label: "周四", value: 78 },
    { label: "周五", value: 64 },
    { label: "周六", value: 38 },
    { label: "周日", value: 58 },
  ],
};

const writerTracks = [
  {
    id: "public-account-growth",
    title: "公众号增长运营",
    description: "适合私域增长、社群转化、活动复盘类长文。",
    hotTopic: "匹配到热点：年中增长复盘、社群精细化运营、AI 提效案例。",
    angle: "从运营负责人视角拆解增长动作，把经验写成可复用清单。",
  },
  {
    id: "industry-insight",
    title: "行业趋势观察",
    description: "适合科技、教育、消费、职场等行业解读。",
    hotTopic: "匹配到热点：AI 应用落地、低成本获客、组织效率升级。",
    angle: "用趋势变化引出具体机会，帮助读者判断下一步怎么做。",
  },
  {
    id: "personal-brand",
    title: "个人 IP 表达",
    description: "适合创始人、顾问、讲师、知识博主发声。",
    hotTopic: "匹配到热点：专业人设建立、内容信任感、长期主义。",
    angle: "用真实经历做开场，把观点写得有温度、有立场。",
  },
  {
    id: "product-launch",
    title: "产品活动推广",
    description: "适合课程、工具、训练营、服务套餐发布。",
    hotTopic: "匹配到热点：暑期活动、轻量化服务、限时权益组合。",
    angle: "先讲用户痛点，再自然引出产品价值和行动入口。",
  },
];

const writerTones = [
  { id: "professional", label: "专业可信", description: "结构清晰，适合品牌公众号。" },
  { id: "warm", label: "温暖陪伴", description: "语气亲近，适合私域和个人 IP。" },
  { id: "sharp", label: "犀利观点", description: "开头有冲突，适合趋势评论。" },
  { id: "practical", label: "干货清单", description: "步骤明确，适合运营方法论。" },
];

const writerSteps = ["赛道+热点匹配", "自动选题", "AI写作", "自动改写", "自动配图", "AI排版"];
const rewriteStyles = [
  { id: "polished", label: "精炼润色", description: "保留原意，提升表达质感和阅读节奏。" },
  { id: "viral", label: "爆款开头", description: "强化开场钩子，适合公众号吸引点击。" },
  { id: "warm", label: "温暖叙事", description: "语气更有人情味，适合私域和个人 IP。" },
  { id: "practical", label: "干货清单", description: "拆成清晰步骤，方便读者收藏转发。" },
];
const rewriteSteps = ["自动改写", "自动配图", "AI排版"];
const wordCountOptions = ["800字", "1200字", "1600字", "2000字"];
const imageCountOptions = ["1张", "2张", "3张", "4张", "5张"];
const membershipAccess = {
  hasImageMembership: false,
};
const wordsPerCredit = 100;
const articleEstimateWords = 1200;
const textPointsPerArticle = articleEstimateWords / wordsPerCredit;
const imagePointsPerImage = 2;
const imagesPerEstimatedArticle = 3;

const writerState = {
  selectedTrack: writerTracks[0].id,
  selectedTone: writerTones[0].id,
  selectedWordCount: wordCountOptions[1],
  selectedImageCount: imageCountOptions[0],
  status: "idle",
  currentStepIndex: -1,
  generatedArticle: null,
};

const rewriteState = {
  publicAccountName: "",
  sourceArticle: "",
  selectedStyle: rewriteStyles[0].id,
  selectedWordCount: wordCountOptions[1],
  selectedImageCount: imageCountOptions[0],
  status: "idle",
  currentStepIndex: -1,
  rewrittenArticle: null,
};

const membershipPlans = [
  {
    id: "trial-no-image",
    name: "尝鲜版(日卡)",
    price: "¥3.99",
    credits: "60 积分",
    estimate: "大约生成 5 篇 1200字文章",
    target: "无图会员，适合短期体验与功能试用",
  },
  {
    id: "personal-no-image",
    name: "个人版",
    price: "¥29.9",
    credits: "720 积分",
    estimate: "大约生成 60 篇 1200字文章",
    target: "无图会员，适合个人账号稳定更新",
  },
  {
    id: "matrix-no-image",
    name: "矩阵版",
    price: "¥59.9",
    credits: "1800 积分",
    estimate: "大约生成 150 篇 1200字文章",
    target: "无图会员，适合多账号轻量矩阵运营",
  },
  {
    id: "matrix-high-no-image",
    name: "矩阵版(高配版)",
    price: "¥119.9",
    credits: "3600 积分",
    estimate: "大约生成 300 篇 1200字文章",
    target: "无图会员，适合多账号矩阵运营",
    recommended: true,
  },
  {
    id: "team-no-image",
    name: "团队版",
    price: "¥469",
    credits: "14400 积分",
    estimate: "大约生成 1200 篇 1200字文章",
    target: "无图会员，适合团队批量内容生产",
  },
];

const imageMembershipPlans = [
  {
    id: "trial-image",
    name: "尝鲜版(日卡)配图会员",
    price: "¥3.99",
    credits: "90 积分",
    estimate: "大约生成 5 篇 1200字文章 + 每篇3张图片",
    target: "适合短期体验自动配图能力",
  },
  {
    id: "personal-image",
    name: "个人版配图会员",
    price: "¥49.9",
    credits: "1080 积分",
    estimate: "大约生成 60 篇 1200字文章 + 每篇3张图片",
    target: "适合个人账号写作并自动配图",
  },
  {
    id: "matrix-image",
    name: "矩阵版配图会员",
    price: "¥119",
    credits: "2700 积分",
    estimate: "大约生成 150 篇 1200字文章 + 每篇3张图片",
    target: "适合多账号轻量矩阵产文配图",
  },
  {
    id: "matrix-high-image",
    name: "矩阵版配图会员(高配版)",
    price: "¥199",
    credits: "5400 积分",
    estimate: "大约生成 300 篇 1200字文章 + 每篇3张图片",
    target: "适合多账号矩阵批量产文配图",
    recommended: true,
  },
  {
    id: "team-image",
    name: "团队版配图会员",
    price: "¥499",
    credits: "21600 积分",
    estimate: "大约生成 1200 篇 1200字文章 + 每篇3张图片",
    target: "适合团队高频内容生产和配图",
  },
];

const pointsRules = [
  { title: "每日登录", detail: "每天首次登录赠送 2 积分，可兑换写作次数。" },
  { title: "邀请好友", detail: "好友完成首单后，双方各得 30 积分。" },
  { title: "会员消费", detail: "每消费 1 元累计 1 积分，订单完成后自动入账。" },
];

const orderRecords = [
  { id: "GJ20260708001", packageName: "矩阵版无图会员", amount: "¥119.90", status: "已支付", time: "2026-07-08 10:24" },
  { id: "GJ20260618007", packageName: "个人版无图会员", amount: "¥29.90", status: "已支付", time: "2026-06-18 16:42" },
  { id: "GJ20260602003", packageName: "团队版无图会员", amount: "¥469.00", status: "待确认", time: "2026-06-02 09:18" },
];

const inviteState = {
  code: "GUIJI86",
  link: "https://guiji.example.com/invite?code=GUIJI86",
};

const inviteRewards = [
  { name: "王同学", reward: "一级好友返现 ¥18.50", status: "待发放", time: "2026-07-06" },
  { name: "内容运营小林", reward: "二级好友返现 ¥6.20", status: "待结算", time: "2026-07-03" },
  { name: "AIGC 研习社", reward: "三级好友返现 ¥2.90", status: "待发放", time: "2026-06-29" },
];

const inviteRewardRules = [
  {
    title: "一级好友（直邀）",
    detail: "您成功邀请的好友（即第1代），每月消费金额得5%作为你得个人邀请返现金额。",
  },
  {
    title: "二级好友（间邀）",
    detail: "您的一级好友再邀请的新用户（即第2代)，每月消费金额得2%作为你得个人邀请返现金额。",
  },
  {
    title: "三级好友",
    detail: "您的二级好友邀请的新用户（即第3代）,每月消费金额得1%作为你得个人邀请返现金额。",
  },
];

const invitePayoutRules = [
  "当月奖励在下月25日发放，可以申请提现，也可以进行会员充值抵扣。",
  "会员失效后，所有得邀请清单全部清零、奖金也会清零。",
];

const settingsState = {
  nickname: "硅基创作者",
  email: "creator@guiji.example",
  password: "",
  notifyProduct: true,
  notifyOrder: true,
  notifyWeekly: false,
};

const supportFaqs = [
  {
    id: "credits",
    question: "写作次数什么时候扣除？",
    answer: "任务生成成功后扣除 1 次，预览、复制、保存草稿不会重复扣除。",
  },
  {
    id: "invoice",
    question: "如何申请发票？",
    answer: "在订单记录中点击申请发票，客服会在 1 个工作日内确认开票信息。",
  },
  {
    id: "refund",
    question: "会员可以退款吗？",
    answer: "虚拟页面不会产生真实扣款；正式服务将按购买页展示的规则处理。",
  },
];

const supportState = {
  openFaqId: supportFaqs[0].id,
};

let writerTimers = [];
let rewriteTimers = [];
let currentRoute = getRouteFromHash();
let modalOpener = null;
let drawerOpener = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function getCurrentPage() {
  return pages.find((page) => page.id === currentRoute) || pages[0];
}

function getRouteFromHash() {
  let hashRoute = "";

  try {
    hashRoute = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  } catch {
    hashRoute = "";
  }

  return validRoutes.has(hashRoute) ? hashRoute : "dashboard";
}

function isValidRoute(route) {
  return validRoutes.has(route);
}

function setDrawerOpen(isOpen, options = {}) {
  const wasOpen = document.body.classList.contains("nav-open");

  document.body.classList.toggle("nav-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));

  if (isOpen && !wasOpen) {
    drawerOpener = document.activeElement instanceof HTMLElement ? document.activeElement : menuButton;
    const initialTarget = sidebar.querySelector(".mobile-close, .nav-item");
    initialTarget?.focus({ preventScroll: true });
  }

  if (!isOpen && wasOpen && options.restoreFocus !== false) {
    const restoreTarget = drawerOpener || menuButton;
    restoreTarget?.focus({ preventScroll: true });
    drawerOpener = null;
  }
}

function navigateTo(route) {
  if (!isValidRoute(route)) return;

  setDrawerOpen(false, { restoreFocus: false });

  if (window.location.hash !== `#${route}`) {
    window.location.hash = route;
    return;
  }

  if (currentRoute !== route) {
    currentRoute = route;
    render();
  }

  app.focus({ preventScroll: true });
}

function clearWriterTimers() {
  writerTimers.forEach((timerId) => window.clearTimeout(timerId));
  writerTimers = [];
}

function clearRewriteTimers() {
  rewriteTimers.forEach((timerId) => window.clearTimeout(timerId));
  rewriteTimers = [];
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message || "操作已记录";
  toastRegion.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function startWriterGeneration() {
  clearWriterTimers();

  writerState.status = "running";
  writerState.currentStepIndex = 0;
  writerState.generatedArticle = null;
  renderWriter();

  writerSteps.forEach((_, index) => {
    const timerId = window.setTimeout(() => {
      if (currentRoute !== "writer" || writerState.status !== "running") return;

      writerState.currentStepIndex = index;

      if (index === writerSteps.length - 1) {
        const finishTimer = window.setTimeout(() => {
          if (currentRoute !== "writer" || writerState.status !== "running") return;

          writerState.status = "complete";
          writerState.currentStepIndex = writerSteps.length - 1;
          writerState.generatedArticle = buildArticle(
            getSelectedWriterTrack(),
            getSelectedWriterTone(),
            writerState.selectedWordCount,
            membershipAccess.hasImageMembership ? writerState.selectedImageCount : "无图会员",
          );
          renderWriter();
          showToast("文章已生成");
        }, 420);

        writerTimers.push(finishTimer);
      }

      renderWriter();
    }, index * 520);

    writerTimers.push(timerId);
  });
}

async function copyWriterArticle() {
  const articleText = writerState.generatedArticle?.text;

  if (!articleText) {
    showToast("暂无可复制的文章");
    return;
  }

  try {
    await navigator.clipboard.writeText(articleText);
    showToast("文章已复制");
  } catch {
    const copyField = document.createElement("textarea");
    copyField.value = articleText;
    copyField.setAttribute("readonly", "");
    copyField.className = "sr-only-copy-field";
    document.body.append(copyField);
    copyField.select();

    try {
      const copied = document.execCommand("copy");
      showToast(copied ? "文章已复制" : "复制受限，请手动选中文章内容复制");
    } catch {
      showToast("复制受限，请手动选中文章内容复制");
    } finally {
      copyField.remove();
    }
  }
}

function getSelectedRewriteStyle() {
  return rewriteStyles.find((style) => style.id === rewriteState.selectedStyle) || rewriteStyles[0];
}

function validateRewriteInputs() {
  if (!rewriteState.publicAccountName.trim() || !rewriteState.sourceArticle.trim()) {
    showToast("请先填写公众号名称和原文内容");
    return false;
  }

  return true;
}

function buildRewriteArticle(style, wordCount, imageCount) {
  const accountName = rewriteState.publicAccountName.trim();
  const normalizedSource = rewriteState.sourceArticle.trim().replace(/\s+/g, " ");
  const sourceExcerpt = normalizedSource.length > 72 ? `${normalizedSource.slice(0, 72)}...` : normalizedSource;
  const title = `${accountName}｜${style.label}改写稿`;
  const paragraphs = [
    `目标字数：${wordCount}。这版会按公众号阅读节奏控制篇幅，保留重点信息，减少无效铺垫。`,
    `开场建议先抓住原文的核心冲突：「${sourceExcerpt}」这部分可以前置成更直接的问题，让读者一眼知道为什么要继续看。`,
    `正文保留原文观点，但把表达拆成更清晰的三层：先讲背景，再给判断，最后落到可执行建议。这样既不改变原意，也能让信息更容易被收藏。`,
    `按照「${style.label}」风格，句子会更克制、更有节奏。重点段落建议用短句承接，避免连续堆叠概念，让读者在手机上扫读也能抓住重点。`,
    `结尾可以加一句轻量互动：如果你也在处理类似内容，欢迎留言你的选题方向。这样既自然收束，也能为 ${accountName} 留下后续沟通入口。`,
  ];
  const text = [title, ...paragraphs].join("\n\n");

  return {
    title,
    wordCount,
    imageCount,
    paragraphs,
    text,
    html: `<h1>${escapeHtml(title)}</h1>${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}`,
  };
}

function startRewriteGeneration() {
  if (!validateRewriteInputs()) return;

  clearRewriteTimers();

  rewriteState.status = "running";
  rewriteState.currentStepIndex = 0;
  rewriteState.rewrittenArticle = null;
  renderRewrite();

  rewriteSteps.forEach((_, index) => {
    const timerId = window.setTimeout(() => {
      if (currentRoute !== "rewrite" || rewriteState.status !== "running") return;

      rewriteState.currentStepIndex = index;

      if (index === rewriteSteps.length - 1) {
        const finishTimer = window.setTimeout(() => {
          if (currentRoute !== "rewrite" || rewriteState.status !== "running") return;

          rewriteState.status = "complete";
          rewriteState.currentStepIndex = rewriteSteps.length - 1;
          rewriteState.rewrittenArticle = buildRewriteArticle(
            getSelectedRewriteStyle(),
            rewriteState.selectedWordCount,
            membershipAccess.hasImageMembership ? rewriteState.selectedImageCount : "无图会员",
          );
          renderRewrite();
          showToast("改写文章已生成");
        }, 360);

        rewriteTimers.push(finishTimer);
      }

      renderRewrite();
    }, index * 460);

    rewriteTimers.push(timerId);
  });
}

async function copyRewriteArticle() {
  const articleText = rewriteState.rewrittenArticle?.text;

  if (!articleText) {
    showToast("暂无可复制的改写文章");
    return;
  }

  try {
    await navigator.clipboard.writeText(articleText);
    showToast("改写文章已复制");
  } catch {
    const copyField = document.createElement("textarea");
    copyField.value = articleText;
    copyField.setAttribute("readonly", "");
    copyField.className = "sr-only-copy-field";
    document.body.append(copyField);
    copyField.select();

    try {
      const copied = document.execCommand("copy");
      showToast(copied ? "改写文章已复制" : "复制受限，请手动选中文章内容复制");
    } catch {
      showToast("复制受限，请手动选中文章内容复制");
    } finally {
      copyField.remove();
    }
  }
}

async function copyTextWithFallback(text, successMessage) {
  if (!text) {
    showToast("暂无可复制内容");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
    return;
  } catch {
    const copyField = document.createElement("textarea");
    copyField.value = text;
    copyField.setAttribute("readonly", "");
    copyField.className = "sr-only-copy-field";
    document.body.append(copyField);
    copyField.select();

    try {
      const copied = document.execCommand("copy");
      showToast(copied ? successMessage : "复制已准备好，请手动粘贴使用");
    } catch {
      showToast("复制已准备好，请手动粘贴使用");
    } finally {
      copyField.remove();
    }
  }
}

function setShellModalState(isOpen) {
  if (!appShell) return;

  if (isOpen) {
    appShell.setAttribute("aria-hidden", "true");
    if ("inert" in appShell) appShell.inert = true;
    return;
  }

  appShell.removeAttribute("aria-hidden");
  if ("inert" in appShell) appShell.inert = false;
}

function closeModal() {
  if (!modalRoot.hasChildNodes()) return;

  modalRoot.innerHTML = "";
  setShellModalState(false);

  if (modalOpener instanceof HTMLElement) {
    modalOpener.focus({ preventScroll: true });
  }
  modalOpener = null;
}

function showModal(title, body) {
  modalOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  setShellModalState(true);

  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body);

  modalRoot.innerHTML = `
    <div class="modal-overlay" data-action="close-modal">
      <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modalTitle" tabindex="-1">
        <div class="modal-header">
          <h2 id="modalTitle">${safeTitle}</h2>
          <button class="modal-close" type="button" aria-label="关闭弹窗" data-action="close-modal">×</button>
        </div>
        <p>${safeBody}</p>
      </section>
    </div>
  `;

  const firstFocusable = modalRoot.querySelector(focusableSelector);
  const fallbackTarget = modalRoot.querySelector(".modal-dialog");
  (firstFocusable || fallbackTarget)?.focus({ preventScroll: true });
}

function trapModalTab(event) {
  const dialog = modalRoot.querySelector(".modal-dialog");
  if (!dialog) return;

  const focusables = [...dialog.querySelectorAll(focusableSelector)].filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );

  if (!focusables.length) {
    event.preventDefault();
    dialog.focus({ preventScroll: true });
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}

function renderNav() {
  navList.innerHTML = pages
    .map((page) => {
      const isActive = page.id === currentRoute;
      const safeId = escapeAttr(page.id);
      const safeLabel = escapeHtml(page.label);

      return `
        <button class="nav-item ${isActive ? "active" : ""}" type="button" data-route="${safeId}"${isActive ? ' aria-current="page"' : ""}>
          <span>${safeLabel}</span>
          <span class="nav-dot" aria-hidden="true"></span>
        </button>
      `;
    })
    .join("");
}

function renderDashboard() {
  const metrics = [
    { label: "本月剩余额度", value: `${dashboardData.user.remainingCredits} 次`, note: "可用于写作与改写" },
    { label: "会员状态", value: dashboardData.user.memberStatus, note: `有效期至 ${dashboardData.user.expirationDate}` },
    { label: "近期任务", value: `${dashboardData.recentTasks.length} 个`, note: "最近 7 天内容记录" },
    { label: "保存草稿", value: `${dashboardData.user.drafts} 篇`, note: "可随时继续编辑" },
  ];

  const metricCards = metrics
    .map(
      (metric) => `
        <article class="metric-card dashboard-metric">
          <span>${escapeHtml(metric.label)}</span>
          <strong>${escapeHtml(metric.value)}</strong>
          <p>${escapeHtml(metric.note)}</p>
        </article>
      `,
    )
    .join("");

  const recentTasks = dashboardData.recentTasks
    .map(
      (task) => `
        <article class="task-item">
          <div class="task-main">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-meta">
              <span>${escapeHtml(task.type)}</span>
              <span>${escapeHtml(task.time)}</span>
            </div>
          </div>
          <span class="status-pill">${escapeHtml(task.status)}</span>
          <button class="secondary-button task-action" type="button" data-route="${escapeAttr(task.route)}">${escapeHtml(task.actionLabel)}</button>
        </article>
      `,
    )
    .join("");

  const quickActions = dashboardData.quickActions
    .map(
      (action) => `
        <button class="quick-action" type="button" data-route="${escapeAttr(action.route)}">
          <span>${escapeHtml(action.title)}</span>
          <small>${escapeHtml(action.description)}</small>
        </button>
      `,
    )
    .join("");

  const maxTrendValue = Math.max(...dashboardData.usageTrend.map((item) => item.value), 1);
  const trendBars = dashboardData.usageTrend
    .map((item) => {
      const height = Math.max(18, Math.round((item.value / maxTrendValue) * 100));

      return `
        <div class="trend-item">
          <div class="trend-track" aria-label="${escapeAttr(`${item.label} 使用 ${item.value} 次`)}">
            <span class="trend-bar" style="height: ${height}%"></span>
          </div>
          <span>${escapeHtml(item.label)}</span>
        </div>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="dashboard-overview" aria-label="首页概览">
      <div class="dashboard-hero">
        <div>
          <div class="eyebrow">欢迎回来</div>
          <h2>陈同学，今天也可以把想法变成内容。</h2>
          <p>${escapeHtml(dashboardData.user.memberStatus)} · 有效期至 ${escapeHtml(dashboardData.user.expirationDate)}</p>
        </div>
        <button class="primary-button inline-action" type="button" data-route="writer">开始写作</button>
      </div>

      <div class="metrics-grid dashboard-metrics" aria-label="概览指标">
        ${metricCards}
      </div>

      <div class="dashboard-grid">
        <section class="dashboard-panel recent-panel" aria-labelledby="recentTasksTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">近期任务</div>
              <h3 id="recentTasksTitle">最近处理的内容</h3>
            </div>
            <button class="secondary-button inline-action" type="button" data-action="virtual" data-message="任务中心即将开放">查看全部</button>
          </div>
          <div class="task-list">
            ${recentTasks}
          </div>
        </section>

        <section class="dashboard-panel" aria-labelledby="quickActionsTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">快捷入口</div>
              <h3 id="quickActionsTitle">常用操作</h3>
            </div>
          </div>
          <div class="quick-action-grid">
            ${quickActions}
          </div>
        </section>

        <section class="dashboard-panel trend-panel" aria-labelledby="usageTrendTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">使用趋势</div>
              <h3 id="usageTrendTitle">本周额度消耗</h3>
            </div>
          </div>
          <div class="trend-chart" aria-label="本周额度使用趋势">
            ${trendBars}
          </div>
        </section>
      </div>
    </section>
  `;
}

function getSelectedWriterTrack() {
  return writerTracks.find((track) => track.id === writerState.selectedTrack) || writerTracks[0];
}

function getSelectedWriterTone() {
  return writerTones.find((tone) => tone.id === writerState.selectedTone) || writerTones[0];
}

function buildArticle(track, tone, wordCount, imageCount) {
  const title = `${track.title}：把热点写成用户愿意收藏的内容`;
  const paragraphs = [
    `目标字数：${wordCount}。内容会围绕这个篇幅安排开头、正文层次和结尾行动，不额外拉长。`,
    `最近适合切入的内容方向，是围绕「${track.hotTopic.replace("匹配到热点：", "")}」做一次更贴近用户的拆解。读者并不缺信息，缺的是能帮他们判断优先级的解释。`,
    `这篇文章可以从「${track.angle}」展开。先点出用户正在面对的真实场景，再给出三条可执行建议：明确目标人群、拆出一个小切口、把行动路径写到足够具体。`,
    `在${tone.label}的表达下，文章不需要堆砌概念。每一段都服务于一个问题：用户为什么现在要看、看完能带走什么、下一步可以怎么试。`,
    "结尾建议放一个轻量行动：邀请读者留言自己的内容赛道，或领取一份选题清单。这样既保留互动，也能自然沉淀潜在用户。",
  ];

  return {
    title,
    wordCount,
    imageCount,
    text: [title, ...paragraphs].join("\n\n"),
    paragraphs,
  };
}

function renderWriter() {
  const selectedTrack = getSelectedWriterTrack();
  const selectedTone = getSelectedWriterTone();
  const isRunning = writerState.status === "running";

  const trackCards = writerTracks
    .map((track) => {
      const isSelected = track.id === writerState.selectedTrack;

      return `
        <button class="writer-track-card ${isSelected ? "selected" : ""}" type="button" data-action="select-writer-track" data-track-id="${escapeAttr(track.id)}" aria-pressed="${isSelected}">
          <span class="writer-track-title">${escapeHtml(track.title)}</span>
          <span class="writer-track-desc">${escapeHtml(track.description)}</span>
        </button>
      `;
    })
    .join("");

  const toneOptions = writerTones
    .map(
      (tone) => `
        <option value="${escapeAttr(tone.id)}"${tone.id === writerState.selectedTone ? " selected" : ""}>
          ${escapeHtml(tone.label)}
        </option>
      `,
    )
    .join("");
  const writerWordCountOptions = wordCountOptions
    .map(
      (wordCount) => `
        <option value="${escapeAttr(wordCount)}"${wordCount === writerState.selectedWordCount ? " selected" : ""}>
          ${escapeHtml(wordCount)}
        </option>
      `,
    )
    .join("");
  const writerImageCountOptions = imageCountOptions
    .map(
      (imageCount) => `
        <option value="${escapeAttr(imageCount)}"${imageCount === writerState.selectedImageCount ? " selected" : ""}>
          ${escapeHtml(imageCount)}
        </option>
      `,
    )
    .join("");
  const imageCountHelp = membershipAccess.hasImageMembership
    ? "配图会员可选择 1-5 张配图"
    : "无图会员不可选择配图数量";

  const progressSteps = writerSteps
    .map((step, index) => {
      let stateClass = "waiting";
      let stateLabel = "等待中";

      if (writerState.status === "complete" || (isRunning && index < writerState.currentStepIndex)) {
        stateClass = "done";
        stateLabel = "已完成";
      } else if (isRunning && index === writerState.currentStepIndex) {
        stateClass = "active";
        stateLabel = "进行中";
      }

      return `
        <li class="writer-step ${stateClass}">
          <span class="writer-step-index">${index + 1}</span>
          <span class="writer-step-name">${escapeHtml(step)}</span>
          <span class="writer-step-state">${escapeHtml(stateLabel)}</span>
        </li>
      `;
    })
    .join("");

  const articlePanel = writerState.generatedArticle
    ? `
      <article class="writer-article">
        <div class="writer-article-header">
          <div>
            <div class="eyebrow">生成结果</div>
            <h3>${escapeHtml(writerState.generatedArticle.title)}</h3>
          </div>
          <span class="status-pill">${escapeHtml(selectedTone.label)}</span>
          <span class="status-pill">${escapeHtml(writerState.generatedArticle.wordCount)}</span>
          <span class="status-pill">${escapeHtml(writerState.generatedArticle.imageCount)}</span>
        </div>
        <div class="writer-article-body">
          ${writerState.generatedArticle.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
      </article>
      <div class="writer-result-actions" aria-label="结果操作">
        <button class="secondary-button inline-action" type="button" data-action="copy-writer-article">复制文章</button>
        <button class="secondary-button inline-action" type="button" data-action="export-writer-word">导出 Word</button>
        <button class="secondary-button inline-action" type="button" data-action="save-writer-draft">保存草稿</button>
        <button class="primary-button inline-action" type="button" data-action="regenerate-writer">重新生成</button>
      </div>
    `
    : `
      <div class="writer-empty-state">
        <strong>${isRunning ? "正在生成文章" : "还没有生成内容"}</strong>
        <p>${isRunning ? "硅基智写正在完成选题、写作、改写、配图和排版。" : "选择赛道和输出风格后，点击开始即可生成一篇可复制、可导出的公众号文章。"}</p>
      </div>
    `;

  app.innerHTML = `
    <section class="writer-page" aria-label="一键写作">
      <div class="writer-layout">
        <section class="writer-panel writer-config" aria-labelledby="writerConfigTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">一键写作</div>
              <h2 id="writerConfigTitle">选择赛道和表达风格</h2>
            </div>
          </div>

          <div class="writer-field">
            <label>内容赛道</label>
            <div class="writer-track-grid">
              ${trackCards}
            </div>
          </div>

          <div class="writer-hotspot">
            <div class="eyebrow">热点匹配说明</div>
            <strong>${escapeHtml(selectedTrack.hotTopic)}</strong>
            <p>${escapeHtml(selectedTrack.angle)}</p>
          </div>

          <div class="writer-field">
            <label for="writerTone">输出风格</label>
            <select id="writerTone" class="writer-select" data-action="select-writer-tone"${isRunning ? " disabled" : ""}>
              ${toneOptions}
            </select>
            <p>${escapeHtml(selectedTone.description)}</p>
          </div>

          <div class="writer-field">
            <label for="writerWordCount">选择字数</label>
            <select id="writerWordCount" class="writer-select" data-action="select-writer-word-count"${isRunning ? " disabled" : ""}>
              ${writerWordCountOptions}
            </select>
            <p>生成结果会按所选目标字数组织文章篇幅。</p>
          </div>

          <div class="writer-field">
            <label for="writerImageCount">选择配图数量</label>
            <select id="writerImageCount" class="writer-select" data-action="select-writer-image-count"${isRunning || !membershipAccess.hasImageMembership ? " disabled" : ""}>
              ${writerImageCountOptions}
            </select>
            <p>${escapeHtml(imageCountHelp)}</p>
          </div>

          <button class="primary-button writer-start-button" type="button" data-action="start-writer-generation"${isRunning ? " disabled" : ""}>
            ${isRunning ? "生成中..." : "开始一键写作"}
          </button>
        </section>

        <section class="writer-panel" aria-labelledby="writerProgressTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">生成流程</div>
              <h2 id="writerProgressTitle">六步自动完成</h2>
            </div>
          </div>
          <ol class="writer-progress">
            ${progressSteps}
          </ol>
        </section>
      </div>

      <section class="writer-panel writer-result" aria-labelledby="writerResultTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">文章面板</div>
            <h2 id="writerResultTitle">公众号文章结果</h2>
          </div>
        </div>
        ${articlePanel}
      </section>
    </section>
  `;
}

function renderRewrite() {
  const selectedStyle = getSelectedRewriteStyle();
  const isRunning = rewriteState.status === "running";
  const styleOptions = rewriteStyles
    .map(
      (style) => `
        <option value="${escapeAttr(style.id)}"${style.id === rewriteState.selectedStyle ? " selected" : ""}>
          ${escapeHtml(style.label)}
        </option>
      `,
    )
    .join("");
  const rewriteWordCountOptions = wordCountOptions
    .map(
      (wordCount) => `
        <option value="${escapeAttr(wordCount)}"${wordCount === rewriteState.selectedWordCount ? " selected" : ""}>
          ${escapeHtml(wordCount)}
        </option>
      `,
    )
    .join("");
  const rewriteImageCountOptions = imageCountOptions
    .map(
      (imageCount) => `
        <option value="${escapeAttr(imageCount)}"${imageCount === rewriteState.selectedImageCount ? " selected" : ""}>
          ${escapeHtml(imageCount)}
        </option>
      `,
    )
    .join("");
  const imageCountHelp = membershipAccess.hasImageMembership
    ? "配图会员可选择 1-5 张配图"
    : "无图会员不可选择配图数量";
  const progressSteps = rewriteSteps
    .map((step, index) => {
      let stateClass = "waiting";
      let stateLabel = "等待中";

      if (rewriteState.status === "complete" || (isRunning && index < rewriteState.currentStepIndex)) {
        stateClass = "done";
        stateLabel = "已完成";
      } else if (isRunning && index === rewriteState.currentStepIndex) {
        stateClass = "active";
        stateLabel = "进行中";
      }

      return `
        <li class="writer-step ${stateClass}">
          <span class="writer-step-index">${index + 1}</span>
          <span class="writer-step-name">${escapeHtml(step)}</span>
          <span class="writer-step-state">${escapeHtml(stateLabel)}</span>
        </li>
      `;
    })
    .join("");
  const articlePanel = rewriteState.rewrittenArticle
    ? `
      <article class="writer-article rewrite-article">
        <div class="writer-article-header">
          <div>
            <div class="eyebrow">改写结果</div>
            <h3>${escapeHtml(rewriteState.rewrittenArticle.title)}</h3>
          </div>
          <span class="status-pill">${escapeHtml(selectedStyle.label)}</span>
          <span class="status-pill">${escapeHtml(rewriteState.rewrittenArticle.wordCount)}</span>
          <span class="status-pill">${escapeHtml(rewriteState.rewrittenArticle.imageCount)}</span>
        </div>
        <div class="writer-article-body">
          ${rewriteState.rewrittenArticle.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
      </article>
      <div class="writer-result-actions" aria-label="改写结果操作">
        <button class="secondary-button inline-action" type="button" data-action="copy-rewrite-article">复制文章</button>
        <button class="secondary-button inline-action" type="button" data-action="export-rewrite-word">导出 Word</button>
        <button class="secondary-button inline-action" type="button" data-action="save-rewrite-draft">保存草稿</button>
        <button class="primary-button inline-action" type="button" data-action="regenerate-rewrite">重新改写</button>
      </div>
    `
    : `
      <div class="writer-empty-state">
        <strong>${isRunning ? "正在改写文章" : "还没有改写结果"}</strong>
        <p>${isRunning ? "硅基智写正在完成改写、配图和排版。" : "填写公众号名称和原文后，点击一键改写即可生成可复制、可导出的文章。"}</p>
      </div>
    `;

  app.innerHTML = `
    <section class="writer-page rewrite-page" aria-label="一键改写">
      <div class="writer-layout rewrite-layout">
        <section class="writer-panel writer-config" aria-labelledby="rewriteConfigTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">一键改写</div>
              <h2 id="rewriteConfigTitle">输入原文并选择改写风格</h2>
            </div>
          </div>

          <div class="writer-field">
            <label for="rewriteAccountName">公众号名称</label>
            <input id="rewriteAccountName" class="writer-input" type="text" data-action="rewrite-account-input" value="${escapeAttr(rewriteState.publicAccountName)}" placeholder="例如：硅基智写研究所"${isRunning ? " disabled" : ""} />
          </div>

          <div class="writer-field">
            <label for="rewriteSourceArticle">原文</label>
            <textarea id="rewriteSourceArticle" class="writer-textarea" data-action="rewrite-source-input" placeholder="粘贴需要改写的公众号文章内容"${isRunning ? " disabled" : ""}>${escapeHtml(rewriteState.sourceArticle)}</textarea>
          </div>

          <div class="writer-field">
            <label for="rewriteStyle">改写风格</label>
            <select id="rewriteStyle" class="writer-select" data-action="select-rewrite-style"${isRunning ? " disabled" : ""}>
              ${styleOptions}
            </select>
            <p>${escapeHtml(selectedStyle.description)}</p>
          </div>

          <div class="writer-field">
            <label for="rewriteWordCount">选择字数</label>
            <select id="rewriteWordCount" class="writer-select" data-action="select-rewrite-word-count"${isRunning ? " disabled" : ""}>
              ${rewriteWordCountOptions}
            </select>
            <p>改写结果会按所选目标字数控制篇幅。</p>
          </div>

          <div class="writer-field">
            <label for="rewriteImageCount">选择配图数量</label>
            <select id="rewriteImageCount" class="writer-select" data-action="select-rewrite-image-count"${isRunning || !membershipAccess.hasImageMembership ? " disabled" : ""}>
              ${rewriteImageCountOptions}
            </select>
            <p>${escapeHtml(imageCountHelp)}</p>
          </div>

          <button class="primary-button writer-start-button" type="button" data-action="start-rewrite-generation"${isRunning ? " disabled" : ""}>
            ${isRunning ? "改写中..." : "一键改写"}
          </button>
        </section>

        <section class="writer-panel" aria-labelledby="rewriteProgressTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">改写流程</div>
              <h2 id="rewriteProgressTitle">三步自动完成</h2>
            </div>
          </div>
          <ol class="writer-progress">
            ${progressSteps}
          </ol>
        </section>
      </div>

      <section class="writer-panel writer-result" aria-labelledby="rewriteResultTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">文章结果</div>
            <h2 id="rewriteResultTitle">改写文章面板</h2>
          </div>
        </div>
        ${articlePanel}
      </section>
    </section>
  `;
}

function renderBenefits() {
  const renderPlanCards = (plans) => plans
    .map(
      (plan) => `
        <article class="plan-card ${plan.recommended ? "featured" : ""}">
          <div class="plan-card-header">
            <div>
              <div class="eyebrow">${plan.recommended ? "推荐方案" : "会员方案"}</div>
              <h2>${escapeHtml(plan.name)}</h2>
            </div>
            <strong>${escapeHtml(plan.price)}</strong>
          </div>
          <p>${escapeHtml(plan.target)}</p>
          <div class="plan-quota">${escapeHtml(plan.credits)}</div>
          <p class="plan-estimate">${escapeHtml(plan.estimate)}</p>
          <button class="primary-button" type="button" data-action="upgrade-plan" data-plan-id="${escapeAttr(plan.id)}">
            升级${escapeHtml(plan.name)}
          </button>
        </article>
      `,
    )
    .join("");
  const planCards = renderPlanCards(membershipPlans);
  const imagePlanCards = renderPlanCards(imageMembershipPlans);

  const comparisonRows = [
    ["积分额度", "60 / 720 积分", "1800 / 3600 积分", "14400 积分"],
    ["1200字文章估算", "大约生成 5 / 60 篇", "大约生成 150 / 300 篇", "大约生成 1200 篇"],
    ["一键写作", "尝鲜与个人账号", "矩阵账号", "团队账号"],
    ["配图消耗", "每 1 张图片消耗 2 积分", "每 1 张图片消耗 2 积分", "每 1 张图片消耗 2 积分"],
  ]
    .map(
      (row) => `
        <tr>
          ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
        </tr>
      `,
    )
    .join("");

  const rules = pointsRules
    .map(
      (rule) => `
        <article class="info-list-item">
          <strong>${escapeHtml(rule.title)}</strong>
          <p>${escapeHtml(rule.detail)}</p>
        </article>
      `,
    )
    .join("");

  app.innerHTML = `
    <section class="secondary-page benefits-page" aria-label="会员权益">
      <div class="page-intro">
        <div>
          <div class="eyebrow">会员权益</div>
          <h2>无图会员</h2>
        </div>
        <button class="secondary-button inline-action" type="button" data-route="orders">查看订单记录</button>
      </div>

      <div class="plan-grid">
        ${planCards}
      </div>

      <div class="page-intro page-intro-secondary">
        <div>
          <div class="eyebrow">配图会员</div>
          <h2>配图会员</h2>
        </div>
      </div>

      <div class="plan-grid">
        ${imagePlanCards}
      </div>

      <section class="writer-panel table-panel" aria-labelledby="benefitsCompareTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">权益对比</div>
            <h3 id="benefitsCompareTitle">套餐能力一览</h3>
          </div>
        </div>
        <div class="responsive-table">
          <table>
            <thead>
              <tr>
                <th>权益</th>
                <th>尝鲜/个人版</th>
                <th>矩阵版/高配版</th>
                <th>团队版</th>
              </tr>
            </thead>
            <tbody>${comparisonRows}</tbody>
          </table>
        </div>
      </section>

      <section class="writer-panel" aria-labelledby="pointsTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">积分规则</div>
            <h3 id="pointsTitle">积分消耗规则</h3>
          </div>
        </div>
        <div class="info-list">
          <article class="info-list-item">
            <strong>文字消耗</strong>
            <p>每 100 字消耗 1 积分；一篇 1200字文章约消耗 ${textPointsPerArticle} 积分。</p>
          </article>
          <article class="info-list-item">
            <strong>图片消耗</strong>
            <p>每 1 张图片消耗 ${imagePointsPerImage} 积分。配图会员按每篇文章 ${imagesPerEstimatedArticle} 张图片配发额度，已包含在套餐积分中。</p>
          </article>
          ${rules}
        </div>
      </section>
    </section>
  `;
}

function renderOrders() {
  const orders = orderRecords
    .map(
      (order) => `
        <article class="order-card">
          <div class="order-main">
            <span class="status-pill">${escapeHtml(order.status)}</span>
            <h3>${escapeHtml(order.packageName)}</h3>
            <p>订单号：${escapeHtml(order.id)}</p>
          </div>
          <div class="order-meta">
            <strong>${escapeHtml(order.amount)}</strong>
            <span>${escapeHtml(order.time)}</span>
          </div>
          <div class="order-actions">
            <button class="secondary-button inline-action" type="button" data-action="order-detail" data-order-id="${escapeAttr(order.id)}">查看详情</button>
            <button class="primary-button inline-action" type="button" data-action="order-invoice" data-order-id="${escapeAttr(order.id)}">申请发票</button>
          </div>
        </article>
      `,
    )
    .join("");

  app.innerHTML = `
    <section class="secondary-page orders-page" aria-label="订单记录">
      <div class="page-intro">
        <div>
          <div class="eyebrow">订单记录</div>
          <h2>最近的会员与次数包订单</h2>
        </div>
        <button class="secondary-button inline-action" type="button" data-route="benefits">购买新套餐</button>
      </div>
      <div class="order-list">${orders}</div>
    </section>
  `;
}

function renderInvite() {
  const rewardRuleCards = inviteRewardRules
    .map(
      (rule) => `
        <article class="info-list-item">
          <strong>${escapeHtml(rule.title)}</strong>
          <p>${escapeHtml(rule.detail)}</p>
        </article>
      `,
    )
    .join("");
  const payoutRuleCards = invitePayoutRules
    .map(
      (rule) => `
        <article class="info-list-item">
          <p>${escapeHtml(rule)}</p>
        </article>
      `,
    )
    .join("");
  const rewardRows = inviteRewards
    .map(
      (reward) => `
        <article class="reward-item">
          <div>
            <strong>${escapeHtml(reward.name)}</strong>
            <p>${escapeHtml(reward.time)}</p>
          </div>
          <span>${escapeHtml(reward.reward)}</span>
          <span class="status-pill">${escapeHtml(reward.status)}</span>
        </article>
      `,
    )
    .join("");

  app.innerHTML = `
    <section class="secondary-page invite-page" aria-label="邀请奖励">
      <div class="page-intro">
        <div>
          <div class="eyebrow">邀请奖励</div>
          <h2>邀请好友使用硅基智写</h2>
        </div>
        <button class="secondary-button inline-action" type="button" data-action="virtual" data-message="邀请返现规则已展示在当前页面">查看奖励规则</button>
      </div>

      <div class="invite-grid">
        <section class="invite-block" aria-labelledby="inviteCodeTitle">
          <div class="eyebrow">邀请码</div>
          <h3 id="inviteCodeTitle">${escapeHtml(inviteState.code)}</h3>
          <p>好友注册时填写邀请码，系统会自动绑定邀请关系并按月计算返现。</p>
          <button class="primary-button" type="button" data-action="copy-invite-code">复制邀请码</button>
        </section>
        <section class="invite-block" aria-labelledby="inviteLinkTitle">
          <div class="eyebrow">邀请链接</div>
          <h3 id="inviteLinkTitle">${escapeHtml(inviteState.link)}</h3>
          <p>可发送到社群、私信或朋友圈，系统会自动绑定邀请关系。</p>
          <button class="primary-button" type="button" data-action="copy-invite-link">复制邀请链接</button>
        </section>
      </div>

      <div class="metrics-grid reward-summary" aria-label="奖励汇总">
        <article class="metric-card">
          <span>累计邀请</span>
          <strong>18 人</strong>
        </article>
        <article class="metric-card">
          <span>本月预估返现</span>
          <strong>¥286.40</strong>
        </article>
        <article class="metric-card">
          <span>待发放奖励</span>
          <strong>2 笔</strong>
        </article>
      </div>

      <section class="writer-panel" aria-labelledby="inviteRuleTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">邀请奖励机制</div>
            <h3 id="inviteRuleTitle">三级好友返现规则</h3>
          </div>
        </div>
        <div class="info-list">${rewardRuleCards}</div>
      </section>

      <section class="writer-panel" aria-labelledby="payoutRuleTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">奖金发放机制</div>
            <h3 id="payoutRuleTitle">发放与清零规则</h3>
          </div>
        </div>
        <div class="info-list">${payoutRuleCards}</div>
      </section>

      <section class="writer-panel" aria-labelledby="rewardDetailTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">奖励明细</div>
            <h3 id="rewardDetailTitle">最近邀请记录</h3>
          </div>
        </div>
        <div class="reward-list">${rewardRows}</div>
      </section>
    </section>
  `;
}

function renderSettings() {
  app.innerHTML = `
    <section class="secondary-page settings-page" aria-label="账户设置">
      <div class="page-intro">
        <div>
          <div class="eyebrow">账户设置</div>
          <h2>管理基础资料与通知偏好</h2>
        </div>
      </div>

      <section class="settings-layout">
        <div class="writer-panel avatar-panel">
          <div class="avatar-placeholder" aria-hidden="true">${escapeHtml(settingsState.nickname.slice(0, 1) || "硅")}</div>
          <h3>${escapeHtml(settingsState.nickname)}</h3>
          <p>头像为演示占位，正式版可上传图片并裁剪。</p>
          <button class="secondary-button inline-action" type="button" data-action="change-avatar">更换头像</button>
        </div>

        <form class="writer-panel settings-form" aria-labelledby="settingsFormTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">个人资料</div>
              <h3 id="settingsFormTitle">登录与展示信息</h3>
            </div>
          </div>
          <div class="form-grid">
            <label class="writer-field" for="settingsNickname">
              昵称
              <input id="settingsNickname" class="writer-input" type="text" data-action="settings-nickname-input" value="${escapeAttr(settingsState.nickname)}" />
            </label>
            <label class="writer-field" for="settingsEmail">
              邮箱
              <input id="settingsEmail" class="writer-input" type="email" data-action="settings-email-input" value="${escapeAttr(settingsState.email)}" />
            </label>
            <label class="writer-field form-wide" for="settingsPassword">
              新密码
              <input id="settingsPassword" class="writer-input" type="password" data-action="settings-password-input" value="${escapeAttr(settingsState.password)}" placeholder="不修改可留空" />
            </label>
          </div>

          <div class="toggle-list" aria-label="通知偏好">
            <label class="toggle-row">
              <span>产品更新提醒</span>
              <input type="checkbox" data-action="settings-toggle" data-setting-key="notifyProduct"${settingsState.notifyProduct ? " checked" : ""} />
            </label>
            <label class="toggle-row">
              <span>订单与发票通知</span>
              <input type="checkbox" data-action="settings-toggle" data-setting-key="notifyOrder"${settingsState.notifyOrder ? " checked" : ""} />
            </label>
            <label class="toggle-row">
              <span>每周内容报告</span>
              <input type="checkbox" data-action="settings-toggle" data-setting-key="notifyWeekly"${settingsState.notifyWeekly ? " checked" : ""} />
            </label>
          </div>

          <button class="primary-button inline-action" type="button" data-action="save-settings">保存设置</button>
        </form>
      </section>
    </section>
  `;
}

function renderSupport() {
  const faqItems = supportFaqs
    .map((faq) => {
      const isOpen = faq.id === supportState.openFaqId;

      return `
        <article class="faq-item ${isOpen ? "open" : ""}">
          <button class="faq-question" type="button" data-action="toggle-faq" data-faq-id="${escapeAttr(faq.id)}" aria-expanded="${isOpen}">
            <span>${escapeHtml(faq.question)}</span>
            <span aria-hidden="true">${isOpen ? "−" : "+"}</span>
          </button>
          ${isOpen ? `<p>${escapeHtml(faq.answer)}</p>` : ""}
        </article>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="secondary-page support-page" aria-label="客服中心">
      <div class="page-intro">
        <div>
          <div class="eyebrow">客服中心</div>
          <h2>订单、权益与使用问题都可以在这里处理</h2>
        </div>
        <button class="primary-button inline-action" type="button" data-action="online-service">进入在线客服</button>
      </div>

      <div class="support-grid">
        <form class="writer-panel ticket-form" aria-labelledby="ticketFormTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">提交工单</div>
              <h3 id="ticketFormTitle">描述你遇到的问题</h3>
            </div>
          </div>
          <label class="writer-field" for="ticketTitle">
            标题
            <input id="ticketTitle" class="writer-input" type="text" data-action="ticket-title-input" placeholder="例如：订单支付后未到账" />
          </label>
          <label class="writer-field" for="ticketContent">
            问题描述
            <textarea id="ticketContent" class="writer-textarea compact-textarea" data-action="ticket-content-input" placeholder="请补充账号、订单号或具体操作路径"></textarea>
          </label>
          <button class="primary-button inline-action" type="button" data-action="submit-ticket">提交工单</button>
        </form>

        <section class="writer-panel contact-panel" aria-labelledby="contactTitle">
          <div class="section-heading">
            <div>
              <div class="eyebrow">联系方式</div>
              <h3 id="contactTitle">快速联系</h3>
            </div>
          </div>
          <button class="secondary-button contact-action" type="button" data-action="support-contact" data-contact-type="微信客服">微信客服</button>
          <button class="secondary-button contact-action" type="button" data-action="support-contact" data-contact-type="邮件支持">邮件支持</button>
          <button class="secondary-button contact-action" type="button" data-action="support-contact" data-contact-type="订单专员">订单专员</button>
        </section>
      </div>

      <section class="writer-panel" aria-labelledby="faqTitle">
        <div class="section-heading">
          <div>
            <div class="eyebrow">常见问题</div>
            <h3 id="faqTitle">自助解答</h3>
          </div>
        </div>
        <div class="faq-list">${faqItems}</div>
      </section>
    </section>
  `;
}

function renderStarterPanel(page) {
  const safeLabel = escapeHtml(page.label);
  const safeAttrLabel = escapeAttr(page.label);
  const modalBody = escapeAttr(`这是 ${page.label} 的演示弹窗，后续可替换为真实功能流程。`);
  const toastMessage = escapeAttr(`${page.label} 功能即将开放`);

  app.innerHTML = `
    <section class="starter-panel">
      <div>
        <div class="eyebrow">当前模块</div>
        <h2>${safeLabel}</h2>
      </div>
      <p>
        硅基智写用户后台静态壳已经就绪。后续任务会在这里接入一键写作、改写、会员权益、
        订单与账户等具体页面内容。
      </p>
      <div class="panel-actions">
        <button class="primary-button inline-action" type="button" data-action="modal" data-modal-title="${safeAttrLabel}" data-modal-body="${modalBody}">查看模块说明</button>
        <button class="secondary-button inline-action" type="button" data-action="virtual" data-message="${toastMessage}">模拟操作</button>
      </div>
      <div class="metrics-grid" aria-label="概览指标">
        <article class="metric-card">
          <span>本月剩余额度</span>
          <strong>86 次</strong>
        </article>
        <article class="metric-card">
          <span>草稿内容</span>
          <strong>12 篇</strong>
        </article>
        <article class="metric-card">
          <span>改写任务</span>
          <strong>28 次</strong>
        </article>
      </div>
    </section>
  `;
}

function render() {
  const page = getCurrentPage();

  pageTitle.textContent = page.label;
  renderNav();

  if (currentRoute === "dashboard") {
    renderDashboard();
    return;
  }

  if (currentRoute === "writer") {
    renderWriter();
    return;
  }

  if (currentRoute === "rewrite") {
    renderRewrite();
    return;
  }

  if (currentRoute === "benefits") {
    renderBenefits();
    return;
  }

  if (currentRoute === "orders") {
    renderOrders();
    return;
  }

  if (currentRoute === "invite") {
    renderInvite();
    return;
  }

  if (currentRoute === "settings") {
    renderSettings();
    return;
  }

  if (currentRoute === "support") {
    renderSupport();
    return;
  }

  renderStarterPanel(page);
}

function handleDocumentClick(event) {
  const clicked = event.target.closest("[data-route], [data-action]");

  if (
    document.body.classList.contains("nav-open") &&
    !sidebar.contains(event.target) &&
    event.target !== menuButton
  ) {
    setDrawerOpen(false);
    return;
  }

  if (!clicked) return;

  const route = clicked.dataset.route;
  if (route) {
    navigateTo(route);
    return;
  }

  const action = clicked.dataset.action;

  if (action === "open-menu") {
    setDrawerOpen(true);
    return;
  }

  if (action === "close-menu") {
    setDrawerOpen(false);
    return;
  }

  if (action === "virtual") {
    showToast(clicked.dataset.message || "功能即将开放");
    return;
  }

  if (action === "upgrade-plan") {
    const plan = [...membershipPlans, ...imageMembershipPlans].find((item) => item.id === clicked.dataset.planId);
    if (plan) {
      showModal(
        `${plan.name} 支付确认`,
        `这是虚拟支付弹窗：套餐 ${plan.name}，价格 ${plan.price}，包含 ${plan.credits}。点击真实支付前请再次确认订单信息。`,
      );
    }
    return;
  }

  if (action === "order-detail") {
    const order = orderRecords.find((item) => item.id === clicked.dataset.orderId);
    if (order) {
      showModal(
        "订单详情",
        `${order.packageName}，金额 ${order.amount}，状态 ${order.status}，下单时间 ${order.time}，订单号 ${order.id}。`,
      );
    }
    return;
  }

  if (action === "order-invoice") {
    const order = orderRecords.find((item) => item.id === clicked.dataset.orderId);
    showToast(order ? `${order.packageName} 的发票申请已提交` : "发票申请已提交");
    return;
  }

  if (action === "copy-invite-code") {
    copyTextWithFallback(inviteState.code, "邀请码已复制");
    return;
  }

  if (action === "copy-invite-link") {
    copyTextWithFallback(inviteState.link, "邀请链接已复制");
    return;
  }

  if (action === "change-avatar") {
    showToast("头像上传入口已模拟打开");
    return;
  }

  if (action === "save-settings") {
    const nickname = settingsState.nickname.trim();
    const email = settingsState.email.trim();

    if (!nickname) {
      showToast("请填写昵称后再保存");
      return;
    }

    if (!email || !email.includes("@")) {
      showToast("请填写有效邮箱后再保存");
      return;
    }

    settingsState.nickname = nickname;
    settingsState.email = email;
    showToast("账户设置已保存");
    renderSettings();
    return;
  }

  if (action === "online-service") {
    showModal("在线客服", "在线客服已接入虚拟会话，正式版会在这里打开客服聊天窗口。");
    return;
  }

  if (action === "submit-ticket") {
    const form = clicked.closest(".ticket-form");
    const title = form?.querySelector("#ticketTitle")?.value.trim() || "";
    const content = form?.querySelector("#ticketContent")?.value.trim() || "";

    if (!title || !content) {
      showToast(!title ? "请先填写工单标题" : "请补充问题描述后提交");
      return;
    }

    showModal("工单已提交", `我们已收到“${title}”，客服会在 1 个工作日内跟进。`);
    form.reset();
    return;
  }

  if (action === "support-contact") {
    showToast(`${clicked.dataset.contactType || "客服"} 联系方式已为你模拟打开`);
    return;
  }

  if (action === "toggle-faq") {
    const faqId = clicked.dataset.faqId;
    supportState.openFaqId = supportState.openFaqId === faqId ? "" : faqId;
    renderSupport();
    return;
  }

  if (action === "select-writer-track") {
    if (writerState.status === "running") return;

    const trackId = clicked.dataset.trackId;
    if (writerTracks.some((track) => track.id === trackId)) {
      writerState.selectedTrack = trackId;
      writerState.generatedArticle = null;
      writerState.status = "idle";
      writerState.currentStepIndex = -1;
      renderWriter();
    }
    return;
  }

  if (action === "start-writer-generation") {
    if (writerState.status !== "running") startWriterGeneration();
    return;
  }

  if (action === "copy-writer-article") {
    copyWriterArticle();
    return;
  }

  if (action === "export-writer-word") {
    showToast(writerState.generatedArticle ? "Word 文件已准备好" : "暂无可导出的文章");
    return;
  }

  if (action === "save-writer-draft") {
    showToast(writerState.generatedArticle ? "草稿已保存" : "暂无可保存的文章");
    return;
  }

  if (action === "regenerate-writer") {
    startWriterGeneration();
    return;
  }

  if (action === "start-rewrite-generation") {
    if (rewriteState.status !== "running") startRewriteGeneration();
    return;
  }

  if (action === "copy-rewrite-article") {
    copyRewriteArticle();
    return;
  }

  if (action === "export-rewrite-word") {
    showToast(rewriteState.rewrittenArticle ? "Word 文件已准备好" : "暂无可导出的改写文章");
    return;
  }

  if (action === "save-rewrite-draft") {
    showToast(rewriteState.rewrittenArticle ? "改写草稿已保存" : "暂无可保存的改写文章");
    return;
  }

  if (action === "regenerate-rewrite") {
    if (rewriteState.status !== "running") startRewriteGeneration();
    return;
  }

  if (action === "modal") {
    showModal(clicked.dataset.modalTitle || "提示", clicked.dataset.modalBody || "功能详情即将开放。");
    return;
  }

  if (action === "close-modal" && (event.target === clicked || clicked.classList.contains("modal-close"))) {
    closeModal();
  }
}

function handleDocumentInput(event) {
  const changed = event.target.closest("[data-action]");
  if (!changed) return;

  if (changed.dataset.action === "rewrite-account-input") {
    rewriteState.publicAccountName = changed.value;
    rewriteState.rewrittenArticle = null;
    if (rewriteState.status === "complete") {
      rewriteState.status = "idle";
      rewriteState.currentStepIndex = -1;
    }
    return;
  }

  if (changed.dataset.action === "rewrite-source-input") {
    rewriteState.sourceArticle = changed.value;
    rewriteState.rewrittenArticle = null;
    if (rewriteState.status === "complete") {
      rewriteState.status = "idle";
      rewriteState.currentStepIndex = -1;
    }
    return;
  }

  if (changed.dataset.action === "settings-nickname-input") {
    settingsState.nickname = changed.value;
    return;
  }

  if (changed.dataset.action === "settings-email-input") {
    settingsState.email = changed.value;
    return;
  }

  if (changed.dataset.action === "settings-password-input") {
    settingsState.password = changed.value;
  }
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape") {
    if (modalRoot.hasChildNodes()) {
      closeModal();
      return;
    }

    if (document.body.classList.contains("nav-open")) {
      setDrawerOpen(false);
    }
  }

  if (event.key === "Tab" && modalRoot.hasChildNodes()) {
    trapModalTab(event);
  }
}

function handleDocumentChange(event) {
  const changed = event.target.closest("[data-action]");
  if (!changed) return;

  if (changed.dataset.action === "select-writer-tone") {
    const toneId = changed.value;
    if (writerTones.some((tone) => tone.id === toneId)) {
      writerState.selectedTone = toneId;
      writerState.generatedArticle = null;
      writerState.status = "idle";
      writerState.currentStepIndex = -1;
      renderWriter();
    }
    return;
  }

  if (changed.dataset.action === "select-writer-word-count") {
    const wordCount = changed.value;
    if (wordCountOptions.includes(wordCount)) {
      writerState.selectedWordCount = wordCount;
      writerState.generatedArticle = null;
      writerState.status = "idle";
      writerState.currentStepIndex = -1;
      renderWriter();
    }
    return;
  }

  if (changed.dataset.action === "select-writer-image-count") {
    const imageCount = changed.value;
    if (membershipAccess.hasImageMembership && imageCountOptions.includes(imageCount)) {
      writerState.selectedImageCount = imageCount;
      writerState.generatedArticle = null;
      writerState.status = "idle";
      writerState.currentStepIndex = -1;
      renderWriter();
    }
    return;
  }

  if (changed.dataset.action === "select-rewrite-style") {
    const styleId = changed.value;
    if (rewriteStyles.some((style) => style.id === styleId)) {
      rewriteState.selectedStyle = styleId;
      rewriteState.rewrittenArticle = null;
      rewriteState.status = "idle";
      rewriteState.currentStepIndex = -1;
      renderRewrite();
    }
    return;
  }

  if (changed.dataset.action === "select-rewrite-word-count") {
    const wordCount = changed.value;
    if (wordCountOptions.includes(wordCount)) {
      rewriteState.selectedWordCount = wordCount;
      rewriteState.rewrittenArticle = null;
      rewriteState.status = "idle";
      rewriteState.currentStepIndex = -1;
      renderRewrite();
    }
    return;
  }

  if (changed.dataset.action === "select-rewrite-image-count") {
    const imageCount = changed.value;
    if (membershipAccess.hasImageMembership && imageCountOptions.includes(imageCount)) {
      rewriteState.selectedImageCount = imageCount;
      rewriteState.rewrittenArticle = null;
      rewriteState.status = "idle";
      rewriteState.currentStepIndex = -1;
      renderRewrite();
    }
    return;
  }

  if (changed.dataset.action === "settings-toggle") {
    const key = changed.dataset.settingKey;
    if (Object.prototype.hasOwnProperty.call(settingsState, key)) {
      settingsState[key] = changed.checked;
      showToast(changed.checked ? "通知已开启" : "通知已关闭");
    }
  }
}

function handleHashChange() {
  const route = getRouteFromHash();
  if (route === currentRoute) return;

  if (currentRoute === "writer" && route !== "writer") {
    clearWriterTimers();
    if (writerState.status === "running") {
      writerState.status = "idle";
      writerState.currentStepIndex = -1;
    }
  }

  if (currentRoute === "rewrite" && route !== "rewrite") {
    clearRewriteTimers();
    if (rewriteState.status === "running") {
      rewriteState.status = "idle";
      rewriteState.currentStepIndex = -1;
    }
  }

  currentRoute = route;
  setDrawerOpen(false, { restoreFocus: false });
  render();
  app.focus({ preventScroll: true });
}

document.addEventListener("click", handleDocumentClick);
document.addEventListener("input", handleDocumentInput);
document.addEventListener("change", handleDocumentChange);
document.addEventListener("keydown", handleDocumentKeydown);
window.addEventListener("hashchange", handleHashChange);

render();
