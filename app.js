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
const LEVEL_FILTERS = ["L1", "L2", "L3", "L4", "L5", "L6"];
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
const LOCAL_ADDED_BOOKS_STORAGE_KEY = "yuexingren:knowledge-map:added-books:v1";
const LOCAL_REMOVED_BOOKS_STORAGE_KEY = "yuexingren:knowledge-map:removed-books:v1";
const LOCAL_BOOK_ORDER_STORAGE_KEY = "yuexingren:knowledge-map:book-order:v1";
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
  addBookButton: document.querySelector("#addBookButton"),
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
  addBookDialog: document.querySelector("#addBookDialog"),
  addBookForm: document.querySelector("#addBookForm"),
  addBookLevel: document.querySelector("#addBookLevel"),
  addBookPosition: document.querySelector("#addBookPosition"),
  addBookTitle: document.querySelector("#addBookTitle"),
  addBookTypeOptions: document.querySelector("#addBookTypeOptions"),
  closeAddBookDialogButton: document.querySelector("#closeAddBookDialogButton"),
  cancelAddBookButton: document.querySelector("#cancelAddBookButton"),
  railCount: document.querySelector("#railCount"),
  bookNav: document.querySelector("#bookNav"),
  resultSummary: document.querySelector("#resultSummary"),
  topicBoard: document.querySelector("#topicBoard"),
  topicCloud: document.querySelector("#topicCloud"),
  typeCloud: document.querySelector("#typeCloud"),
  bookGrid: document.querySelector("#bookGrid"),
  emptyState: document.querySelector("#emptyState"),
  emptyStateTitle: document.querySelector("#emptyStateTitle"),
  emptyStateHint: document.querySelector("#emptyStateHint"),
};

const state = {
  query: "",
  topic: "all",
  type: "all",
  level: "all",
  editMode: false,
  editingBookId: null,
};

const baseBookIds = new Set(books.map((book) => book.id));
const baseBookOrder = books.map((book) => book.id);
let localEdits = readLocalEdits();
let localAddedBooks = readLocalAddedBooks();
let localRemovedBookIds = new Set(readStringArray(LOCAL_REMOVED_BOOKS_STORAGE_KEY));
let localBookOrder = readStringArray(LOCAL_BOOK_ORDER_STORAGE_KEY);

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

function readStringArray(storageKey) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((value) => typeof value === "string" && value))];
  } catch {
    return [];
  }
}

function sanitizeAddedBook(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (typeof value.id !== "string" || !value.id || !LEVEL_FILTERS.includes(value.level)) return null;
  if (typeof value.title !== "string" || !value.title.trim()) return null;
  return {
    level: value.level,
    title: value.title.trim(),
    valueGoals: typeof value.valueGoals === "string" ? value.valueGoals : "",
    knowledgeGoals: typeof value.knowledgeGoals === "string" ? value.knowledgeGoals : "",
    abilityGoals: typeof value.abilityGoals === "string" ? value.abilityGoals : "",
    abilityInferred: false,
    id: value.id,
    index: Number.isFinite(value.index) ? value.index : 0,
    levelIndex: Number.isFinite(value.levelIndex) ? value.levelIndex : 0,
    bookTypes: Array.isArray(value.bookTypes)
      ? [...new Set(value.bookTypes.filter((typeId) => TYPE_BY_ID.has(typeId)))]
      : [],
  };
}

function readLocalAddedBooks() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_ADDED_BOOKS_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeAddedBook).filter(Boolean);
  } catch {
    return [];
  }
}

function applyLocalEdits() {
  books.forEach((book) => {
    const edit = localEdits[book.id];
    if (!edit) return;
    Object.assign(book, edit);
  });
}

function normalizeBookCollection() {
  const levelCounts = new Map();
  books.forEach((book, index) => {
    const levelIndex = (levelCounts.get(book.level) || 0) + 1;
    levelCounts.set(book.level, levelIndex);
    book.index = index + 1;
    book.levelIndex = levelIndex;
  });
  library.total = books.length;
  levels.splice(
    0,
    levels.length,
    ...LEVEL_FILTERS.map((id) => ({ id, count: levelCounts.get(id) || 0 }))
  );
  library.levels = levels;
}

