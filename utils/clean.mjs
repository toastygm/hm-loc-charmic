/*
 * Bastard Bailiff — Foundry VTT module build utilities.
 * Copyright (c) 2024-2026 Tom Rodriguez ("Toasty") — <toasty@heroiclands.org>
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);

const dirs = ["build"];

// If "distclean" is passed as an argument, also remove node_modules
if (process.argv.includes("--distclean")) {
    dirs.push("node_modules");
}

for (const dir of dirs) {
    const target = path.join(repoRoot, dir);
    try {
        fs.rmSync(target, { recursive: true, force: true });
        console.log(`Removed ${dir}`);
    } catch {
        // Already gone — nothing to do
    }
}
