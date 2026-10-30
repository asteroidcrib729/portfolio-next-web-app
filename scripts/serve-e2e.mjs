import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { tmpdir } from "node:os";
import path from "node:path";

// Exercise real Secure cookies in every browser without committing TLS keys.
const tlsDirectory = mkdtempSync(path.join(tmpdir(), "portfolio-e2e-tls-"));
const keyPath = path.join(tlsDirectory, "key.pem");
const certPath = path.join(tlsDirectory, "cert.pem");
const gitOpenSsl = "C:\\Program Files\\Git\\usr\\bin\\openssl.exe";
const openssl = process.platform === "win32" && existsSync(gitOpenSsl) ? gitOpenSsl : "openssl";
try {
  execFileSync(
    openssl,
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-days",
      "1",
      "-subj",
      "/CN=localhost",
      "-addext",
      "subjectAltName=DNS:localhost,IP:127.0.0.1",
      "-keyout",
      keyPath,
      "-out",
      certPath,
    ],
    { stdio: "pipe" },
  );
} catch {
  rmSync(tlsDirectory, { recursive: true, force: true });
  throw new Error(
    "Browser tests require OpenSSL on PATH, or the OpenSSL bundled with Git for Windows.",
  );
}

const next = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3101"],
  { stdio: "inherit", env: process.env, windowsHide: true },
);

const proxy = https.createServer(
  { key: readFileSync(keyPath), cert: readFileSync(certPath) },
  (request, response) => {
    const upstream = http.request(
      {
        hostname: "127.0.0.1",
        port: 3101,
        method: request.method,
        path: request.url,
        headers: { ...request.headers, "x-forwarded-proto": "https" },
      },
      (incoming) => {
        response.writeHead(incoming.statusCode ?? 502, incoming.headers);
        incoming.pipe(response);
      },
    );
    upstream.on("error", () => {
      response.writeHead(503);
      response.end("Test server is starting.");
    });
    request.pipe(upstream);
  },
);

let closing = false;
function close(code = 0) {
  if (closing) return;
  closing = true;
  next.kill();
  proxy.close();
  rmSync(tlsDirectory, { recursive: true, force: true });
  process.exitCode = code;
}
next.on("exit", (code) => close(code ?? 1));
process.on("SIGINT", () => close());
process.on("SIGTERM", () => close());
proxy.listen(3100, "127.0.0.1");