function applyLocalChanges() {
  localAddedBooks.forEach((book) => {
    if (!books.some((item) => item.id === book.id)) books.push({ ...book, bookTypes: [...book.bookTypes] });
  });

  if (localRemovedBookIds.size) {
    const remainingBooks = books.filter((book) => !localRemovedBookIds.has(book.id));
    books.splice(0, books.length, ...remainingBooks);
  }

  if (localBookOrder.length) {
    const orderById = new Map(localBookOrder.map((bookId, index) => [bookId, index]));
    const currentOrder = new Map(books.map((book, index) => [book.id, index]));
    books.sort((first, second) => {
      const firstOrder = orderById.get(first.id) ?? localBookOrder.length + currentOrder.get(first.id);
      const secondOrder = orderById.get(second.id) ?? localBookOrder.length + currentOrder.get(second.id);
      return firstOrder - secondOrder;
    });
  }

  applyLocalEdits();
  normalizeBookCollection();
}

function persistStructuralChanges() {
  localBookOrder = books.map((book) => book.id);
  window.localStorage.setItem(LOCAL_ADDED_BOOKS_STORAGE_KEY, JSON.stringify(localAddedBooks));
  window.localStorage.setItem(LOCAL_REMOVED_BOOKS_STORAGE_KEY, JSON.stringify([...localRemovedBookIds]));
  if (bookOrderDiffersFromBase()) {
    window.localStorage.setItem(LOCAL_BOOK_ORDER_STORAGE_KEY, JSON.stringify(localBookOrder));
  } else {
    localBookOrder = [];
    window.localStorage.removeItem(LOCAL_BOOK_ORDER_STORAGE_KEY);
  }
}

function bookOrderDiffersFromBase() {
  if (books.length !== baseBookOrder.length) return true;
  return books.some((book, index) => book.id !== baseBookOrder[index]);
}

