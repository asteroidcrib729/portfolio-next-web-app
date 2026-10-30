import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { ensureCiTool, projectRoot, runCiTool } from "./ci-tool.mjs";

function git(args) {
  const result = spawnSync("git", args, { cwd: projectRoot, encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || "Git inventory failed.");
  return result.stdout;
}

try {
  if (git(["rev-parse", "--is-shallow-repository"]).trim() === "true") {
    throw new Error(
      "Secret scanning requires full history. Fetch it with git fetch --unshallow first.",
    );
  }
  const binary = await ensureCiTool("gitleaks");
  const reports = path.join(projectRoot, ".local", "security");
  mkdirSync(reports, { recursive: true });
  const common = ["--redact=100", "--no-banner", "--report-format=json"];
  const historyStatus = runCiTool(binary, [
    "git",
    ...common,
    "--log-opts=--all",
    `--report-path=${path.join(reports, "gitleaks-history.json")}`,
    projectRoot,
  ]);

  // Include pending source changes while keeping Git-ignored local credentials out
  // of the filesystem scan. Ignored paths remain covered if committed to history.
  const snapshot = mkdtempSync(path.join(reports, "source-"));
  let sourceStatus;
  try {
    const files = git([
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "--deduplicate",
      "-z",
    ])
      .split("\0")
      .filter(Boolean);
    for (const relative of files) {
      const source = path.resolve(projectRoot, relative);
      const destination = path.resolve(snapshot, relative);
      if (!source.startsWith(projectRoot) || !destination.startsWith(snapshot + path.sep)) {
        throw new Error("Source inventory contains an unsafe path.");
      }
      if (!existsSync(source)) continue;
      const info = lstatSync(source);
      if (info.isSymbolicLink())
        throw new Error(`Refusing to follow a source symlink: ${relative}`);
      if (!info.isFile()) continue;
      mkdirSync(path.dirname(destination), { recursive: true });
      copyFileSync(source, destination);
    }
    sourceStatus = runCiTool(binary, [
      "dir",
      ...common,
      `--report-path=${path.join(reports, "gitleaks-source.json")}`,
      snapshot,
    ]);
  } finally {
    const resolvedSnapshot = realpathSync(snapshot);
    const resolvedReports = realpathSync(reports);
    const resolvedWorkspace = realpathSync(projectRoot);
    if (
      !resolvedSnapshot.startsWith(resolvedReports + path.sep) ||
      !resolvedSnapshot.startsWith(resolvedWorkspace + path.sep)
    ) {
      throw new Error("Refusing to remove a snapshot outside the project security directory.");
    }
    rmSync(resolvedSnapshot, { recursive: true, force: true });
  }
  process.exitCode = historyStatus === 0 && sourceStatus === 0 ? 0 : 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
