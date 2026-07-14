# 前端面试知识库

一个可持续维护的前端面试知识库：概念动画负责解释，题库负责沉淀八股题与场景题，复盘记录保存公司、出现次数和原始问题，来源数据让每个答案可查询。

## 项目特点

- 动画入口：[index.html](index.html)
- 题库与复盘入口：[question-bank.html](question-bank.html)
- data/ 保存题目、技术出处和面试复盘的单一事实来源
- .codex/skills/interview-recap-curator/ 是持续录入复盘的 Codex Skill 源码

- 34 组概念动画，覆盖 JavaScript、React、工程化、网络性能与 AI 前端
- 51 个针对真实项目追问新增的强化步骤
- 单文件、无框架依赖，下载 `index.html` 即可离线使用
- 桌面端采用双栏滚动叙事，移动端采用上方动画、下方讲解布局
- 支持触控横滑、安全区和“减少动态效果”系统设置

## 本地运行

需要 Node.js 18 或更高版本。

```bash
npm run check
npm run dev
```

然后访问 `http://127.0.0.1:4173`。

也可以直接双击打开 `index.html`，但使用本地服务器更接近 GitHub Pages 的运行方式。

## 内容分组

- JavaScript：Event Loop、闭包、作用域、深浅拷贝等
- React：Diff 与 key、memo、Effect、虚拟列表、imperative handle 等
- 工程化：Vite/Webpack、微前端、Axios/SSE 管道、Next.js、多租户、RBAC
- 网络与性能：缓存、URL 到页面、CORS、HTTP/2、Web Vitals、性能排查
- AI 前端：RAG、流式 Token、上下文压缩、ReAct 与 Skill

## 维护方式

新增或修改动画前，请先阅读 [动画场景维护指南](docs/scene-authoring.md)。每次提交前运行：

```bash
npm run check
```

项目采用“一个场景对应一个 `SCENES.push(...)` 注册项”的结构。后续可以在不改变交互框架的情况下，逐步把场景拆分为独立模块。

## 路线图

- [ ] 将大型单文件拆分为场景模块并保留静态构建产物
- [ ] 增加场景搜索与收藏
- [ ] 增加面试前速览模式
- [ ] 为关键场景补充可复制的高分回答
- [ ] 增加自动化移动端视觉回归

## 内容原则

优先为“状态变化、数据流转、边界处理、架构链路”制作动画。纯定义型八股题保留为文字说明，避免为了动画而动画。
