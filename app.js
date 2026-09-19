const legacyLibrary = window.L3_LIBRARY
  ? {
      title: "L3 学识目标地图",
      levels: [{ id: window.L3_LIBRARY.level || "L3", count: window.L3_LIBRARY.books?.length || 0 }],
      total: window.L3_LIBRARY.books?.length || 0,
      books: window.L3_LIBRARY.books || [],
    }
  : null;

const library = window.LEVEL_LIBRARY || legacyLibrary || { title: "学识目标地图", levels: [], books: [] };
const books = library.books || [];
const levels = library.levels?.length
  ? library.levels
  : [...new Set(books.map((book) => book.level).filter(Boolean))].map((level) => ({
      id: level,
      count: books.filter((book) => book.level === level).length,
    }));
const LEVEL_FILTERS = ["L1", "L2", "L3", "L4", "L5"];
const ACCESS_PASSWORD_HASH = "635b5a00815ee51779764bf0a631f627cee354d1a4de48d4de09b59dd8555290";
const ACCESS_PASSWORD_FALLBACK = "WVhSMjAyNg==";

const KNOWLEDGE_TOPICS = [
  {
    id: "language",
    name: "词句理解",
    description: "解释词语、理解句意、体会语言表达效果",
    keywords: ["词语", "词句", "句子", "关键词", "含义", "上下文", "语境", "加点词", "重点句", "新鲜感", "深层含义"],
  },
  {
    id: "rhetoric",
    name: "修辞赏析",
    description: "识别并赏析比喻、拟人、排比、引用等表达方式",
    keywords: ["比喻", "拟人", "排比", "修辞", "拟声词", "引用", "反问", "双关", "生动的语言"],
  },
  {
    id: "character",
    name: "人物形象",
    description: "通过语言、动作、神态等描写分析人物",
    keywords: ["人物", "形象", "性格", "品质", "动作", "神态", "语言", "外貌", "心理", "对话", "内心", "情绪", "情感"],
  },
  {
    id: "summary",
    name: "内容概括",
    description: "抓关键句，按起因、经过、结果梳理内容",
    keywords: ["概括", "总结", "归纳", "起因", "经过", "结果", "六要素", "关键句", "梳理", "情节", "小标题", "段意"],
  },
  {
    id: "writing",
    name: "写作迁移",
    description: "把阅读方法迁移到仿写、续写和习作",
    keywords: ["写作", "习作", "续写", "仿写", "编写", "作文", "日记", "提纲", "写清楚", "描写", "读后感", "片段"],
  },
  {
    id: "observation",
    name: "观察写景",
    description: "学习观察方法，描写自然、动物和植物",
    keywords: ["观察", "五感", "写景", "景物", "自然", "动物", "植物", "外观", "色彩", "声音", "状物", "环境描写", "场景描写", "动态描写", "静态描写"],
  },
  {
    id: "exposition",
    name: "说明文阅读",
    description: "判断说明方法，理解说明文语言准确性",
    keywords: ["说明文", "说明方法", "列数字", "作比较", "举例子", "分类别", "引资料", "打比方", "说明对象", "说明文中词语", "科普"],
  },
  {
    id: "technique",
    name: "表现手法",
    description: "理解象征、对比、衬托、抑扬等写作手法",
    keywords: ["象征", "借物喻人", "借景抒情", "对比", "反复", "欲扬先抑", "先抑后扬", "明贬实褒", "侧面描写", "衬托", "表现手法", "语言风格"],
  },
  {
    id: "strategy",
    name: "阅读策略",
    description: "训练批注、提问、审题、检索和材料整合",
    keywords: ["批注", "提问", "提问策略", "审题", "答题思路", "题型", "启示", "感悟", "标题", "研究报告", "搜集信息", "非连续性文本", "多种材料"],
  },
  {
    id: "culture",
    name: "文化理解",
    description: "理解历史、传统文化、诗歌和古典文本背景",
    keywords: ["文化", "传统", "节日", "敦煌", "客家", "唐朝", "诗歌", "李白", "历史", "民间故事", "神话", "文言", "古代", "汉字", "鲁迅"],
  },
  {
    id: "logic",
    name: "逻辑流程",
    description: "梳理步骤、顺序、因果和文本结构",
    keywords: ["顺序", "步骤", "逻辑", "时间", "因果", "流程", "结构", "框架", "三叠式", "山形图", "思维导图"],
  },
];

