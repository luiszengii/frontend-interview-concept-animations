import { readFile } from "node:fs/promises";

const readJson = async (relativePath) => JSON.parse(await readFile(new URL("../" + relativePath, import.meta.url), "utf8"));
const [sourceData, questionData, interviewData] = await Promise.all([readJson("data/sources.json"), readJson("data/questions.json"), readJson("data/interviews.json")]);
const sourceIds = new Set(sourceData.sources.map((source) => source.id));
const questionIds = new Set();
let occurrenceCount = 0;

for (const source of sourceData.sources) {
  if (!source.id || !source.title || !source.publisher || !/^https:\/\//.test(source.url)) throw new Error("来源记录不完整：" + (source.id || "unknown"));
}

for (const question of questionData.questions) {
  if (!question.id || !question.title || !question.prompt || !question.questionType || !question.track) throw new Error("题目字段不完整：" + (question.id || "unknown"));
  if (questionIds.has(question.id)) throw new Error("题目 id 重复：" + question.id);
  if (!Array.isArray(question.sources) || question.sources.length === 0) throw new Error("题目缺少来源：" + question.id);
  for (const sourceId of question.sources) { if (!sourceIds.has(sourceId)) throw new Error("题目引用了不存在的来源：" + question.id + " -> " + sourceId); }
  if (!Array.isArray(question.companyOccurrences)) throw new Error("companyOccurrences 必须是数组：" + question.id);
  for (const occurrence of question.companyOccurrences) {
    if (!occurrence.company || !Number.isInteger(occurrence.count) || occurrence.count < 1) throw new Error("公司出现记录无效：" + question.id);
    occurrenceCount += occurrence.count;
  }
  questionIds.add(question.id);
}

for (const interview of interviewData.interviews) {
  if (!interview.id || !interview.date || !interview.company || !Array.isArray(interview.questionIds)) throw new Error("面试复盘记录不完整：" + (interview.id || "unknown"));
  for (const questionId of interview.questionIds) { if (!questionIds.has(questionId)) throw new Error("复盘引用了不存在的题目：" + questionId); }
}

console.log("内容检查通过：" + questionData.questions.length + " 道题，" + sourceData.sources.length + " 条来源，" + interviewData.interviews.length + " 次复盘，" + occurrenceCount + " 次公司出现记录。")
