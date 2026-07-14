import { readFile } from "node:fs/promises";
import vm from "node:vm";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(
  (match) => match[1],
);

if (!html.includes('<meta name="viewport"')) {
  throw new Error("缺少移动端 viewport 声明");
}

if (!html.includes('id="stage"') || !html.includes('id="steps"')) {
  throw new Error("缺少滚动叙事所需的 stage 或 steps 容器");
}

scripts.forEach((source, index) => {
  new vm.Script(source, { filename: `inline-${index}.js` });
});

const context = vm.createContext({ window: {}, console });

// 最后一段脚本负责操作真实 DOM；其余脚本只注册场景，可在 Node 中安全检查。
scripts.slice(0, -1).forEach((source, index) => {
  new vm.Script(source, { filename: `scene-${index}.js` }).runInContext(context);
});

const scenes = context.window.SCENES;

if (!Array.isArray(scenes) || scenes.length === 0) {
  throw new Error("没有注册任何动画场景");
}

const ids = new Set();
let stepCount = 0;

for (const scene of scenes) {
  if (!scene.id || !scene.title || !scene.cat) {
    throw new Error("场景缺少 id、title 或 cat");
  }
  if (ids.has(scene.id)) {
    throw new Error(`场景 id 重复：${scene.id}`);
  }
  if (!Array.isArray(scene.steps) || scene.steps.length === 0) {
    throw new Error(`场景没有步骤：${scene.id}`);
  }
  if (typeof scene.apply !== "function") {
    throw new Error(`场景缺少 apply 方法：${scene.id}`);
  }
  ids.add(scene.id);
  stepCount += scene.steps.length;
}

console.log(`检查通过：${scenes.length} 个场景，${stepCount} 个滚动步骤，${scripts.length} 段脚本。`);
