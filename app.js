const i18n = {
  sideTitle: "音频生成",
  tabRead: "AI朗读",
  tabConvert: "语音转换",
  savedTitle: "已保存音频",
  pageTitle: "语音转换",
  labelResult: "试听结果",
  labelTimbre: "音色",
  labelParams: "生成参数",
  labelInput: "输入语音",
  btnRegen: "修改音色并重新生成",
  btnReRecord: "重新录入",
  btnSave: "满意并保存",
  readTitle: "生成参数",
  readTextLabel: "配音内容",
  readGenerate: "AI朗读",
  readSave: "保存"
};

const convertTimbres = ["凶狠坏蛋", "蛋小黄", "青年女性", "青年男性", "可爱少女", "单纯少年", "粗犷男声"];
const readTimbres = ["蛋小黄", "青年女性", "青年男性", "可爱少女", "单纯少年", "粗犷男声", "老奶奶"];
const allTimbres = [
  "蛋小黄", "青年女性", "青年男性", "可爱少女", "单纯少年", "粗犷男声", "老奶奶", "中年女性", "萌宠声线",
  "英气少女", "英气少年", "男性家仆", "女性家仆", "男性商人", "青年女侠", "英气少女2", "英气少年2", "调皮小子",
  "睿智中年", "智慧老人", "凶狠坏蛋", "狡猾青年", "青年女性2", "青年男性2", "青年男性3", "魔童", "黏熊"
];
const emotions = ["高兴", "悲伤", "愤怒", "平静", "惊讶"];
const readEmotions = ["中性", "高兴", "悲伤", "激动"];
const speeds = ["很慢", "慢", "正常", "快", "很快"];

const state = {
  activeTab: "convert",
  convertStage: "input",
  selectedConvertTimbre: "凶狠坏蛋",
  generatedConvertTimbre: "凶狠坏蛋",
  convertEmotion: "高兴",
  convertSpeed: "正常",
  convertVolume: 76,
  generatedConvertEmotion: "高兴",
  generatedConvertSpeed: "正常",
  generatedConvertVolume: 76,
  surfacedConvertTimbre: "",
  playingSavedId: null,
  playingResult: null,
  isRecording: false,
  recordWillCancel: false,
  recordPointerId: null,
  recordStartY: 0,
  isGenerating: false,
  selectedReadTimbre: "蛋小黄",
  generatedReadTimbre: "蛋小黄",
  surfacedReadTimbre: "",
  readEmotion: "中性",
  readSpeed: "正常",
  readVolume: 100,
  readText: "鸡蛋鸭蛋荷包蛋！",
  readCanSave: false,
  uploadedAudioName: "",
  inputMoreOpen: false,
  modal: null,
  modalTarget: "",
  modalSelection: "",
  convertSaved: [
    { id: "c1", title: "可爱少女_音频_10", subtitle: "审核中，完成后可试听", status: "reviewing" },
    { id: "c2", title: "萌宠声线_音频_8", subtitle: "i love you" },
    { id: "c3", title: "用户语音_转青年女性_03", subtitle: "试听满意，已保存" }
  ],
  readSaved: [
    { id: "r1", title: "可爱少女_音频_424", body: "医生套装限时折扣中，马上恢复原价，心动的话快快行动吧！" },
    { id: "r2", title: "单纯少年_音频_411", body: "恭喜你完成治疗所有的艾比，终点已出现在医院对面，你可以选择通关，也可以继续探索小镇的风光哦" },
    { id: "r3", title: "单纯少年_音频_410", body: "觉得地图好玩的话可以给作者点个赞吗" },
    { id: "r4", title: "蛋小黄_音频_409", body: "找不到艾比时可以使用召唤功能寻找艾比哦" },
    { id: "r5", title: "羊宝_音频_408", body: "医生救救我" },
    { id: "r6", title: "青年男性_音频_407", body: "快来医院大厅集合，下一轮问答马上开始。" }
  ]
};

