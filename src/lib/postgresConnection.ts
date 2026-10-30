/** Preserve pg's current certificate-verifying behavior across future parser versions. */
export function withExplicitVerifiedTls(connectionString: string) {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    // Never include a possibly credential-bearing input in configuration errors.
    throw new Error("DATABASE_URL must be a valid connection URL.");
  }

  const mode = url.searchParams.get("sslmode");
  if (
    url.searchParams.get("uselibpqcompat") !== "true" &&
    mode &&
    ["prefer", "require", "verify-ca"].includes(mode)
  ) {
    url.searchParams.set("sslmode", "verify-full");
    return url.toString();
  }

  return connectionString;
}
