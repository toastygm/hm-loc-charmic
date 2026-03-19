import path from "path";
import process from "process";
import { spawnSync } from "child_process";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);

dotenv.config({ path: path.join(repoRoot, ".env.local") });
dotenv.config({ path: path.join(repoRoot, ".env") });

const MODULE_ID = "hm-loc-charmic";
const SOURCE = "build/stage/";

const STAGE_ENV_MAP = {
    dev: "FOUNDRYVTT_DEV_DATA",
    qa: "FOUNDRYVTT_QA_DATA",
    prod: "FOUNDRYVTT_PROD_DATA",
};

function resolveStage(stageArg) {
    return String(stageArg || "")
        .trim()
        .toLowerCase();
}

function main() {
    const stage = resolveStage(process.argv[2]);
    if (!stage) {
        console.error("Usage: node utils/push-stage.mjs <dev|qa|prod>");
        process.exit(1);
    }

    const envVarName = STAGE_ENV_MAP[stage];
    if (!envVarName) {
        console.error(
            `Invalid stage '${stage}'. Valid stages are: ${Object.keys(STAGE_ENV_MAP).join(", ")}.`,
        );
        process.exit(1);
    }

    const dataRoot = process.env[envVarName]?.trim() ?? "";

    if (!dataRoot) {
        console.error(
            `No destination configured for stage '${stage}'. Set environment variable ${envVarName}.`,
        );
        console.error(`Example: ${envVarName}="/path/to/foundryvtt/data"`);
        process.exit(1);
    }

    const colonIdx = dataRoot.indexOf(":");
    const isRemote = colonIdx > 0 && !dataRoot.startsWith("/");
    const destination = isRemote
        ? `${dataRoot.slice(0, colonIdx + 1)}${path.posix.join(dataRoot.slice(colonIdx + 1), `Data/modules/${MODULE_ID}/`)}`
        : path.join(dataRoot, "Data", "modules", MODULE_ID) + "/";

    if (isRemote) {
        const check = spawnSync("rsync", ["--version"], { stdio: "ignore" });
        if (check.error) {
            console.error(
                `Remote destination requires rsync, but it is not installed or not in PATH.`,
            );
            process.exit(1);
        }
    }

    const args = ["-avh", "--delete", SOURCE, destination];
    const result = spawnSync("rsync", args, { stdio: "inherit" });

    if (result.error) {
        console.error(`Failed to run rsync: ${result.error.message}`);
        process.exit(1);
    }

    process.exit(result.status ?? 0);
}

main();