const savedHeaderTitle = document.getElementById("savedHeaderTitle");
const savedHeaderAction = document.getElementById("savedHeaderAction");
const savedList = document.getElementById("savedList");
const readPanel = document.getElementById("readPanel");
const inputPanel = document.getElementById("inputPanel");
const resultPanel = document.getElementById("resultPanel");
const overlayRoot = document.getElementById("overlayRoot");
const tabRead = document.getElementById("tabRead");
const tabConvert = document.getElementById("tabConvert");

document.getElementById("sideTitle").textContent = i18n.sideTitle;
tabRead.textContent = i18n.tabRead;
tabConvert.textContent = i18n.tabConvert;
savedHeaderTitle.textContent = i18n.savedTitle;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderHeaderAction() {
  savedHeaderAction.innerHTML = `
    <button class="help-chip" data-action="open-help">
      <span>如何使用</span>
      <span class="help-chip-icon">?</span>
      <span class="help-chip-dot"></span>
    </button>
  `;
}

function renderSavedList() {
  const list = state.activeTab === "read" ? state.readSaved : state.convertSaved;
  savedList.innerHTML = list.map((item) => {
    const isRead = state.activeTab === "read";
    const isReviewing = !isRead && item.status === "reviewing";
    return `
      <div class="saved-item">
        <button class="play-btn ${isReviewing ? "disabled" : ""}" ${isReviewing ? "disabled" : `data-saved-play="${item.id}"`}>
          ${state.playingSavedId === item.id ? "■" : "▶"}
        </button>
        <div class="saved-text">
          <p class="saved-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</p>
          ${isRead
            ? `<p class="saved-body">${escapeHtml(item.body)}</p>`
            : `<p class="saved-sub ${isReviewing ? "reviewing" : ""}" title="${escapeHtml(item.subtitle)}">${escapeHtml(item.subtitle)}</p>`}
        </div>
        ${isReviewing ? "" : '<button class="more-btn" aria-label="更多">…</button>'}
      </div>
    `;
  }).join("");
}

function renderTimbreHead() {
  return `
    <div class="section-head timbre-head">
      <p class="label">${i18n.labelTimbre}</p>
      <span class="upgrade-mini" aria-label="音色升级">
        <span class="upgrade-mini-text">升级</span>
      </span>
    </div>
  `;
}

function isConvertBusy() {
  return state.activeTab === "convert" && (state.isRecording || state.isGenerating);
}

function resetConvertToInput() {
  state.playingResult = null;
  state.convertStage = "input";
  state.isRecording = false;
  state.recordWillCancel = false;
  state.recordPointerId = null;
  state.recordStartY = 0;
  state.isGenerating = false;
  state.inputMoreOpen = false;
  state.uploadedAudioName = "";
}

function buildVisibleTimbres(baseItems, surfaced) {
  if (!surfaced) return [...baseItems];
  return [surfaced, ...baseItems.filter((item) => item !== surfaced)].slice(0, baseItems.length);
}

function getSurfacedTimbre(baseItems, timbre) {
  return timbre && !baseItems.includes(timbre) ? timbre : "";
}

function canRegenerateConvert() {
  return (
    state.selectedConvertTimbre !== state.generatedConvertTimbre ||
    state.convertEmotion !== state.generatedConvertEmotion ||
    state.convertSpeed !== state.generatedConvertSpeed ||
    state.convertVolume !== state.generatedConvertVolume
  ) && !state.isGenerating;
}

function buildOrderedMoreTimbres() {
  if (!state.modalSelection) return [...allTimbres];
  return [state.modalSelection, ...allTimbres.filter((item) => item !== state.modalSelection)];
}

function renderTimbreGrid({ items, selected, current, actionTarget, showCurrentTag, disabled = false }) {
  return `
    <div class="timbre-grid">
      ${items.map((item) => `
        <button class="timbre-btn ${selected === item ? "active" : ""}" data-action="select-timbre" data-target="${actionTarget}" data-timbre="${item}" ${disabled ? "disabled" : ""}>
          ${showCurrentTag && current === item ? '<span class="current-tag">当前</span>' : ""}
          <span>${item}</span>
        </button>
      `).join("")}
      <button class="timbre-btn more-btn-fill" data-action="open-more" data-target="${actionTarget}" ${disabled ? "disabled" : ""}>更多</button>
    </div>
  `;
}

