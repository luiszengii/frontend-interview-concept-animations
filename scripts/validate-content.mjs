import { readFile } from "node:fs/promises";

const readJson = async (relativePath) => JSON.parse(await readFile(new URL("../" + relativePath, import.meta.url), "utf8"));
const [sourceData, questionData, interviewData] = await Promise.all([readJson("data/sources.json"), readJson("data/questions.json"), readJson("data/interviews.json")]);
const sourceIds = new Set(sourceData.sources.map((source) => source.id));
const questionIds = new Set();
const questionById = new Map();
const interviewById = new Map();
let occurrenceCount = 0;

for (const source of sourceData.sources) {
  if (!source.id || !source.title || !source.publisher || !/^https:\/\//.test(source.url)) throw new Error("来源记录不完整：" + (source.id || "unknown"));
}

for (const interview of interviewData.interviews) {
  if (!interview.id || !interview.date || !interview.company || !Array.isArray(interview.questionIds)) throw new Error("面试复盘记录不完整：" + (interview.id || "unknown"));
  if (interviewById.has(interview.id)) throw new Error("复盘 id 重复：" + interview.id);
  interviewById.set(interview.id, interview);
}

for (const question of questionData.questions) {
  if (!question.id || !question.title || !question.prompt || !question.questionType || !question.track) throw new Error("题目字段不完整：" + (question.id || "unknown"));
  if (questionIds.has(question.id)) throw new Error("题目 id 重复：" + question.id);
  if (!Array.isArray(question.answerOutline) || question.answerOutline.length === 0) throw new Error("题目缺少回答骨架：" + question.id);
  if (!Array.isArray(question.fullAnswer) || question.fullAnswer.length < 2 || question.fullAnswer.some((paragraph) => typeof paragraph !== "string" || paragraph.trim().length < 30)) throw new Error("题目缺少可学习的正式回答：" + question.id);
  if (!Array.isArray(question.sources) || question.sources.length === 0) throw new Error("题目缺少来源：" + question.id);
  for (const sourceId of question.sources) { if (!sourceIds.has(sourceId)) throw new Error("题目引用了不存在的来源：" + question.id + " -> " + sourceId); }
  if (!Array.isArray(question.companyOccurrences)) throw new Error("companyOccurrences 必须是数组：" + question.id);
  for (const occurrence of question.companyOccurrences) {
    if (!occurrence.company || !Number.isInteger(occurrence.count) || occurrence.count < 1) throw new Error("公司出现记录无效：" + question.id);
    if (!Array.isArray(occurrence.interviewIds) || occurrence.interviewIds.length !== occurrence.count) throw new Error("公司次数与复盘证据不一致：" + question.id);
    for (const interviewId of occurrence.interviewIds) {
      const interview = interviewById.get(interviewId);
      if (!interview) throw new Error("公司出现记录引用了不存在的复盘：" + question.id + " -> " + interviewId);
      if (interview.company !== occurrence.company || !interview.questionIds.includes(question.id)) throw new Error("公司出现记录与复盘不匹配：" + question.id + " -> " + interviewId);
    }
    occurrenceCount += occurrence.count;
  }
  questionIds.add(question.id);
  questionById.set(question.id, question);
}

for (const interview of interviewData.interviews) {
  for (const questionId of interview.questionIds) {
    if (!questionIds.has(questionId)) throw new Error("复盘引用了不存在的题目：" + questionId);
    const occurrence = questionById.get(questionId).companyOccurrences.find((item) => item.company === interview.company && item.interviewIds.includes(interview.id));
    if (!occurrence) throw new Error("复盘题目缺少对应公司出现记录：" + interview.id + " -> " + questionId);
  }
}

for (const question of questionData.questions) {
  for (const relatedId of question.relatedQuestionIds || []) {
    if (!questionIds.has(relatedId)) throw new Error("题目引用了不存在的继续深挖题：" + question.id + " -> " + relatedId);
    if (relatedId === question.id) throw new Error("题目不能把自己列为继续深挖：" + question.id);
  }
}

console.log("内容检查通过：" + questionData.questions.length + " 道题，" + sourceData.sources.length + " 条来源，" + interviewData.interviews.length + " 次复盘，" + occurrenceCount + " 次公司出现记录。")
