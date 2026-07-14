import { cp, mkdir, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const sourceRoot = new URL("../.codex/skills/", import.meta.url);
const targetRoot = join(homedir(), ".codex", "skills");
const skills = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());

await mkdir(targetRoot, { recursive: true });
for (const skill of skills) {
  const source = new URL(skill.name + "/", sourceRoot);
  const target = join(targetRoot, skill.name);
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true, force: true });
  console.log("已安装 Skill：" + target);
}
