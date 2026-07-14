const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
const labelType = (value) => value === "scenario" ? "场景 / 项目" : "八股 / 原理";
const labelStatus = (value) => value === "verified" ? "来源已核验" : "来源待补充核验";
let questions = [];
let sourceById = new Map();

function occurrenceSummary(question) {
  const items = question.companyOccurrences || [];
  const total = items.reduce((sum, item) => sum + item.count, 0);
  if (!items.length) return { total, text: "暂无公司复盘记录" };
  return { total, text: items.map((item) => item.company + " × " + item.count).join(" · ") };
}

function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function render() {
  const search = $("#search").value.trim().toLowerCase();
  const track = $("#track").value;
  const type = $("#type").value;
  const sourceStatus = $("#sourceStatus").value;
  const filtered = questions.filter((question) => {
    const haystack = [question.title, question.prompt].concat(question.tags || []).join(" ").toLowerCase();
    return (!search || haystack.includes(search)) &&
      (!track || question.track === track) &&
      (!type || question.questionType === type) &&
      (!sourceStatus || question.sourceStatus === sourceStatus);
  });
  $("#resultInfo").textContent = "显示 " + filtered.length + " / " + questions.length + " 道题";
  const list = $("#questionList");
  list.innerHTML = "";
  if (!filtered.length) {
    list.innerHTML = '<div class="empty">没有匹配的题目，试试更少的筛选条件。</div>';
    return;
  }
  filtered.forEach((question) => {
    const occurrence = occurrenceSummary(question);
    const sources = question.sources.map((id) => sourceById.get(id)).filter(Boolean);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<div class="card-header"><h2><a style="color:inherit;text-decoration:none" href="question.html?id=' + encodeURIComponent(question.id) + '">' + escapeHtml(question.title) + '</a></h2><span class="badge ' + escapeHtml(question.questionType) + '">' + labelType(question.questionType) + '</span><span class="badge ' + escapeHtml(question.difficulty) + '">' + escapeHtml(question.difficulty) + '</span></div>' +
      '<p class="prompt">' + escapeHtml(question.prompt) + '</p>' +
      '<div class="tags">' + question.tags.map((tag) => '<span class="tag">' + escapeHtml(tag) + '</span>').join("") + '</div>' +
      '<div class="company"><strong>公司出现：' + occurrence.total + ' 次</strong><br>' + escapeHtml(occurrence.text) + '</div>' +
      '<details><summary>展开高分回答骨架</summary><ol>' + question.answerOutline.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ol></details>' +
      '<div class="sources"><a class="animation-link" href="question.html?id=' + encodeURIComponent(question.id) + '">独立题目页 →</a>' + sources.map((source) => '<a href="' + escapeHtml(source.url) + '" target="_blank" rel="noreferrer">来源：' + escapeHtml(source.publisher) + '</a>').join("") + (question.animationSceneId ? '<a class="animation-link" href="index.html?scene=' + encodeURIComponent(question.animationSceneId) + '">查看概念动画 →</a>' : "") + '</div>' +
      '<div class="status ' + (question.sourceStatus === "verified" ? "" : "review") + '">' + labelStatus(question.sourceStatus) + '</div>';
    list.appendChild(card);
  });
}

async function start() {
  try {
    const response = await Promise.all([fetch("data/questions.json"), fetch("data/sources.json")]);
    if (response.some((item) => !item.ok)) throw new Error("request failed");
    const data = await Promise.all(response.map((item) => item.json()));
    questions = data[0].questions;
    sourceById = new Map(data[1].sources.map((source) => [source.id, source]));
    const tracks = [...new Set(questions.map((question) => question.track))].sort();
    tracks.forEach((track) => $("#track").appendChild(createOption(track, track)));
    const occurrences = questions.reduce((sum, question) => sum + occurrenceSummary(question).total, 0);
    $("#questionCount").textContent = questions.length;
    $("#occurrenceCount").textContent = occurrences;
    $("#sourceCount").textContent = sourceById.size;
    ["search", "track", "type", "sourceStatus"].forEach((id) => $( "#" + id).addEventListener(id === "search" ? "input" : "change", render));
    render();
  } catch (error) {
    $("#loadError").hidden = false;
  }
}
start();