function renderPlayer(label, key) {
  const playing = state.playingResult === key;
  return `
    <div class="player">
      <div class="player-hd">
        <span>${label}</span>
        <button class="mini-play" data-action="play-result" data-result="${key}" style="background:${playing ? "#f4dd34" : "#e8e8e8"}">${playing ? "■" : "▶"}</button>
      </div>
      <div style="font-size:18px;color:#6f87a3;">00:12</div>
      <div class="bar"></div>
    </div>
  `;
}

function renderConvertInputPanel() {
  const convertControlsLocked = state.isRecording || state.isGenerating;
  const recordContent = state.isGenerating
    ? '<span class="record-btn-inner"><span class="spinner"></span><span>生成中...</span></span>'
    : (state.isRecording
      ? `
        <span class="recording-inner">
          <span class="recording-icon"></span>
          <span class="recording-gesture ${state.recordWillCancel ? "cancel" : ""}">
            ${state.recordWillCancel ? "松开取消" : "松手发送，上滑取消"}
          </span>
          <span class="recording-wave" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span><span></span>
          </span>
        </span>
      `
      : "按住录音");

  const recordControls = state.isRecording
    ? `
      <div class="record-display record-btn recording ${state.recordWillCancel ? "cancel-ready" : ""}">
        ${recordContent}
      </div>
    `
    : `
      <div class="record-entry-row">
        <button id="recordBtn" class="record-btn ${state.isGenerating ? "generating" : ""}" ${state.isGenerating ? "disabled" : ""}>
          ${recordContent}
        </button>
        <button class="record-more-btn" data-action="toggle-input-more" aria-label="更多录入方式" ${state.isGenerating ? "disabled" : ""}>...</button>
      </div>
    `;

  inputPanel.innerHTML = `
    <div class="convert-input-shell">
      <div class="convert-input-top">
        <h2>${i18n.pageTitle}</h2>
        ${renderTimbreHead()}
        ${renderTimbreGrid({
          items: buildVisibleTimbres(convertTimbres, state.surfacedConvertTimbre),
          selected: state.selectedConvertTimbre,
          current: state.generatedConvertTimbre,
          actionTarget: "convert",
          showCurrentTag: false,
          disabled: convertControlsLocked
        })}
        <div class="param-row">
          <div class="param-label">
            <p class="label">情绪</p>
            <span class="section-help">?</span>
          </div>
          <select class="select read-select" id="convertEmotionSelect">${emotions.map((item) => `<option ${item === state.convertEmotion ? "selected" : ""}>${item}</option>`).join("")}</select>
        </div>
        <div class="param-row">
          <div class="param-label">
            <p class="label">语速</p>
            <span class="section-help">?</span>
          </div>
          <select class="select read-select" id="convertSpeedSelect">${speeds.map((item) => `<option ${item === state.convertSpeed ? "selected" : ""}>${item}</option>`).join("")}</select>
        </div>
        <div class="section-head">
          <p class="label">音量</p>
        </div>
        <div class="slider-row">
          <input id="convertVolumeRange" type="range" min="0" max="100" value="${state.convertVolume}">
          <div class="value-box">${state.convertVolume}</div>
        </div>
      </div>
      <div class="convert-input-bottom">
        <div class="record-card">
          ${recordControls}
          ${state.inputMoreOpen ? `
            <div class="record-more-menu">
              <label class="record-more-item" for="uploadAudioInput">上传音频</label>
              <input id="uploadAudioInput" type="file" accept="audio/*" hidden>
            </div>
          ` : ""}
          ${state.uploadedAudioName ? `<div class="upload-name">已选择：${escapeHtml(state.uploadedAudioName)}</div>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderConvertResultPanel() {
  const canRegenerate = canRegenerateConvert();
  resultPanel.innerHTML = `
    <div class="result-shell">
      <div class="result-scroll">
        <h2>${i18n.pageTitle}</h2>
        <p class="label">${i18n.labelResult}</p>
        <div class="players">
          ${renderPlayer("原始语音", "original")}
          ${renderPlayer("转换音频", "converted")}
        </div>
        ${renderTimbreHead()}
        ${renderTimbreGrid({
          items: buildVisibleTimbres(convertTimbres, state.surfacedConvertTimbre),
          selected: state.selectedConvertTimbre,
          current: state.generatedConvertTimbre,
          actionTarget: "convert",
          showCurrentTag: true,
          disabled: state.isGenerating
        })}
        <div class="param-row result-param-row">
          <div class="param-label">
            <p class="label">情绪</p>
            <span class="section-help">?</span>
          </div>
          <select class="select read-select" id="convertEmotionSelect" ${state.isGenerating ? "disabled" : ""}>${emotions.map((item) => `<option ${item === state.convertEmotion ? "selected" : ""}>${item}</option>`).join("")}</select>
        </div>
        <div class="param-row result-param-row">
          <div class="param-label">
            <p class="label">语速</p>
            <span class="section-help">?</span>
          </div>
          <select class="select read-select" id="convertSpeedSelect" ${state.isGenerating ? "disabled" : ""}>${speeds.map((item) => `<option ${item === state.convertSpeed ? "selected" : ""}>${item}</option>`).join("")}</select>
        </div>
        <div class="section-head result-section-head">
          <p class="label">音量</p>
        </div>
        <div class="slider-row result-slider-row">
          <input id="convertVolumeRange" type="range" min="0" max="100" value="${state.convertVolume}" ${state.isGenerating ? "disabled" : ""}>
          <div class="value-box">${state.convertVolume}</div>
        </div>
      </div>
      <div class="result-actions">
        <button id="regenBtn" ${canRegenerate ? "" : "disabled"}>${state.isGenerating ? "生成中..." : i18n.btnRegen}</button>
        <button id="reRecordBtn" ${state.isGenerating ? "disabled" : ""}>${i18n.btnReRecord}</button>
        <button id="saveBtn" ${state.isGenerating ? "disabled" : ""}>${i18n.btnSave}</button>
      </div>
    </div>
  `;
}

function renderReadPanel() {
  readPanel.innerHTML = `
    <div class="read-shell">
      <div class="read-scroll">
        <h2>${i18n.readTitle}</h2>
        <div class="section-head">
          <p class="label">${i18n.readTextLabel}</p>
        </div>
        <div class="textarea-card">
          <textarea id="readTextInput" class="textarea-box" maxlength="100">${escapeHtml(state.readText)}</textarea>
          <span class="textarea-count">${state.readText.length}/100</span>
        </div>
        ${renderTimbreHead()}
        ${renderTimbreGrid({
          items: buildVisibleTimbres(readTimbres, state.surfacedReadTimbre),
          selected: state.selectedReadTimbre,
          current: state.generatedReadTimbre,
          actionTarget: "read",
          showCurrentTag: false
        })}
        <div class="param-row">
          <div class="param-label">
            <p class="label">情绪</p>
            <span class="section-help">?</span>
          </div>
          <select class="select read-select" id="readEmotionSelect">${readEmotions.map((item) => `<option ${item === state.readEmotion ? "selected" : ""}>${item}</option>`).join("")}</select>
        </div>
        <div class="param-row">
          <div class="param-label">
            <p class="label">语速</p>
            <span class="section-help">?</span>
          </div>
          <select class="select read-select" id="readSpeedSelect">${speeds.map((item) => `<option ${item === state.readSpeed ? "selected" : ""}>${item}</option>`).join("")}</select>
        </div>
        <div class="section-head">
          <p class="label">音量</p>
        </div>
        <div class="slider-row">
          <input id="readVolumeRange" type="range" min="0" max="100" value="${state.readVolume}">
          <div class="value-box">${state.readVolume}</div>
        </div>
      </div>
      <div class="read-actions">
        <button class="primary-read-btn" data-action="generate-read">${state.isGenerating ? "生成中..." : i18n.readGenerate}</button>
        <button class="secondary-read-btn ${state.readCanSave ? "enabled" : ""}" data-action="save-read">${i18n.readSave}</button>
      </div>
    </div>
  `;
}

function renderHelpModal() {
  const isRead = state.activeTab === "read";
  const items = isRead
    ? [
        "输入配音内容后，先选择一个音色，再点击“AI朗读”生成试听结果。",
        "右下角两个按钮为常驻区，列表滚动时不会随内容移动。",
        "音色服务已升级，可直接体验更高质量、更有表现力的新版音色。"
      ]
    : [
        "按住录音后，松手直接发送；上滑后松手则取消本次录音。",
        "生成中会锁定音色切换、上传入口和更多音色，避免误触。",
        "结果页修改音色后，“修改音色并重新生成”才会解锁，避免误触重复生成。",
        "点击“更多”可打开完整音色列表，确认后会带回当前面板。"
      ];

  return `
    <div class="overlay" data-action="close-modal">
      <div class="dialog help-dialog">
        <div class="dialog-head">
          <div class="dialog-title-wrap">
            <span class="dialog-badge">?</span>
            <span class="dialog-title">如何使用</span>
          </div>
          <button class="dialog-close" data-action="close-modal">×</button>
        </div>
        <div class="dialog-body">
          <div class="help-list">
            ${items.map((item, index) => `<div class="help-item"><strong>0${index + 1}</strong> ${item}</div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMoreModal() {
  const orderedTimbres = buildOrderedMoreTimbres();
  return `
    <div class="overlay" data-action="close-modal">
      <div class="dialog">
        <div class="dialog-head">
          <div class="dialog-title-wrap">
            <span class="dialog-badge">◉</span>
            <span class="dialog-title">音色选择</span>
          </div>
          <button class="dialog-close" data-action="close-modal">×</button>
        </div>
        <div class="dialog-body">
          <div class="dialog-grid">
            ${orderedTimbres.map((item) => `
              <button class="dialog-item ${state.modalSelection === item ? "active" : ""}" data-action="pick-more-timbre" data-timbre="${item}">
                ${item}
              </button>
            `).join("")}
          </div>
        </div>
        <div class="dialog-footer">
          <button class="dialog-confirm" data-action="confirm-more">确认</button>
        </div>
      </div>
    </div>
  `;
}

function renderOverlay() {
  if (state.modal === "help") {
    overlayRoot.innerHTML = renderHelpModal();
    return;
  }
  if (state.modal === "more") {
    overlayRoot.innerHTML = renderMoreModal();
    return;
  }
  overlayRoot.innerHTML = "";
}

function renderMain() {
  renderHeaderAction();
  renderSavedList();

  tabRead.classList.toggle("active", state.activeTab === "read");
  tabConvert.classList.toggle("active", state.activeTab === "convert");

  if (state.activeTab === "read") {
    readPanel.classList.add("read-panel-shell");
    inputPanel.classList.remove("read-panel-shell");
    resultPanel.classList.remove("read-panel-shell");
    readPanel.hidden = false;
    inputPanel.hidden = true;
    resultPanel.hidden = true;
    renderReadPanel();
    inputPanel.innerHTML = "";
    resultPanel.innerHTML = "";
  } else {
    readPanel.classList.remove("read-panel-shell");
    inputPanel.classList.remove("read-panel-shell");
    resultPanel.classList.remove("read-panel-shell");
    readPanel.hidden = true;
    readPanel.innerHTML = "";
    if (state.convertStage === "input") {
      inputPanel.hidden = false;
      resultPanel.hidden = true;
      renderConvertInputPanel();
      resultPanel.innerHTML = "";
    } else {
      inputPanel.hidden = true;
      resultPanel.hidden = false;
      renderConvertResultPanel();
      inputPanel.innerHTML = "";
    }
  }

  renderOverlay();
}

function openMore(target) {
  state.modal = "more";
  state.modalTarget = target;
  state.modalSelection = target === "read" ? state.selectedReadTimbre : state.selectedConvertTimbre;
  renderOverlay();
}

function finishConvertGenerating(nextStage = "result") {
  window.clearTimeout(state.generateTimer);
  state.generateTimer = window.setTimeout(() => {
    state.isGenerating = false;
    state.recordWillCancel = false;
    state.recordPointerId = null;
    state.recordStartY = 0;
    state.generatedConvertTimbre = state.selectedConvertTimbre;
    state.generatedConvertEmotion = state.convertEmotion;
    state.generatedConvertSpeed = state.convertSpeed;
    state.generatedConvertVolume = state.convertVolume;
    state.convertStage = nextStage;
    renderMain();
  }, 1500);
}

function beginRecordGesture(pointerId, clientY) {
  if (state.isGenerating || state.isRecording) return;
  state.inputMoreOpen = false;
  state.uploadedAudioName = "";
  state.isRecording = true;
  state.recordWillCancel = false;
  state.recordPointerId = pointerId;
  state.recordStartY = clientY;
  renderMain();
}

function updateRecordGesture(clientY) {
  if (!state.isRecording) return;
  const nextWillCancel = clientY < state.recordStartY - 56;
  if (nextWillCancel !== state.recordWillCancel) {
    state.recordWillCancel = nextWillCancel;
    renderMain();
  }
}

function finishRecordGesture(cancelled = false) {
  if (!state.isRecording) return;
  const shouldCancel = cancelled || state.recordWillCancel;
  state.isRecording = false;
  state.recordWillCancel = false;
  state.recordPointerId = null;
  state.recordStartY = 0;
  if (shouldCancel) {
    renderMain();
    return;
  }
  state.isGenerating = true;
  renderMain();
  finishConvertGenerating("result");
}

function finishReadGenerating() {
  window.clearTimeout(state.generateTimer);
  state.generateTimer = window.setTimeout(() => {
    state.isGenerating = false;
    state.generatedReadTimbre = state.selectedReadTimbre;
    state.readCanSave = true;
    renderMain();
  }, 1200);
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button");
  const action = target.getAttribute("data-action") || button?.getAttribute("data-action") || "";
  const playId = target.getAttribute("data-saved-play") || button?.getAttribute("data-saved-play");
  const timbre = target.getAttribute("data-timbre") || button?.getAttribute("data-timbre") || "";
  const actionTarget = target.getAttribute("data-target") || button?.getAttribute("data-target") || "";
  const resultKey = target.getAttribute("data-result") || button?.getAttribute("data-result");

  if (playId) {
    state.playingSavedId = state.playingSavedId === playId ? null : playId;
    renderSavedList();
    if (state.playingSavedId) {
      window.clearTimeout(state.playTimer);
      state.playTimer = window.setTimeout(() => {
        state.playingSavedId = null;
        renderSavedList();
      }, 3000);
    }
    return;
  }

  if (action === "play-result" && resultKey) {
    state.playingResult = state.playingResult === resultKey ? null : resultKey;
    renderMain();
    return;
  }

  if (action === "select-timbre" && timbre) {
    if (actionTarget === "convert" && (state.isRecording || state.isGenerating)) {
      return;
    }
    if (actionTarget === "read") {
      state.selectedReadTimbre = timbre;
    } else {
      state.selectedConvertTimbre = timbre;
    }
    renderMain();
    return;
  }

  if (action === "open-more") {
    if (actionTarget === "convert" && (state.isRecording || state.isGenerating)) {
      return;
    }
    state.inputMoreOpen = false;
    openMore(actionTarget);
    return;
  }

  if (action === "pick-more-timbre" && timbre) {
    state.modalSelection = timbre;
    renderOverlay();
    return;
  }

  if (action === "confirm-more") {
    if (state.modalTarget === "read") {
      state.selectedReadTimbre = state.modalSelection;
      state.surfacedReadTimbre = getSurfacedTimbre(readTimbres, state.modalSelection);
    } else {
      state.selectedConvertTimbre = state.modalSelection;
      state.surfacedConvertTimbre = getSurfacedTimbre(convertTimbres, state.modalSelection);
    }
    state.modal = null;
    renderMain();
    return;
  }

  if (action === "open-help") {
    state.inputMoreOpen = false;
    state.modal = "help";
    renderOverlay();
    return;
  }

  if (action === "toggle-input-more") {
    if (state.isRecording || state.isGenerating) {
      return;
    }
    state.inputMoreOpen = !state.inputMoreOpen;
    renderMain();
    return;
  }

  if (action === "close-modal") {
    state.modal = null;
    renderOverlay();
    return;
  }

  if (button?.id === "tabRead") {
    if (isConvertBusy()) return;
    state.inputMoreOpen = false;
    state.activeTab = "read";
    renderMain();
    return;
  }

  if (button?.id === "tabConvert") {
    if (isConvertBusy()) return;
    state.inputMoreOpen = false;
    state.activeTab = "convert";
    renderMain();
    return;
  }

  if (button?.id === "regenBtn") {
    if (!canRegenerateConvert()) {
      return;
    }
    state.isGenerating = true;
    renderMain();
    finishConvertGenerating("result");
    return;
  }

  if (button?.id === "reRecordBtn") {
    resetConvertToInput();
    renderMain();
    return;
  }

  if (button?.id === "saveBtn") {
    state.convertSaved.unshift({
      id: String(Date.now()),
      title: `用户语音_转${state.selectedConvertTimbre}_${String(state.convertSaved.length + 1).padStart(2, "0")}`,
      subtitle: "审核中，完成后可试听",
      status: "reviewing"
    });
    resetConvertToInput();
    renderMain();
    return;
  }

  if (action === "generate-read") {
    if (state.isGenerating) return;
    state.isGenerating = true;
    state.readCanSave = false;
    renderMain();
    finishReadGenerating();
    return;
  }

  if (action === "save-read") {
    if (!state.readCanSave) return;
    state.readSaved.unshift({
      id: `r${Date.now()}`,
      title: `${state.generatedReadTimbre}_音频_${state.readSaved.length + 425}`,
      body: state.readText
    });
    state.readCanSave = false;
    renderMain();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.id === "uploadAudioInput" && target instanceof HTMLInputElement) {
    const file = target.files?.[0];
    if (!file) return;
    state.inputMoreOpen = false;
    state.uploadedAudioName = file.name;
    state.isRecording = false;
    state.isGenerating = true;
    renderMain();
    finishConvertGenerating("result");
    return;
  }

  if (target.id === "convertEmotionSelect") state.convertEmotion = target.value;
  if (target.id === "convertSpeedSelect") state.convertSpeed = target.value;
  if (target.id === "convertVolumeRange") state.convertVolume = Number(target.value);
  if (target.id === "readEmotionSelect") state.readEmotion = target.value;
  if (target.id === "readSpeedSelect") state.readSpeed = target.value;
  if (target.id === "readVolumeRange") state.readVolume = Number(target.value);

  renderMain();
});

document.addEventListener("pointerdown", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button");
  if (button?.id !== "recordBtn") return;
  if (state.isGenerating || state.isRecording) return;
  event.preventDefault();
  beginRecordGesture(event.pointerId, event.clientY);
});

document.addEventListener("pointermove", (event) => {
  if (!state.isRecording || state.recordPointerId !== event.pointerId) return;
  updateRecordGesture(event.clientY);
});

document.addEventListener("pointerup", (event) => {
  if (!state.isRecording || state.recordPointerId !== event.pointerId) return;
  finishRecordGesture(false);
});

document.addEventListener("pointercancel", (event) => {
  if (!state.isRecording || state.recordPointerId !== event.pointerId) return;
  finishRecordGesture(true);
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement)) return;
  if (target.id === "readTextInput") {
    state.readText = target.value;
    const counter = target.parentElement?.querySelector(".textarea-count");
    if (counter) {
      counter.textContent = `${target.value.length}/100`;
    }
  }
});

window.state = state;
renderMain();
