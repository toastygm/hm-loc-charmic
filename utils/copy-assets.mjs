import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";

function copyFolder(src, dest) {
    if (!existsSync(src)) return;
    mkdirSync(dest, { recursive: true });
    for (const file of readdirSync(src)) {
        const srcPath = join(src, file);
        const destPath = join(dest, file);
        if (statSync(srcPath).isDirectory()) copyFolder(srcPath, destPath);
        else {
            mkdirSync(dirname(destPath), { recursive: true });
            copyFileSync(srcPath, destPath);
        }
    }
}

function copyFile(src, dest) {
    if (!existsSync(src)) return;
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
}

copyFolder("assets/images", "build/stage/assets/images");
copyFolder("assets/journal-icon-numbers", "build/stage/assets/journal-icon-numbers");
copyFolder("assets/scenes", "build/stage/assets/scenes");
copyFile("scripts/init.js", "build/stage/scripts/init.js");
copyFile("LICENSE", "build/stage/LICENSE");
copyFile("README.md", "build/stage/README.md");

console.log("Static assets copied.");