const FALLBACK_TOPIC = {
  id: "integrated",
  name: "综合阅读",
  description: "综合运用阅读理解和表达方法",
  keywords: [],
};

const BOOK_TYPES = [
  { id: "picture", name: "图画绘本", description: "以图像叙事和图文共读为主" },
  { id: "bridge", name: "桥梁书", description: "短章节、低年级自主阅读过渡" },
  { id: "novel", name: "儿童小说", description: "成长、校园、冒险等叙事作品" },
  { id: "fairy", name: "童话寓言", description: "童话、寓言、幻想与民间想象" },
  { id: "science", name: "科普百科", description: "自然、身体、科技、宇宙等知识读物" },
  { id: "scifi", name: "科幻小说", description: "以科学想象推动情节的小说" },
  { id: "culture", name: "历史文化", description: "历史、地理、传统文化与古典文本" },
  { id: "biography", name: "传记纪实", description: "真实人物、时代故事和纪实叙述" },
  { id: "red", name: "红色经典", description: "革命历史、英雄人物和家国叙事" },
  { id: "classic", name: "经典名著", description: "中外文学经典与名家代表作" },
  { id: "prose", name: "散文诗歌", description: "散文、自然随笔、诗歌与语言美文" },
  { id: "project", name: "项目探究", description: "专题研究和综合性学习读物" },
];

const TYPE_BY_ID = new Map(BOOK_TYPES.map((type) => [type.id, type]));
const FALLBACK_TYPE = {
  id: "uncategorized",
  name: "综合阅读",
  description: "暂未归入单一书籍类型",
};

const LOCAL_EDITS_STORAGE_KEY = "yuexingren:knowledge-map:local-edits:v1";
const EDITABLE_BOOK_FIELDS = ["title", "knowledgeGoals", "valueGoals", "abilityGoals", "bookTypes"];
const GITHUB_OWNER = "HanRoots";
const GITHUB_REPOSITORY = "yuexingren-knowledge-map";
const GITHUB_BRANCH = "main";
const GITHUB_DATA_PATH = "data.js";
const GITHUB_API_VERSION = "2026-03-10";

const els = {
  authGate: document.querySelector("#authGate"),
  pageShell: document.querySelector("#pageShell"),
  passwordForm: document.querySelector("#passwordForm"),
  passwordInput: document.querySelector("#passwordInput"),
  passwordError: document.querySelector("#passwordError"),
  heroStats: document.querySelector("#heroStats"),
  levelTabs: document.querySelector("#levelTabs"),
  searchInput: document.querySelector("#searchInput"),
  knowledgeSelect: document.querySelector("#knowledgeSelect"),
  typeSelect: document.querySelector("#typeSelect"),
  editModeButton: document.querySelector("#editModeButton"),
  resetButton: document.querySelector("#resetButton"),
  editPanel: document.querySelector("#editPanel"),
  publishEditsButton: document.querySelector("#publishEditsButton"),
  exportEditsButton: document.querySelector("#exportEditsButton"),
  clearEditsButton: document.querySelector("#clearEditsButton"),
  editStatus: document.querySelector("#editStatus"),
  publishDialog: document.querySelector("#publishDialog"),
  publishForm: document.querySelector("#publishForm"),
  githubTokenInput: document.querySelector("#githubTokenInput"),
  commitMessageInput: document.querySelector("#commitMessageInput"),
  publishError: document.querySelector("#publishError"),
  confirmPublishButton: document.querySelector("#confirmPublishButton"),
  closePublishDialogButton: document.querySelector("#closePublishDialogButton"),
  cancelPublishButton: document.querySelector("#cancelPublishButton"),
  railCount: document.querySelector("#railCount"),
  bookNav: document.querySelector("#bookNav"),
  resultSummary: document.querySelector("#resultSummary"),
  topicBoard: document.querySelector("#topicBoard"),
  topicCloud: document.querySelector("#topicCloud"),
  typeCloud: document.querySelector("#typeCloud"),
  bookGrid: document.querySelector("#bookGrid"),
  emptyState: document.querySelector("#emptyState"),
};

