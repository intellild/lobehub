import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rstest/core';

const rootDir = dirname(fileURLToPath(import.meta.url));
const emptyModulePath = resolve(rootDir, 'plugins/rsbuild/emptyModule.ts');

const alias = {
  '@lobechat/business-model-runtime': resolve(
    rootDir,
    './packages/business/model-runtime/src/index.ts',
  ),
  '@lobechat/business-model-bank/model-config': resolve(
    rootDir,
    './packages/business/model-bank/src/model-config.ts',
  ),
  '@lobechat/business-model-bank': resolve(rootDir, './packages/business/model-bank/src/index.ts'),
  '@emoji-mart/data': resolve(rootDir, './tests/mocks/emojiMartData.ts'),
  '@emoji-mart/react': resolve(rootDir, './tests/mocks/emojiMartReact.tsx'),
  '@/utils/client/switchLang': resolve(rootDir, './src/utils/client/switchLang'),
  '@/const/locale': resolve(rootDir, './src/const/locale'),
  '@/utils/errorResponse': resolve(rootDir, './src/utils/errorResponse'),
  '@/utils/unzipFile': resolve(rootDir, './src/utils/unzipFile'),
  '@/utils/server': resolve(rootDir, './src/utils/server'),
  '@/utils/identifier': resolve(rootDir, './src/utils/identifier'),
  '@/utils/electron': resolve(rootDir, './src/utils/electron'),
  '@/utils/markdownToTxt': resolve(rootDir, './src/utils/markdownToTxt'),
  '@/utils/sanitizeFileName': resolve(rootDir, './src/utils/sanitizeFileName'),
  '@/store/workspace': resolve(rootDir, './tests/mocks/storeWorkspace.ts'),
  '~test-utils': resolve(rootDir, './tests/utils.tsx'),
  lru_map: resolve(rootDir, './tests/mocks/lru_map'),
  vitest: resolve(rootDir, './tests/rstest/vitestCompat.ts'),
  'node-fetch': resolve(rootDir, './plugins/rsbuild/emptyModule.ts'),
  'node:stream': resolve(rootDir, './plugins/rsbuild/emptyModule.ts'),
};

export default defineConfig({
  exclude: [
    '**/node_modules/**',
    '**/.*/**',
    '**/dist/**',
    '**/build/**',
    '**/tmp/**',
    '**/temp/**',
    '**/docs/**',
    '**/locales/**',
    '**/public/**',
    '**/apps/desktop/**',
    '**/apps/mobile/**',
    '**/apps/cli/**',
    '**/packages/**',
    '**/e2e/**',
  ],
  globals: true,
  include: ['src/**/*.{test,spec}.{ts,tsx}'],
  plugins: [pluginReact()],
  setupFiles: [resolve(rootDir, './tests/rstest/setup.ts')],
  silent: 'passed-only',
  source: {
    define: {
      __CI__: process.env.CI === 'true' ? 'true' : 'false',
      __DEV__: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
      __ELECTRON__: 'false',
      __MOBILE__: 'false',
      __TEST__: 'true',
      'process.env.RSTEST': 'true',
    },
  },
  resolve: {
    alias,
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.vite.tsx',
      '.vite.ts',
      '.vite.jsx',
      '.vite.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },
  testEnvironment: 'happy-dom',
  tools: {
    rspack(config, { rspack }) {
      config.module ??= {};
      config.module.parser ??= {};
      config.module.parser.json = {
        ...(config.module.parser.json as Record<string, unknown> | undefined),
        exportsDepth: Number.MAX_SAFE_INTEGER,
      };
      config.module.rules ??= [];
      config.module.rules.unshift(
        {
          resourceQuery: /url/,
          type: 'asset/resource',
        },
        {
          test: /\.md$/,
          type: 'asset/source',
        },
      );

      config.resolve ??= {};
      config.resolve.extensionAlias = {
        ...config.resolve.extensionAlias,
        '.js': ['.web.js', '.vite.js', '.js'],
        '.jsx': ['.web.jsx', '.vite.jsx', '.jsx'],
        '.ts': ['.web.ts', '.vite.ts', '.ts'],
        '.tsx': ['.web.tsx', '.vite.tsx', '.tsx'],
      };
      config.node = {
        ...config.node,
        __dirname: false,
      };

      config.plugins ??= [];
      config.plugins.push(
        new rspack.NormalModuleReplacementPlugin(/^node:stream$/, emptyModulePath),
      );
    },
  },
});
