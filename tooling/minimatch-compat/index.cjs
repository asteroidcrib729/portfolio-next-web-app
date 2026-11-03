"use strict";

// The callable CommonJS export is the compatibility contract of this facade.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require("@portfolio/minimatch-engine");

// Older ESLint plugins call require("minimatch") directly. Modern consumers
// use named exports instead. Both surfaces delegate to the same patched engine.
const legacyMatch = Object.assign(
  (path, pattern, options) => engine.minimatch(path, pattern, options),
  engine,
);

// eslint-plugin-import's no-internal-modules rule uses makeRe() only as a
// reusable .test() predicate. v11 intentionally no longer compiles RegExps;
// preserve that consumer's predicate contract without recreating the old engine.
legacyMatch.makeRe = (pattern, options) => {
  const matcher = new engine.Minimatch(pattern, options);
  return Object.freeze({ test: (path) => matcher.match(path) });
};

module.exports = legacyMatch;
