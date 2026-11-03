# Patched lint matching compatibility

This private build-only facade adapts the legacy `minimatch` API used by ESLint 9 and its React, import, and accessibility plugins to the official patched `minimatch` engine pinned at 11.0.4. It does not contain or fork the old matching implementation, and it is not a general-purpose replacement for every historical minimatch API.

## Why the facade exists

[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) flags minimatch versions below 11.0.1. The available lint packages still request versions 3 or 10. Replacing v3 directly with v11 breaks their callable CommonJS imports; the v11 namespace is no longer a callable function.

The root development dependency supplies this private workspace facade; scoped root overrides redirect v3 and v10 requests to its exact workspace version. Its version, `11.0.4`, identifies the official patched engine baseline; the local workspace is an API adapter, not an unmodified upstream release. The facade obtains the official patched package through the explicit npm alias `@portfolio/minimatch-engine`. The workspace source and the registry engine's integrity hash are visible in the lockfile. No vulnerable package is relabelled, no security advisory is ignored, and CI's moderate-severity threshold remains unchanged.

## Supported lint contracts

- Callable CommonJS default import delegates to `engine.minimatch`.
- Named helpers and the `Minimatch` class are forwarded from the patched engine.
- `makeRe` supports the `.test(path)` predicate contract used by `eslint-plugin-import/no-internal-modules`. It returns a matcher predicate, not a `RegExp`; it does not support regex-source inspection or string replacement APIs. The installed consumers must not gain additional uses without extending compatibility tests.

The adapter adds no runtime application imports, install-time patching, network calls, or edits to third-party source. Node.js 24 is the repository baseline.

## Maintenance and removal

Keep the engine version in this package and the root override synchronized. Regenerate the root lockfile, run the exact CI audit command, and validate lint, strict types, unit tests, browser tests, and production build after updates. Test both real lint-rule execution and package resolution, not just a zero-vulnerability audit result.

Remove the facade and overrides when the complete lint toolchain accepts patched minimatch APIs natively. Do not replace them with `npm audit fix --force`, a blanket untested major override, or a lower audit threshold.
