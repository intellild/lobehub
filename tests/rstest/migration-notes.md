# Rstest Migration Notes

This file records the initial compatibility probe for running the app Vitest suites with
Rstest.

## Commands

The normal entry after dependencies are installed is:

```bash
pnpm run test:rstest
```

During the first probe, project installation was blocked by an existing
`xlsx@https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` lockfile entry that has no
`integrity` field. To avoid bypassing the lockfile trust checks, the probe used a
temporary Rstest runtime:

```bash
pnpm dlx --package @rstest/core@0.10.6 --package happy-dom@20.10.6 rstest -c rstest.config.mts
```

## Probe Results

Full root `src/**` probe:

- Test files: 731
- Failed files: 425
- Tests: 3046
- Passed tests: 2972
- Failed tests: 71
- Skipped tests: 3

Focused passing probes:

```bash
pnpm dlx --package @rstest/core@0.10.6 --package happy-dom@20.10.6 rstest -c rstest.config.mts src/utils/identifier.test.ts
pnpm dlx --package @rstest/core@0.10.6 --package happy-dom@20.10.6 rstest -c rstest.config.mts src/spa/router/mobileRouter.test.tsx src/spa/router/desktopRouter.sync.test.tsx src/utils/rbac.test.ts
```

The focused probes passed, which means the basic Rsbuild/Rspack pipeline, React TSX,
path aliases, Markdown asset handling, and JSON named exports are wired well enough for
tests that do not rely on Vitest's module-mocking transform names.

## Migration Points

1. Module mock APIs must use Rstest's literal names.

   Rstest rejects alias calls such as `vi.mock`, `vi.hoisted`, and `vi.resetModules`
   because its transform requires literal `rs.*` or `rstest.*` calls.

   Typical migration:

   ```ts
   import { beforeEach, describe, expect, it, rs } from '@rstest/core';

   const mocks = rs.hoisted(() => ({
     fetchData: rs.fn(),
   }));

   rs.mock('@/services/example', () => ({
     fetchData: mocks.fetchData,
   }));
   ```

2. A `vitest` alias shim is not enough for module mock APIs.

   `tests/rstest/vitestCompat.ts` can keep simple imports such as `describe`,
   `expect`, and `it` working, but it cannot make `vi.mock` transformable. Tests with
   module mocks need source changes or a codemod.

3. Setup files need Rstest-native mock calls.

   The shared Vitest setup imports `vi` and calls `vi.mock`. Rstest needs its own setup
   file using `rs.mock` and `rs.fn`, so `rstest.config.mts` points at
   `tests/rstest/setup.ts`.

4. Snapshot headers differ.

   Rstest rewrites snapshot headers from:

   ```ts
   // Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html
   ```

   to:

   ```ts
   // Rstest Snapshot v1
   ```

   The first full probe touched three existing snapshot files only by changing this
   header. Those changes were reverted to avoid mixing snapshot formats in the same
   branch.

5. Some tests have process side effects during full runs.

   The full probe printed `Hello World MCP Server running on stdio` multiple times,
   indicating that some suites start stdio servers during execution. These suites should
   be isolated or reviewed before enabling broad Rstest runs in CI.

6. Dependency installation is currently blocked by an unrelated lockfile issue.

   `@rstest/core` is declared in `package.json`, but `pnpm install` could not complete
   because of the existing `xlsx` tarball entry without integrity metadata. Fixing that
   lockfile entry is required before `pnpm run test:rstest` works without `pnpm dlx`.
