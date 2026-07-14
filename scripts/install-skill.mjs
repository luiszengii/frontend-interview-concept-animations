import { cp, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const source = new URL("../.codex/skills/interview-recap-curator/", import.meta.url);
const target = join(homedir(), ".codex", "skills", "interview-recap-curator");
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true, force: true });
console.log("已安装 Skill：" + target);
