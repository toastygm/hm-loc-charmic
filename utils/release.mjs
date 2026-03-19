import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);

dotenv.config({ path: path.join(repoRoot, ".env.local") });
dotenv.config({ path: path.join(repoRoot, ".env") });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error(
        "GITHUB_TOKEN is not set. Add it to .env.local or set it in your environment.",
    );
    process.exit(1);
}

const DIST_DIR = path.join(repoRoot, "build", "dist");
const moduleJsonPath = path.join(DIST_DIR, "module.json");
const zipPath = path.join(DIST_DIR, "module.zip");

if (!fs.existsSync(moduleJsonPath)) {
    console.error(
        "Missing build/dist/module.json. Run 'npm run deploy:release' first.",
    );
    process.exit(1);
}

if (!fs.existsSync(zipPath)) {
    console.error(
        "Missing build/dist/module.zip. Run 'npm run deploy:release' first.",
    );
    process.exit(1);
}

const moduleJson = JSON.parse(fs.readFileSync(moduleJsonPath, "utf8"));
const version = moduleJson.version;
const title = moduleJson.title;
const tag = `v${version}`;

// Derive owner/repo from package.json repository URL
const pkg = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"),
);
const repoUrl = pkg.repository.url.replace(/\.git$/, "").replace(/\/$/, "");
const [REPO_OWNER, REPO_NAME] = repoUrl.split("/").slice(-2);

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function createRelease() {
    console.log(`Creating GitHub release ${tag} for ${title}...`);

    const release = await octokit.repos.createRelease({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        tag_name: tag,
        name: `${title} ${tag}`,
        target_commitish: "main",
        body: `Release ${tag}`,
        draft: false,
        prerelease: false,
    });

    const releaseId = release.data.id;
    console.log(`Created release: ${release.data.html_url}`);

    async function uploadAsset(filePath, name, contentType) {
        const content = fs.readFileSync(filePath);
        await octokit.repos.uploadReleaseAsset({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            release_id: releaseId,
            name,
            data: content,
            headers: {
                "content-type": contentType,
                "content-length": content.length,
            },
        });
        console.log(`Uploaded ${name}`);
    }

    await uploadAsset(zipPath, "module.zip", "application/zip");
    await uploadAsset(moduleJsonPath, "module.json", "application/json");

    console.log("Release complete!");
}

createRelease().catch((err) => {
    console.error("Release failed:", err.message ?? err);
    process.exit(1);
});
