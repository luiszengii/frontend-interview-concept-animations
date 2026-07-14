# 动画场景维护指南

## 当前架构

页面由三部分组成：

1. `index.html`：顶部栏、侧栏、动画舞台、讲解步骤区和滚动控制器。
2. 场景注册：每个概念通过 `window.SCENES.push(...)` 注册；体量较大的新场景可放在 `assets/interview-scenes.js`。
3. 场景样式：内联旧场景继续维护，新场景集中在 `assets/interview-scenes.css`，但每个场景必须有自己的命名空间。

场景对象的基本结构：

```js
window.SCENES.push({
  id: "unique-scene-id",
  title: "侧栏与舞台显示的标题",
  cat: "AI",
  css: `.scene-unique-scene-id { /* 场景私有样式 */ }`,
  html: `<div class="scene-unique-scene-id"></div>`,
  steps: [
    { n: "第一步讲解", status: "idle" },
    { n: "第二步讲解", status: "running" },
  ],
  apply(root, stepIndex) {
    const step = this.steps[stepIndex];
    // 根据步骤状态更新舞台。
  },
});
```

## 新增场景检查清单

- `id` 全局唯一，并使用小写连字符命名。
- `title` 直接表达面试概念，不使用模糊标题。
- `cat` 优先复用现有分类：`JS 基础`、`React`、`工程化`、`性能·网络`、`AI`。
- 每个步骤只表达一个关键状态变化。
- 讲解遵循“问题 → 状态变化 → 边界 → 收益”的顺序。
- 场景样式必须限定在 `.scene-{id}` 下；禁止用共享的流程卡、进度点或同一 renderer 批量换文案。
- 先为概念选择空间隐喻（队列、时钟、分支、环路、管道、资源图等），再写 DOM；持续对象要在步骤间保留身份。
- 至少展示一处概念特有的边界或失败路径，而不只是从左到右点亮方框。
- 窄屏不依赖 hover；触控区域不小于 44px。
- 信息卡在移动端优先横滑，避免把动画区撑得过高。
- 动画不是必要时，使用文字卡片而不是强行制作动效。

## 修改流程

1. 修改 `index.html`，或在 `assets/interview-scenes.js` 与 `assets/interview-scenes.css` 中新增场景。
2. 运行 `npm run check`。
3. 运行 `npm run dev`，分别检查桌面端和移动端。
4. 更新 `CHANGELOG.md`。
5. 提交一个聚焦、可回滚的 Git commit。

## 后续拆分建议

旧场景仍保留在单文件中，新增场景已开始外置。场景继续增多后，可进一步拆为：

```text
src/
  core/
    scrollytelling.js
  scenes/
    ai-token-stream.js
    event-loop.js
  styles/
    base.css
    mobile.css
```

构建时再生成单一 `index.html`，同时兼顾维护体验和离线分发。