function hasLocalChanges() {
  return Boolean(
    Object.keys(localEdits).length || localAddedBooks.length || localRemovedBookIds.size || bookOrderDiffersFromBase()
  );
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
  if (!hasLocalChanges()) {
    setEditStatus("当前没有可导出的修改。");
    return;
  }

  const payload = {
    format: "yuexingren-knowledge-map-local-edits",
    version: 2,
    exportedAt: new Date().toISOString(),
    books: editedBooks,
    addedBooks: localAddedBooks,
    removedBookIds: [...localRemovedBookIds],
    bookOrder: localBookOrder,
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
  setEditStatus(
    `已导出 ${editedBooks.length} 项内容修改、${localAddedBooks.length} 本新增书目和 ${localRemovedBookIds.size} 本删除书目。`
  );
}

function clearLocalEdits() {
  if (!hasLocalChanges()) {
    setEditStatus("当前没有本地修改。");
    return;
  }
  if (!window.confirm("确定恢复线上内容吗？当前浏览器中的内容修改、新增和删除记录都将被清除。")) return;
  window.localStorage.removeItem(LOCAL_EDITS_STORAGE_KEY);
  window.localStorage.removeItem(LOCAL_ADDED_BOOKS_STORAGE_KEY);
  window.localStorage.removeItem(LOCAL_REMOVED_BOOKS_STORAGE_KEY);
  window.localStorage.removeItem(LOCAL_BOOK_ORDER_STORAGE_KEY);
  window.location.reload();
}

function openPublishDialog() {
  if (!hasLocalChanges()) {
    setEditStatus("请先保存内容修改、新增书目或删除书目。");
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

function renderAddBookTypeOptions() {
  if (!els.addBookTypeOptions) return;
  els.addBookTypeOptions.replaceChildren(
    ...BOOK_TYPES.map((type) => {
      const label = createNode("label", "editor-type-option");
      const checkbox = createNode("input");
      checkbox.type = "checkbox";
      checkbox.name = "bookTypes";
      checkbox.value = type.id;
      label.append(checkbox, createNode("span", "", type.name));
      return label;
    })
  );
}

function updateAddBookPosition() {
  if (!els.addBookLevel || !els.addBookPosition) return;
  const levelCount = books.filter((book) => book.level === els.addBookLevel.value).length;
  els.addBookPosition.max = String(levelCount + 1);
  els.addBookPosition.value = String(levelCount + 1);
}

function openAddBookDialog() {
  els.addBookForm?.reset();
  if (els.addBookLevel) {
    els.addBookLevel.value = LEVEL_FILTERS.includes(state.level) ? state.level : "L1";
  }
  updateAddBookPosition();
  els.addBookDialog?.showModal();
  els.addBookTitle?.focus();
}

function closeAddBookDialog() {
  els.addBookDialog?.close();
}

function createBookId(level) {
  const randomPart = window.crypto?.randomUUID
    ? window.crypto.randomUUID().replaceAll("-", "").slice(0, 10)
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  return `${level.toLowerCase()}-book-local-${randomPart}`;
}

function getBookInsertIndex(level, position) {
  const levelBooks = books.filter((book) => book.level === level);
  const targetBook = levelBooks[position - 1];
  if (targetBook) return books.indexOf(targetBook);
  const lastLevelBook = levelBooks.at(-1);
  if (lastLevelBook) return books.indexOf(lastLevelBook) + 1;
  const levelRank = LEVEL_FILTERS.indexOf(level);
  const nextLevelBook = books.find((book) => LEVEL_FILTERS.indexOf(book.level) > levelRank);
  return nextLevelBook ? books.indexOf(nextLevelBook) : books.length;
}

function moveBookWithinLevel(book, requestedPosition) {
  const levelCount = books.filter((item) => item.level === book.level).length;
  const position = Math.min(Math.max(requestedPosition, 1), levelCount);
  if (position === book.levelIndex) return false;
  const currentIndex = books.indexOf(book);
  if (currentIndex < 0) return false;
  books.splice(currentIndex, 1);
  books.splice(getBookInsertIndex(book.level, position), 0, book);
  normalizeBookCollection();
  persistStructuralChanges();
  return true;
}

function handleAddBookSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const level = String(formData.get("level") || "");
  const title = String(formData.get("title") || "").trim();
  if (!LEVEL_FILTERS.includes(level) || !title) return;

  const levelCount = books.filter((book) => book.level === level).length;
  const requestedPosition = Number.parseInt(String(formData.get("position") || ""), 10);
  const position = Math.min(Math.max(Number.isFinite(requestedPosition) ? requestedPosition : levelCount + 1, 1), levelCount + 1);
  const book = {
    level,
    title,
    valueGoals: String(formData.get("valueGoals") || "").trim(),
    knowledgeGoals: String(formData.get("knowledgeGoals") || "").trim(),
    abilityGoals: String(formData.get("abilityGoals") || "").trim(),
    abilityInferred: false,
    id: createBookId(level),
    index: 0,
    levelIndex: 0,
    bookTypes: formData.getAll("bookTypes").map(String).filter((typeId) => TYPE_BY_ID.has(typeId)),
  };

  books.splice(getBookInsertIndex(level, position), 0, book);
  localAddedBooks.push(book);
  normalizeBookCollection();
  persistStructuralChanges();
  state.level = level;
  state.query = "";
  state.topic = "all";
  state.type = "all";
  state.editingBookId = null;
  if (els.searchInput) els.searchInput.value = "";
  closeAddBookDialog();
  renderHeroStats();
  render();
  setEditStatus(`已在 ${level} 第 ${book.levelIndex} 位新增《${book.title.replace(/[《》]/g, "")}》。`);
  scrollToBook(book.id);
}

function deleteBook(book) {
  const plainTitle = book.title.replace(/[《》]/g, "");
  if (!window.confirm(`确定删除《${plainTitle}》吗？删除会先保存在当前浏览器，发布后才会同步到云端。`)) return;

  localAddedBooks = localAddedBooks.filter((item) => item.id !== book.id);
  if (baseBookIds.has(book.id)) localRemovedBookIds.add(book.id);
  delete localEdits[book.id];
  if (Object.keys(localEdits).length) {
    window.localStorage.setItem(LOCAL_EDITS_STORAGE_KEY, JSON.stringify(localEdits));
  } else {
    window.localStorage.removeItem(LOCAL_EDITS_STORAGE_KEY);
  }
  const bookIndex = books.findIndex((item) => item.id === book.id);
  if (bookIndex >= 0) books.splice(bookIndex, 1);
  state.editingBookId = null;
  normalizeBookCollection();
  persistStructuralChanges();
  renderHeroStats();
  render();
  setEditStatus(`已在当前浏览器删除《${plainTitle}》。`);
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
  if (!options.multiline && options.type) field.type = options.type;
  if (options.min !== undefined) field.min = String(options.min);
  if (options.max !== undefined) field.max = String(options.max);
  if (options.step !== undefined) field.step = String(options.step);
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
  const positionField = createEditorField("本级序号", "levelIndex", book.levelIndex, {
    type: "number",
    required: true,
    min: 1,
    max: books.filter((item) => item.level === book.level).length,
    step: 1,
    hint: `输入 1-${books.filter((item) => item.level === book.level).length}，保存后自动调整前后书目的编号。`,
  });
  positionField.classList.add("editor-field--position");
  form.append(positionField);
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
    const requestedPosition = Number.parseInt(String(formData.get("levelIndex") || ""), 10);
    const moved = Number.isFinite(requestedPosition) ? moveBookWithinLevel(book, requestedPosition) : false;

    book.title = title;
    book.knowledgeGoals = String(formData.get("knowledgeGoals") || "").trim();
    book.valueGoals = String(formData.get("valueGoals") || "").trim();
    book.abilityGoals = String(formData.get("abilityGoals") || "").trim();
    book.bookTypes = formData.getAll("bookTypes").map(String).filter((typeId) => TYPE_BY_ID.has(typeId));
    saveBookEdit(book);
    state.editingBookId = null;
    setEditStatus(
      moved
        ? `已保存《${book.title.replace(/[《》]/g, "")}》，并调整为 ${book.level} 第 ${book.levelIndex} 位。`
        : `已在当前浏览器保存《${book.title.replace(/[《》]/g, "")}》的修改。`
    );
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
  if (localAddedBooks.some((item) => item.id === book.id)) {
    title.append(createNode("small", "local-edit-note", "本地新增"));
  } else if (localEdits[book.id]) {
    title.append(createNode("small", "local-edit-note", "已本地修改"));
  }
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
    const deleteButton = createNode("button", "book-delete-button", "删除此书");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => deleteBook(book));
    meta.append(editButton, deleteButton);
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
  const hasChanges = hasLocalChanges();
  document.body.classList.toggle("is-editing", state.editMode);
  if (els.editModeButton) {
    els.editModeButton.textContent = state.editMode ? "退出编辑" : "编辑内容";
    els.editModeButton.setAttribute("aria-pressed", String(state.editMode));
  }
  if (els.editPanel) els.editPanel.hidden = !state.editMode;
  if (els.publishEditsButton) els.publishEditsButton.disabled = !hasChanges;
  if (els.exportEditsButton) els.exportEditsButton.disabled = !hasChanges;
  if (els.clearEditsButton) els.clearEditsButton.disabled = !hasChanges;
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
  const emptyLevel = state.level !== "all" && levelBooks.length === 0;
  els.emptyState.hidden = filteredBooks.length > 0;
  if (els.emptyStateTitle) els.emptyStateTitle.textContent = emptyLevel ? `${state.level} 暂无书目` : "没有匹配的书目";
  if (els.emptyStateHint) {
    els.emptyStateHint.textContent = emptyLevel
      ? "进入编辑模式后，可以点击“新增书目”添加内容。"
      : "换一个关键词或学识主题试试。";
  }
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
els.addBookButton?.addEventListener("click", openAddBookDialog);
els.exportEditsButton?.addEventListener("click", exportLocalEdits);
els.clearEditsButton?.addEventListener("click", clearLocalEdits);
els.publishForm?.addEventListener("submit", handlePublishSubmit);
els.closePublishDialogButton?.addEventListener("click", closePublishDialog);
els.cancelPublishButton?.addEventListener("click", closePublishDialog);
els.publishDialog?.addEventListener("close", () => {
  if (els.githubTokenInput) els.githubTokenInput.value = "";
});
els.addBookForm?.addEventListener("submit", handleAddBookSubmit);
els.addBookLevel?.addEventListener("change", updateAddBookPosition);
els.closeAddBookDialogButton?.addEventListener("click", closeAddBookDialog);
els.cancelAddBookButton?.addEventListener("click", closeAddBookDialog);

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

applyLocalChanges();
renderAddBookTypeOptions();
initAccessGate();
renderHeroStats();
render();
