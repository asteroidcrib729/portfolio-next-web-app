import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const tools = JSON.parse(
  readFileSync(new URL("../.github/security-tools.json", import.meta.url), "utf8"),
);

export async function ensureCiTool(name) {
  if (!Object.hasOwn(tools, name)) throw new Error(`Unknown CI tool: ${name}`);
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

  const directory = path.join(projectRoot, ".local", "tools", name, tool.version);
  mkdirSync(directory, { recursive: true });
  const archive = path.join(directory, asset.name);
  let bytes;
  if (existsSync(archive)) {
    bytes = readFileSync(archive);
  } else {
    const url = `https://github.com/${tool.repository}/releases/download/v${tool.version}/${asset.name}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Could not download ${name}: HTTP ${response.status}.`);
    bytes = Buffer.from(await response.arrayBuffer());
  }
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== asset.sha256) throw new Error(`Checksum verification failed for ${name}.`);
  if (!existsSync(archive)) writeFileSync(archive, bytes);

  const binaryName = `${name}${process.platform === "win32" ? ".exe" : ""}`;
  const extraction = spawnSync("tar", ["-xf", archive, "-C", directory, binaryName], {
    stdio: "inherit",
    windowsHide: true,
  });
  if (extraction.error) throw extraction.error;
  if (extraction.status !== 0) throw new Error(`Could not extract ${name}.`);
  const binary = path.join(directory, binaryName);
  if (process.platform !== "win32") chmodSync(binary, 0o755);
  console.log(`Verified ${name} ${tool.version} (${platform}).`);
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
