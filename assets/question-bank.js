const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
const labelType = (value) => value === "scenario" ? "场景 / 项目" : "八股 / 原理";
const labelStatus = (value) => value === "verified" ? "来源已核验" : "来源待补充核验";
let questions = [];
let sourceById = new Map();
let interviewById = new Map();

function occurrenceSummary(question) {
  const items = question.companyOccurrences || [];
  const total = items.reduce((sum, item) => sum + item.count, 0);
  if (!items.length) return { total, text: "暂无公司复盘记录" };
  return { total, text: items.map((item) => item.company + " × " + item.count).join(" · ") };
}

function uniquePublishers(sources) {
  const publishers = new Map();
  sources.forEach((source) => { if (!publishers.has(source.publisher)) publishers.set(source.publisher, source); });
  return [...publishers.values()];
}

function latestInterviewCompany(question) {
  const interviews = (question.companyOccurrences || []).flatMap((occurrence) =>
    (occurrence.interviewIds || []).map((id) => interviewById.get(id)).filter(Boolean)
  );
  interviews.sort((left, right) => right.date.localeCompare(left.date));
  return interviews[0]?.company || (question.companyOccurrences || [])[0]?.company || "暂无复盘";
}

function icon(name) {
  return '<i class="ph ph-' + name + '" aria-hidden="true"></i>';
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
    const haystack = [question.title, question.prompt].concat(question.tags || [], question.answerOutline || [], question.fullAnswer || []).join(" ").toLowerCase();
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
    const publishers = uniquePublishers(sources);
    const latestCompany = latestInterviewCompany(question);
    const detailUrl = "question.html?id=" + encodeURIComponent(question.id);
    const animationUrl = question.animationSceneId ? "index.html?scene=" + encodeURIComponent(question.animationSceneId) : "";
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<div class="card-kicker"><div class="card-kicker-copy">' + icon("chat-centered-dots") + '<span>' + (question.questionType === "scenario" ? "场景题" : "八股题") + ' · ' + escapeHtml(question.track) + '</span></div><div class="card-badges"><span class="badge ' + escapeHtml(question.questionType) + '">' + icon(question.questionType === "scenario" ? "briefcase" : "article") + labelType(question.questionType) + '</span><span class="badge ' + escapeHtml(question.difficulty) + '">' + icon("star") + escapeHtml(question.difficulty) + '</span></div></div>' +
      '<h2><a href="' + detailUrl + '">' + escapeHtml(question.title) + '</a></h2>' +
      '<p class="prompt">' + escapeHtml(question.prompt) + '</p>' +
      '<div class="tags">' + question.tags.map((tag) => '<span class="tag">' + escapeHtml(tag) + '</span>').join("") + '</div>' +
      '<div class="company-strip"><div>' + icon("buildings") + '<span>公司出现</span><strong>' + occurrence.total + ' 次</strong></div><div>' + icon("calendar-blank") + '<span>最近考察</span><strong>' + escapeHtml(latestCompany) + '</strong></div></div>' +
      '<section class="answer-panel"><div class="answer-heading">' + icon("list-bullets") + '<h3>高分回答骨架</h3></div><ul>' + question.answerOutline.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul><details class="full-answer"><summary>' + icon("article") + '<span>展开正式回答</span>' + icon("caret-down") + '</summary><div class="full-answer-body">' + question.fullAnswer.map((paragraph) => '<p>' + escapeHtml(paragraph) + '</p>').join("") + '</div></details><div class="card-actions"><a class="detail-link" href="' + detailUrl + '">' + icon("arrow-square-out") + '独立题目页</a>' + (animationUrl ? '<a class="animation-button" href="' + animationUrl + '" target="_blank" rel="noreferrer">' + icon("play") + '查看概念动画</a>' : "") + '</div></section>' +
      '<div class="card-footer"><div class="source-publishers">' + icon("link") + '<span>来源：</span>' + publishers.map((source) => '<a href="' + escapeHtml(source.url) + '" target="_blank" rel="noreferrer">' + escapeHtml(source.publisher) + '</a>').join('<span class="source-separator">·</span>') + '</div><div class="status ' + (question.sourceStatus === "verified" ? "" : "review") + '">' + icon("shield-check") + labelStatus(question.sourceStatus) + '</div></div>';
    list.appendChild(card);
  });
}

async function start() {
  try {
    const response = await Promise.all([fetch("data/questions.json"), fetch("data/sources.json"), fetch("data/interviews.json")]);
    if (response.some((item) => !item.ok)) throw new Error("request failed");
    const data = await Promise.all(response.map((item) => item.json()));
    questions = data[0].questions;
    sourceById = new Map(data[1].sources.map((source) => [source.id, source]));
    interviewById = new Map(data[2].interviews.map((interview) => [interview.id, interview]));
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
