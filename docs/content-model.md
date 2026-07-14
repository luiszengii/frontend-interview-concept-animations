# 内容数据模型

这个项目的核心不是某一页 HTML，而是一组可追溯的内容记录。

    Question ──引用──> Source
        │
        ├──绑定──> Animation Scene（可选）
        │
        └──被记录在──> Interview Recap ──属于──> Company

## 题目

题目保存在 `data/questions.json`，使用稳定、全局唯一的 `id`。每道题至少有一个来源 ID，并可选关联一个动画场景 ID。

公司出现次数使用 `companyOccurrences` 保存，每一项至少包含公司名称、次数和关联复盘 ID。不要只保存一个无法追溯的总数字。

## 来源

来源保存在 `data/sources.json`。概念题优先采用官方文档、规范或论文；公司原题优先关联用户自己的复盘。无法确认的链接必须标记为 `needs-source-review`，不能伪造成已核验。

## 复盘

每次复盘保存在 `data/interviews.json`，包含日期、公司、岗位（可选）、题目 ID 和原始题干（可选）。新增复盘时，同时更新对应题目的公司出现次数。

## 标签

- `questionType`：`concept`（八股/原理）或 `scenario`（项目/场景）。
- `track`：知识方向，例如 `React`、`AI 前端`、`工程化`。
- `tags`：技术检索词，不混入公司名称。
- 公司名称只放在 `companyOccurrences` 和复盘记录中。
