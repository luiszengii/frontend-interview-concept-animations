const $ = (selector) => document.querySelector(selector);
const escapeText = (value) => String(value == null ? "" : value);

async function start() {
  const id = new URLSearchParams(location.search).get("id");
  try {
    const responses = await Promise.all([fetch("data/questions.json"), fetch("data/sources.json")]);
    if (responses.some((response) => !response.ok)) throw new Error("data unavailable");
    const payloads = await Promise.all(responses.map((response) => response.json()));
    const question = payloads[0].questions.find((item) => item.id === id);
    if (!question) throw new Error("not found");
    const sourceById = new Map(payloads[1].sources.map((source) => [source.id, source]));
    document.title = question.title + " · 前端面试知识库";
    $("#track").textContent = question.track + " · " + (question.questionType === "scenario" ? "场景 / 项目题" : "八股 / 原理题");
    $("#title").textContent = question.title;
    $("#prompt").textContent = question.prompt;
    $("#meta").innerHTML = "";
    [question.difficulty].concat(question.tags || []).forEach((value) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = escapeText(value);
      $("#meta").appendChild(tag);
    });
    question.answerOutline.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      $("#answer").appendChild(item);
    });
    question.fullAnswer.forEach((value) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = value;
      $("#fullAnswer").appendChild(paragraph);
    });
    const companies = question.companyOccurrences || [];
    if (!companies.length) {
      $("#companies").innerHTML = '<p class="empty-note">暂无真实面试复盘记录。公司和次数只会从你的复盘中累积，不从网络面经推测。</p>';
    } else {
      companies.forEach((record) => {
        const row = document.createElement("div");
        row.className = "company-row";
        const name = document.createElement("strong");
        name.textContent = record.company;
        const count = document.createElement("span");
        count.textContent = record.count + " 次";
        row.append(name, count);
        $("#companies").appendChild(row);
      });
    }
    question.sources.map((sourceId) => sourceById.get(sourceId)).filter(Boolean).forEach((source) => {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = source.title;
      const publisher = document.createElement("small");
      publisher.textContent = source.publisher + " · " + source.kind;
      link.appendChild(publisher);
      $("#sources").appendChild(link);
    });
    const questionById = new Map(payloads[0].questions.map((item) => [item.id, item]));
    const relatedQuestions = (question.relatedQuestionIds || []).map((questionId) => questionById.get(questionId)).filter(Boolean);
    if (relatedQuestions.length) {
      relatedQuestions.forEach((related) => {
        const link = document.createElement("a");
        link.href = "question.html?id=" + encodeURIComponent(related.id);
        link.textContent = related.title;
        const meta = document.createElement("small");
        meta.textContent = related.track + " · " + (related.questionType === "scenario" ? "场景 / 项目题" : "八股 / 原理题");
        link.appendChild(meta);
        $("#related").appendChild(link);
      });
      $("#relatedBlock").hidden = false;
    }
    if (question.animationSceneId) {
      $("#animation").href = "index.html?scene=" + encodeURIComponent(question.animationSceneId);
      $("#animation").hidden = false;
    }
    $("#share").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        $("#share").textContent = "链接已复制";
      } catch {
        $("#share").textContent = "请复制浏览器地址";
      }
    });
    $("#detail").hidden = false;
  } catch {
    $("#notFound").hidden = false;
  }
}

start();
