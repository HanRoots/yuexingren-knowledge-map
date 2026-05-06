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

const els = {
  heroStats: document.querySelector("#heroStats"),
  levelTabs: document.querySelector("#levelTabs"),
  searchInput: document.querySelector("#searchInput"),
  knowledgeSelect: document.querySelector("#knowledgeSelect"),
  typeSelect: document.querySelector("#typeSelect"),
  resetButton: document.querySelector("#resetButton"),
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
};

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

function renderBookCard(book) {
  const card = createNode("article", "book-card");
  card.id = book.id;

  const header = createNode("div", "book-card__header");
  const title = createNode("div", "book-title");
  title.append(createNode("span", "", `${book.level} · No.${String(book.levelIndex).padStart(2, "0")}`));
  title.append(createNode("h3", "", book.title));
  title.append(renderTypePills(book));
  title.append(renderTopicPills(book));

  const count = createNode("div", "goal-count");
  count.append(createNode("strong", "", getBookTopics(book).length));
  count.append(createNode("small", "", "学识主题"));
  header.append(title, count);

  const goals = createNode("div", "goal-list");
  goals.append(renderGoalRow("学识目标", book.knowledgeGoals, "knowledge"));
  goals.append(renderGoalRow("价值观", book.valueGoals, "value"));
  goals.append(renderGoalRow("书籍类型", getBookTypes(book).map((type) => type.name), "type"));
  goals.append(renderGoalRow("能力目标", book.abilityGoals, "ability"));

  card.append(header, goals);
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

renderHeroStats();
render();
