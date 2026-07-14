import { readFile } from "node:fs/promises";
import vm from "node:vm";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const distinctSceneCss = await readFile(new URL("../assets/interview-scenes.css", import.meta.url), "utf8");
const distinctSceneScript = await readFile(new URL("../assets/interview-scenes.js", import.meta.url), "utf8");
const questionData = JSON.parse(await readFile(new URL("../data/questions.json", import.meta.url), "utf8"));
const scriptTags = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
const scripts = await Promise.all(
  scriptTags.map(async (match) => {
    const openTag = match[0].slice(0, match[0].indexOf(">") + 1);
    const src = openTag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
    if (!src) return match[1];
    if (/^(?:https?:)?\/\//i.test(src)) {
      throw new Error(`检查器不执行远程脚本：${src}`);
    }
    return readFile(new URL(`../${src.replace(/^\.\//, "")}`, import.meta.url), "utf8");
  }),
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
const distinctContext = vm.createContext({ window: {}, console });
new vm.Script(distinctSceneScript, { filename: "assets/interview-scenes.js" }).runInContext(distinctContext);
const distinctSceneIds = new Set((distinctContext.window.SCENES || []).map((scene) => scene.id));

if (distinctSceneIds.size === 0) {
  throw new Error("独立动画文件没有注册任何场景");
}

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
  if (/\binterview-flow\b/.test(scene.html || "")) {
    throw new Error(`场景仍在使用已禁用的通用 interview-flow 模板：${scene.id}`);
  }
  if (distinctSceneIds.has(scene.id)) {
    const rootClass = `scene-${scene.id}`;
    if (!(scene.html || "").includes(rootClass)) {
      throw new Error(`重做场景缺少独立舞台根节点：${scene.id}`);
    }
    if (!distinctSceneCss.includes(`.${rootClass}`)) {
      throw new Error(`重做场景缺少独立样式命名空间：${scene.id}`);
    }
  }
  ids.add(scene.id);
  stepCount += scene.steps.length;
}

for (const question of questionData.questions) {
  if (question.animationSceneId && !ids.has(question.animationSceneId)) {
    throw new Error(`题目关联了不存在的动画场景：${question.id} -> ${question.animationSceneId}`);
  }
}

console.log(`检查通过：${scenes.length} 个场景，${stepCount} 个滚动步骤，${scripts.length} 段脚本。`);
