# 动画场景维护指南

## 当前架构

`index.html` 包含三部分：

1. 页面壳层：顶部栏、侧栏、动画舞台和讲解步骤区。
2. 场景注册：每个概念通过 `window.SCENES.push(...)` 注册。
3. 滚动控制器：根据当前讲解步骤调用场景的 `apply(root, stepIndex)`。

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
- 场景样式必须限定在 `.scene-{id}` 或共享的 `.interview-flow` 下。
- 窄屏不依赖 hover；触控区域不小于 44px。
- 信息卡在移动端优先横滑，避免把动画区撑得过高。
- 动画不是必要时，使用文字卡片而不是强行制作动效。

## 修改流程

1. 修改 `index.html`。
2. 运行 `npm run check`。
3. 运行 `npm run dev`，分别检查桌面端和移动端。
4. 更新 `CHANGELOG.md`。
5. 提交一个聚焦、可回滚的 Git commit。

## 后续拆分建议

当前版本保留单文件，便于离线携带。场景继续增多后，可将源码拆为：

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
