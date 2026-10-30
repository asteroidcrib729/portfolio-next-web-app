import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const tools = JSON.parse(
  readFileSync(new URL("../.github/security-tools.json", import.meta.url), "utf8"),
);
const downloadUrls = {
  gitleaks: {
    "linux-x64":
      "https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz",
    "win32-x64":
      "https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_windows_x64.zip",
  },
  actionlint: {
    "linux-x64":
      "https://github.com/rhysd/actionlint/releases/download/v1.7.12/actionlint_1.7.12_linux_amd64.tar.gz",
    "win32-x64":
      "https://github.com/rhysd/actionlint/releases/download/v1.7.12/actionlint_1.7.12_windows_amd64.zip",
  },
};
const verifiedTools = new Map();

export async function ensureCiTool(name) {
  if (!Object.hasOwn(tools, name)) throw new Error(`Unknown CI tool: ${name}`);
  if (!Object.hasOwn(downloadUrls, name)) throw new Error(`No approved download for ${name}`);
  if (verifiedTools.has(name)) return verifiedTools.get(name);
  const tool = tools[name];
  const platform = `${process.platform}-${process.arch}`;
  const asset = tool.assets[platform];
  if (!asset) throw new Error(`No pinned ${name} binary is configured for ${platform}.`);
  if (
    path.basename(asset.name) !== asset.name ||
    !/^[a-f0-9]{64}$/.test(asset.sha256) ||
    !/^\d+\.\d+\.\d+$/.test(tool.version)
  ) {
    throw new Error(`Invalid pinned asset configuration for ${name}.`);
  }

  // URLs are literal allowlisted endpoints, not paths derived from file content.
  const url = downloadUrls[name][platform];
  if (!url || !url.endsWith(`/v${tool.version}/${asset.name}`))
    throw new Error("Download manifest and approved URL disagree.");
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Could not download ${name}: HTTP ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== asset.sha256) throw new Error(`Checksum verification failed for ${name}.`);

  const toolsRoot = path.join(projectRoot, ".local", "tools");
  mkdirSync(toolsRoot, { recursive: true });
  const root = realpathSync(toolsRoot);
  const directory = mkdtempSync(path.join(root, `${name}-${tool.version}-`));
  const resolvedDirectory = realpathSync(directory);
  process.once("exit", () => {
    // Delete only this exact private temporary directory, never a replaced link.
    const relative = path.relative(root, resolvedDirectory);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return;
    try {
      if (realpathSync(directory) === resolvedDirectory)
        rmSync(directory, { recursive: true, force: true });
    } catch {
      /* Best-effort cleanup; never broaden the target. */
    }
  });

  const binaryName = `${name}${process.platform === "win32" ? ".exe" : ""}`;
  // Windows libarchive needs a seekable ZIP. Only SHA-256-verified bytes are
  // persisted, to a fixed filename in a fresh private directory with exclusive
  // creation. There is no exists/check/write race or network-controlled path.
  const archive = path.join(directory, "verified-archive");
  writeFileSync(archive, bytes, { flag: "wx", mode: 0o600 });
  const extraction = spawnSync("tar", ["-xf", archive, "-C", directory, binaryName], {
    stdio: "inherit",
    windowsHide: true,
  });
  if (extraction.error) throw extraction.error;
  if (extraction.status !== 0) throw new Error(`Could not extract ${name}.`);
  const binary = path.join(directory, binaryName);
  if (process.platform !== "win32") chmodSync(binary, 0o755);
  console.log(`Verified ${name} ${tool.version} (${platform}).`);
  verifiedTools.set(name, binary);
  return binary;
}

export function runCiTool(binary, args, options = {}) {
  const result = spawnSync(binary, args, {
    cwd: projectRoot,
    stdio: "inherit",
    windowsHide: true,
    ...options,
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const [, , name, ...args] = process.argv;
    const binary = await ensureCiTool(name);
    process.exitCode = runCiTool(binary, args);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