const state = {
  query: "",
  topic: "all",
  type: "all",
  level: "all",
  editMode: false,
  editingBookId: null,
};

let localEdits = readLocalEdits();

function sanitizeBookEdit(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const edit = {};
  EDITABLE_BOOK_FIELDS.forEach((field) => {
    if (field === "bookTypes") {
      if (Array.isArray(value.bookTypes)) {
        edit.bookTypes = value.bookTypes.filter((typeId) => TYPE_BY_ID.has(typeId));
      }
      return;
    }
    if (typeof value[field] === "string") edit[field] = value[field];
  });
  return Object.keys(edit).length ? edit : null;
}

function readLocalEdits() {
  try {
    const raw = window.localStorage.getItem(LOCAL_EDITS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .map(([bookId, value]) => [bookId, sanitizeBookEdit(value)])
        .filter(([, value]) => value)
    );
  } catch {
    return {};
  }
}

function applyLocalEdits() {
  books.forEach((book) => {
    const edit = localEdits[book.id];
    if (!edit) return;
    Object.assign(book, edit);
  });
}

function saveBookEdit(book) {
  localEdits[book.id] = {
    title: book.title,
    knowledgeGoals: book.knowledgeGoals,
    valueGoals: book.valueGoals,
    abilityGoals: book.abilityGoals,
    bookTypes: Array.isArray(book.bookTypes) ? [...book.bookTypes] : [],
  };
  window.localStorage.setItem(LOCAL_EDITS_STORAGE_KEY, JSON.stringify(localEdits));
}

function setEditStatus(message) {
  if (els.editStatus) els.editStatus.textContent = message;
}

