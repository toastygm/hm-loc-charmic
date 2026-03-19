import { mkdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const STAGE_DIR = resolve("build/stage");
const moduleTemplatePath = resolve("assets/templates/module.template.json");
const moduleJsonPath = resolve(STAGE_DIR, "module.json");
const packageJsonPath = resolve("package.json");

await mkdir(STAGE_DIR, { recursive: true });

const [templateRaw, packageRaw] = await Promise.all([
    readFile(moduleTemplatePath, "utf-8"),
    readFile(packageJsonPath, "utf-8"),
]);

const template = JSON.parse(templateRaw);
const pkg = JSON.parse(packageRaw);

template.version = pkg.version;
template.url = "https://github.com/toastygm/hm-loc-charmic";
template.bugs = "https://github.com/toastygm/hm-loc-charmic/issues";
template.manifest =
    "https://github.com/toastygm/hm-loc-charmic/releases/latest/download/module.json";
template.download = `https://github.com/toastygm/hm-loc-charmic/releases/download/v${pkg.version}/module.zip`;

await writeFile(moduleJsonPath, JSON.stringify(template, null, 2), "utf-8");

console.log(`Wrote ${moduleJsonPath}`);
