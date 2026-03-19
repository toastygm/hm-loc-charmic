/*
 * Bastard Bailiff — Foundry VTT module build utilities.
 * Copyright (c) 2024-2026 Tom Rodriguez ("Toasty") — <toasty@heroiclands.org>
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import fs from "fs";
import fsp from "fs/promises";
import archiver from "archiver";
import { mkdirSync } from "fs";
import { join, relative, resolve } from "path";

export async function packStage() {
    const STAGE_DIR = resolve("./build/stage");
    const RELEASE_DIR = resolve("./build/dist");
    mkdirSync(RELEASE_DIR, { recursive: true });

    const moduleJson = JSON.parse(
        await fsp.readFile(join(STAGE_DIR, "module.json"), "utf8"),
    );
    const version = moduleJson.version;
    const zipPath = join(RELEASE_DIR, "module.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(STAGE_DIR, false);
    await archive.finalize();

    await fsp.copyFile(
        join(STAGE_DIR, "module.json"),
        join(RELEASE_DIR, "module.json"),
    );

    console.log("Packaging for release complete:", relative(".", zipPath));
}

// CLI support
if (process.argv[1] === resolve("./utils/pack-release.mjs")) {
    packStage().catch((err) => {
        console.error("Packaging for release failed:", err);
        process.exit(1);
    });
}