function exportLocalEdits() {
  const editedBooks = Object.entries(localEdits).map(([id, edit]) => ({ id, ...edit }));
  if (!editedBooks.length) {
    setEditStatus("当前没有可导出的修改。");
    return;
  }

  const payload = {
    format: "yuexingren-knowledge-map-local-edits",
    version: 1,
    exportedAt: new Date().toISOString(),
    books: editedBooks,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `阅星人学识地图-本地修改-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setEditStatus(`已导出 ${editedBooks.length} 本书的修改。`);
}

function clearLocalEdits() {
  if (!Object.keys(localEdits).length) {
    setEditStatus("当前没有本地修改。");
    return;
  }
  if (!window.confirm("确定恢复线上内容吗？当前浏览器中的全部本地修改将被清除。")) return;
  window.localStorage.removeItem(LOCAL_EDITS_STORAGE_KEY);
  window.location.reload();
}

function openPublishDialog() {
  if (!Object.keys(localEdits).length) {
    setEditStatus("请先保存至少一本书的修改。");
    return;
  }
  if (els.publishError) {
    els.publishError.hidden = true;
    els.publishError.textContent = "";
  }
  els.publishDialog?.showModal();
  els.githubTokenInput?.focus();
}

function closePublishDialog() {
  if (els.githubTokenInput) els.githubTokenInput.value = "";
  if (els.publishError) {
    els.publishError.hidden = true;
    els.publishError.textContent = "";
  }
  els.publishDialog?.close();
}

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return window.btoa(binary);
}

function buildDataFileContent() {
  return `window.LEVEL_LIBRARY = ${JSON.stringify(library, null, 2)};\n`;
}

function githubErrorMessage(status, responseMessage) {
  if (status === 401) return "令牌无效或已经过期，请重新生成后再试。";
  if (status === 403) return "令牌没有 Contents 写入权限，或 GitHub 暂时限制了请求。";
  if (status === 404) return "没有找到目标仓库，或令牌未获准访问该仓库。";
  if (status === 409) return "云端文件刚刚发生变化，请刷新页面后重新编辑并发布。";
  if (status === 422) return "GitHub 拒绝了本次提交，请检查更新说明后重试。";
  return responseMessage ? `发布失败：${responseMessage}` : `发布失败（HTTP ${status}）。`;
}

async function githubRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(githubErrorMessage(response.status, payload.message));
  return payload;
}

async function publishToGitHub(token, message) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/contents/${GITHUB_DATA_PATH}`;
  const currentFile = await githubRequest(`${apiUrl}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, token);
  const result = await githubRequest(apiUrl, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: encodeBase64(buildDataFileContent()),
      sha: currentFile.sha,
      branch: GITHUB_BRANCH,
    }),
  });
  return result.commit;
}

async function handlePublishSubmit(event) {
  event.preventDefault();
  const token = els.githubTokenInput?.value.trim() || "";
  const message = els.commitMessageInput?.value.trim() || "Update book content from page editor";
  if (!token) return;

  if (els.publishError) {
    els.publishError.hidden = true;
    els.publishError.textContent = "";
  }
  if (els.confirmPublishButton) {
    els.confirmPublishButton.disabled = true;
    els.confirmPublishButton.textContent = "正在发布…";
  }

  try {
    const commit = await publishToGitHub(token, message);
    closePublishDialog();
    const shortSha = commit?.sha ? commit.sha.slice(0, 7) : "";
    setEditStatus(`已提交到 GitHub${shortSha ? `（${shortSha}）` : ""}，页面通常会在几分钟内更新。`);
  } catch (error) {
    if (els.publishError) {
      els.publishError.textContent = error instanceof Error ? error.message : "发布失败，请稍后重试。";
      els.publishError.hidden = false;
    }
  } finally {
    if (els.githubTokenInput) els.githubTokenInput.value = "";
    if (els.confirmPublishButton) {
      els.confirmPublishButton.disabled = false;
      els.confirmPublishButton.textContent = "确认发布";
    }
  }
}

function splitAbilities(text) {
  return String(text || "")
    .split(/[、,，;；\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalize(text) {
  return String(text || "").toLowerCase().replace(/\s+/g, "");
}

function topicMatches(book, topic) {
  const haystack = normalize(book.knowledgeGoals);
  return topic.keywords.some((keyword) => haystack.includes(normalize(keyword)));
}

function getBookTopics(book) {
  const matched = KNOWLEDGE_TOPICS.filter((topic) => topicMatches(book, topic));
  return matched.length ? matched : [FALLBACK_TOPIC];
}

function getBookTypes(book) {
  const typeIds = Array.isArray(book.bookTypes) ? book.bookTypes : [];
  const matched = typeIds.map((typeId) => TYPE_BY_ID.get(typeId)).filter(Boolean);
  return matched.length ? matched : [FALLBACK_TYPE];
}

function getLevelBooks() {
  return state.level === "all" ? books : books.filter((book) => book.level === state.level);
}

function buildTopicStats(sourceBooks) {
  const allTopics = [...KNOWLEDGE_TOPICS, FALLBACK_TOPIC];
  return allTopics
    .map((topic) => ({
      ...topic,
      count: sourceBooks.filter((book) => getBookTopics(book).some((item) => item.id === topic.id)).length,
    }))
    .filter((topic) => topic.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}

function buildTypeStats(sourceBooks) {
  const allTypes = [...BOOK_TYPES, FALLBACK_TYPE];
  return allTypes
    .map((type) => ({
      ...type,
      count: sourceBooks.filter((book) => getBookTypes(book).some((item) => item.id === type.id)).length,
    }))
    .filter((type) => type.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}

function matchesBook(book) {
  const text = normalize(
    [
      book.title,
      book.level,
      book.valueGoals,
      book.knowledgeGoals,
      book.abilityGoals,
      getBookTypes(book)
        .map((type) => type.name)
        .join(" "),
    ].join(" ")
  );
  const queryOk = !state.query || text.includes(normalize(state.query));
  const topicOk = state.topic === "all" || getBookTopics(book).some((topic) => topic.id === state.topic);
  const typeOk = state.type === "all" || getBookTypes(book).some((type) => type.id === state.type);
  return queryOk && topicOk && typeOk;
}

function createNode(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function hashText(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function passwordIsValid(password) {
  if (window.crypto?.subtle && window.TextEncoder) {
    return (await hashText(password)) === ACCESS_PASSWORD_HASH;
  }
  return password === atob(ACCESS_PASSWORD_FALLBACK);
}

function unlockPage() {
  document.body.classList.remove("is-locked");
  els.pageShell?.removeAttribute("aria-hidden");
  if (els.authGate) els.authGate.hidden = true;
  if (els.passwordInput) els.passwordInput.value = "";
}

function initAccessGate() {
  els.passwordInput?.focus();
  els.passwordInput?.addEventListener("input", () => {
    if (els.passwordError) els.passwordError.hidden = true;
  });
  els.passwordForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = els.passwordInput?.value || "";
    passwordIsValid(password)
      .then((isValid) => {
        if (isValid) {
          unlockPage();
          return;
        }
        if (els.passwordError) els.passwordError.hidden = false;
        els.passwordInput?.select();
      })
      .catch(() => {
        if (els.passwordError) els.passwordError.hidden = false;
      });
  });
}

function renderHeroStats() {
  const stats = [
    [library.total || books.length, "书目总数"],
    [levels.length, "覆盖级别"],
    [buildTopicStats(books).length, "学识主题"],
    [buildTypeStats(books).length, "书籍类型"],
  ];

  els.heroStats.replaceChildren(
    ...stats.map(([value, label]) => {
      const tile = createNode("div", "stat-tile");
      tile.append(createNode("strong", "", value));
      tile.append(createNode("span", "", label));
      return tile;
    })
  );
}

function renderLevelTabs() {
  const tabs = [{ id: "all" }, ...LEVEL_FILTERS.map((id) => ({ id }))];
  els.levelTabs.replaceChildren(
    ...tabs.map((level) => {
      const label = level.id === "all" ? "全部" : level.id;
      const button = createNode("button", "", label);
      button.type = "button";
      button.classList.toggle("is-active", state.level === level.id);
      button.addEventListener("click", () => {
        state.level = level.id;
        state.topic = "all";
        state.type = "all";
        render();
      });
      return button;
    })
  );
}

function renderKnowledgeSelect(topicStats) {
  const options = [["all", "全部学识主题"], ...topicStats.map((topic) => [topic.id, topic.name])];
  els.knowledgeSelect.replaceChildren(
    ...options.map(([value, label]) => {
      const option = createNode("option", "", label);
      option.value = value;
      return option;
    })
  );
  els.knowledgeSelect.value = state.topic;
}

function renderTypeSelect(typeStats) {
  const options = [["all", "全部书籍类型"], ...typeStats.map((type) => [type.id, type.name])];
  els.typeSelect.replaceChildren(
    ...options.map(([value, label]) => {
      const option = createNode("option", "", label);
      option.value = value;
      return option;
    })
  );
  els.typeSelect.value = state.type;
}

function setTopic(topicId) {
  state.topic = topicId;
  render();
}

function setType(typeId) {
  state.type = typeId;
  render();
}

function renderTopicBoard(topicStats) {
  const cards = topicStats.map((topic) => {
    const card = createNode("button", "topic-card");
    card.type = "button";
    card.dataset.topic = topic.id;
    card.classList.toggle("is-active", state.topic === topic.id);
    card.append(createNode("strong", "", topic.name));
    card.append(createNode("span", "", topic.description));
    card.append(createNode("em", "", `${topic.count} 本书`));
    card.addEventListener("click", () => {
      setTopic(state.topic === topic.id ? "all" : topic.id);
    });
    return card;
  });
  els.topicBoard.replaceChildren(...cards);
}

function renderTopicCloud(topicStats) {
  const chips = topicStats.map((topic) => {
    const chip = createNode("button", "chip", `${topic.name} ${topic.count}`);
    chip.type = "button";
    chip.dataset.topic = topic.id;
    chip.classList.toggle("is-active", state.topic === topic.id);
    chip.addEventListener("click", () => {
      setTopic(state.topic === topic.id ? "all" : topic.id);
    });
    return chip;
  });
  els.topicCloud.replaceChildren(...chips);
}

function renderTypeCloud(typeStats) {
  const chips = typeStats.map((type) => {
    const chip = createNode("button", "chip type-chip", `${type.name} ${type.count}`);
    chip.type = "button";
    chip.dataset.type = type.id;
    chip.title = type.description;
    chip.classList.toggle("is-active", state.type === type.id);
    chip.addEventListener("click", () => {
      setType(state.type === type.id ? "all" : type.id);
    });
    return chip;
  });
  els.typeCloud.replaceChildren(...chips);
}

function renderBookNav(filteredBooks) {
  els.railCount.textContent = `${filteredBooks.length} 本`;
  const buttons = filteredBooks.map((book) => {
    const button = createNode("button");
    button.type = "button";
    button.dataset.target = book.id;
    button.append(createNode("span", "", `${book.level}-${String(book.levelIndex).padStart(2, "0")}`));
    button.append(createNode("span", "", book.title));
    button.addEventListener("click", () => {
      document.getElementById(book.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return button;
  });
  els.bookNav.replaceChildren(...buttons);
}

function renderTopicPills(book) {
  const pills = createNode("div", "book-topics");
  getBookTopics(book).forEach((topic) => {
    pills.append(createNode("span", "", topic.name));
  });
  return pills;
}

function renderTypePills(book) {
  const pills = createNode("div", "book-types");
  getBookTypes(book).forEach((type) => {
    pills.append(createNode("span", "", type.name));
  });
  return pills;
}

function renderGoalRow(label, body, mode = "text") {
  const row = createNode("div", `goal-row goal-row--${mode}`);
  row.append(createNode("div", "goal-label", label));

  if (mode === "ability" || mode === "type") {
    const items = Array.isArray(body) ? body : splitAbilities(body);
    if (items.length) {
      const tags = createNode("div", mode === "type" ? "type-tags" : "ability-tags");
      items.forEach((item) => tags.append(createNode("span", "", item)));
      row.append(tags);
    } else {
      row.append(createNode("p", "goal-text", "暂无内容"));
    }
  } else {
    row.append(createNode("p", "goal-text", body || "暂无内容"));
  }
  return row;
}

function createEditorField(labelText, name, value, options = {}) {
  const label = createNode("label", "editor-field");
  label.append(createNode("span", "editor-field__label", labelText));
  const field = createNode(options.multiline ? "textarea" : "input", "editor-field__control");
  field.name = name;
  field.value = value || "";
  if (options.multiline) field.rows = options.rows || 6;
  if (options.required) field.required = true;
  if (options.hint) label.append(createNode("small", "editor-field__hint", options.hint));
  label.insertBefore(field, label.querySelector("small"));
  return label;
}

function renderBookTypeEditor(book) {
  const fieldset = createNode("fieldset", "editor-types");
  fieldset.append(createNode("legend", "editor-field__label", "书籍类型"));
  const options = createNode("div", "editor-types__options");
  const selectedTypes = new Set(Array.isArray(book.bookTypes) ? book.bookTypes : []);

  BOOK_TYPES.forEach((type) => {
    const label = createNode("label", "editor-type-option");
    const checkbox = createNode("input");
    checkbox.type = "checkbox";
    checkbox.name = "bookTypes";
    checkbox.value = type.id;
    checkbox.checked = selectedTypes.has(type.id);
    label.append(checkbox, createNode("span", "", type.name));
    options.append(label);
  });

  fieldset.append(options);
  return fieldset;
}

function scrollToBook(bookId) {
  window.requestAnimationFrame(() => {
    document.getElementById(bookId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderBookEditor(book) {
  const form = createNode("form", "book-editor");
  form.append(createEditorField("书名", "title", book.title, { required: true }));
  form.append(createEditorField("学识目标", "knowledgeGoals", book.knowledgeGoals, { multiline: true, rows: 9 }));
  form.append(createEditorField("价值观", "valueGoals", book.valueGoals, { multiline: true, rows: 6 }));
  form.append(
    createEditorField("能力目标", "abilityGoals", book.abilityGoals, {
      multiline: true,
      rows: 4,
      hint: "多个能力目标可使用顿号、逗号或换行分隔。",
    })
  );
  form.append(renderBookTypeEditor(book));

  const actions = createNode("div", "book-editor__actions");
  const cancelButton = createNode("button", "book-editor__cancel", "取消");
  cancelButton.type = "button";
  cancelButton.addEventListener("click", () => {
    state.editingBookId = null;
    render();
    scrollToBook(book.id);
  });
  const saveButton = createNode("button", "book-editor__save", "保存修改");
  saveButton.type = "submit";
  actions.append(cancelButton, saveButton);
  form.append(actions);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    if (!title) return;

    book.title = title;
    book.knowledgeGoals = String(formData.get("knowledgeGoals") || "").trim();
    book.valueGoals = String(formData.get("valueGoals") || "").trim();
    book.abilityGoals = String(formData.get("abilityGoals") || "").trim();
    book.bookTypes = formData.getAll("bookTypes").map(String).filter((typeId) => TYPE_BY_ID.has(typeId));
    saveBookEdit(book);
    state.editingBookId = null;
    setEditStatus(`已在当前浏览器保存《${book.title.replace(/[《》]/g, "")}》的修改。`);
    render();
    scrollToBook(book.id);
  });

  return form;
}

function renderBookCard(book) {
  const card = createNode("article", "book-card");
  card.id = book.id;
  card.classList.toggle("book-card--editable", state.editMode);
  card.classList.toggle("book-card--editing", state.editingBookId === book.id);

  const header = createNode("div", "book-card__header");
  const title = createNode("div", "book-title");
  title.append(createNode("span", "", `${book.level} · No.${String(book.levelIndex).padStart(2, "0")}`));
  title.append(createNode("h3", "", book.title));
  if (localEdits[book.id]) title.append(createNode("small", "local-edit-note", "已本地修改"));
  title.append(renderTypePills(book));
  title.append(renderTopicPills(book));

  const meta = createNode("div", "book-card__meta");
  const count = createNode("div", "goal-count");
  count.append(createNode("strong", "", getBookTopics(book).length));
  count.append(createNode("small", "", "学识主题"));
  meta.append(count);
  if (state.editMode) {
    const editButton = createNode(
      "button",
      "book-edit-button",
      state.editingBookId === book.id ? "取消编辑" : "编辑此书"
    );
    editButton.type = "button";
    editButton.addEventListener("click", () => {
      state.editingBookId = state.editingBookId === book.id ? null : book.id;
      render();
      scrollToBook(book.id);
    });
    meta.append(editButton);
  }
  header.append(title, meta);

  card.append(header);
  if (state.editingBookId === book.id) {
    card.append(renderBookEditor(book));
  } else {
    const goals = createNode("div", "goal-list");
    goals.append(renderGoalRow("学识目标", book.knowledgeGoals, "knowledge"));
    goals.append(renderGoalRow("价值观", book.valueGoals, "value"));
    goals.append(renderGoalRow("书籍类型", getBookTypes(book).map((type) => type.name), "type"));
    goals.append(renderGoalRow("能力目标", book.abilityGoals, "ability"));
    card.append(goals);
  }
  return card;
}

function markActiveNav() {
  const cards = [...document.querySelectorAll(".book-card")];
  const active = cards.find((card) => card.getBoundingClientRect().top > 92) || cards.at(-1);
  const activeId = active?.id;
  els.bookNav.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === activeId);
  });
}

function renderEditControls() {
  const editCount = Object.keys(localEdits).length;
  document.body.classList.toggle("is-editing", state.editMode);
  if (els.editModeButton) {
    els.editModeButton.textContent = state.editMode ? "退出编辑" : "编辑内容";
    els.editModeButton.setAttribute("aria-pressed", String(state.editMode));
  }
  if (els.editPanel) els.editPanel.hidden = !state.editMode;
  if (els.publishEditsButton) els.publishEditsButton.disabled = editCount === 0;
  if (els.exportEditsButton) els.exportEditsButton.disabled = editCount === 0;
  if (els.clearEditsButton) els.clearEditsButton.disabled = editCount === 0;
}

function render() {
  const levelBooks = getLevelBooks();
  const topicStats = buildTopicStats(levelBooks);
  const typeStats = buildTypeStats(levelBooks);
  const topicById = new Map(topicStats.map((topic) => [topic.id, topic]));
  const typeById = new Map(typeStats.map((type) => [type.id, type]));
  if (state.topic !== "all" && !topicById.has(state.topic)) {
    state.topic = "all";
  }
  if (state.type !== "all" && !typeById.has(state.type)) {
    state.type = "all";
  }

  const filteredBooks = levelBooks.filter(matchesBook);
  if (state.editingBookId && !filteredBooks.some((book) => book.id === state.editingBookId)) {
    state.editingBookId = null;
  }
  const topicName = state.topic === "all" ? "全部学识主题" : topicById.get(state.topic)?.name || "学识主题";
  const typeName = state.type === "all" ? "全部书籍类型" : typeById.get(state.type)?.name || "书籍类型";
  const levelName = state.level === "all" ? "全部级别" : state.level;
  els.resultSummary.textContent = `显示 ${filteredBooks.length} / ${levelBooks.length} 本 · ${levelName} · ${topicName} · ${typeName}`;
  els.emptyState.hidden = filteredBooks.length > 0;
  els.bookGrid.replaceChildren(...filteredBooks.map(renderBookCard));
  renderLevelTabs();
  renderKnowledgeSelect(topicStats);
  renderTypeSelect(typeStats);
  renderBookNav(filteredBooks);
  renderTopicBoard(topicStats);
  renderTopicCloud(topicStats);
  renderTypeCloud(typeStats);
  renderEditControls();
  markActiveNav();
}

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

els.knowledgeSelect.addEventListener("change", (event) => {
  setTopic(event.target.value);
});

els.typeSelect.addEventListener("change", (event) => {
  setType(event.target.value);
});

els.editModeButton?.addEventListener("click", () => {
  state.editMode = !state.editMode;
  state.editingBookId = null;
  setEditStatus(state.editMode ? "请选择一本书开始编辑。" : "");
  render();
});

els.publishEditsButton?.addEventListener("click", openPublishDialog);
els.exportEditsButton?.addEventListener("click", exportLocalEdits);
els.clearEditsButton?.addEventListener("click", clearLocalEdits);
els.publishForm?.addEventListener("submit", handlePublishSubmit);
els.closePublishDialogButton?.addEventListener("click", closePublishDialog);
els.cancelPublishButton?.addEventListener("click", closePublishDialog);
els.publishDialog?.addEventListener("close", () => {
  if (els.githubTokenInput) els.githubTokenInput.value = "";
});

function resetFilters(event) {
  event?.preventDefault();
  state.query = "";
  state.topic = "all";
  state.type = "all";
  state.level = "all";
  els.searchInput.value = "";
  render();
}

els.resetButton.addEventListener("pointerdown", resetFilters);
els.resetButton.addEventListener("click", resetFilters);

window.addEventListener("scroll", markActiveNav, { passive: true });

applyLocalEdits();
initAccessGate();
renderHeroStats();
render();
