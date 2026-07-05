import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, type RsbuildPlugin } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { sharedRendererDefine } from './plugins/vite/sharedRendererConfig';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const isMobile = process.env.MOBILE === 'true';
const isAuth = process.env.AUTH === 'true';
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isDev = mode !== 'production';
const platform = isAuth ? 'auth' : isMobile ? 'mobile' : 'web';

const loadEnv = () => {
  const shellEnv = Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
  const dotenvEnv: Record<string, string> = {};
  const result = dotenv.config({
    path: ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`],
    processEnv: dotenvEnv,
  });

  if (!result.parsed) return;

  const expanded = dotenvExpand.expand({
    parsed: result.parsed,
    processEnv: { ...dotenvEnv, ...shellEnv },
  });

  Object.assign(process.env, expanded.parsed, shellEnv);
};

loadEnv();

const entryName = isAuth ? 'index.auth' : isMobile ? 'index.mobile' : 'index';
const entry = isAuth
  ? './src/spa/entry.auth.tsx'
  : isMobile
    ? './src/spa/entry.mobile.tsx'
    : './src/spa/entry.web.tsx';
const htmlTemplate = isAuth ? './index.auth.html' : isMobile ? './index.mobile.html' : './index.html';
const outDir = isAuth ? 'dist/auth' : isMobile ? 'dist/mobile' : 'dist/desktop';
const assetPrefix = isDev ? '/' : process.env.VITE_CDN_BASE || (isAuth ? '/_spa-auth/' : '/_spa/');
const emptyModulePath = path.resolve(rootDir, 'plugins/rsbuild/emptyModule.ts');
const rsbuildDefine = {
  ...sharedRendererDefine({ isElectron: false, isMobile }),
  'process.env': '({})',
};

const scriptEntryPattern =
  /\s*<script\s+type=["']module["']\s+src=["']\/src\/spa\/entry\.(?:auth|mobile|web)\.tsx["']\s*><\/script>\s*/g;

const createExtensionList = () => {
  const platformExtensions = [
    `.${platform}.tsx`,
    `.${platform}.ts`,
    `.${platform}.jsx`,
    `.${platform}.js`,
  ];

  return [
    ...platformExtensions,
    '.vite.tsx',
    '.vite.ts',
    '.vite.jsx',
    '.vite.js',
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    '.json',
  ];
};

const platformExtensionAliases = {
  '.js': [`.${platform}.js`, '.vite.js', '.js'],
  '.jsx': [`.${platform}.jsx`, '.vite.jsx', '.jsx'],
  '.ts': [`.${platform}.ts`, '.vite.ts', '.ts'],
  '.tsx': [`.${platform}.tsx`, '.vite.tsx', '.tsx'],
};

const rsbuildHtmlCompatPlugin = (): RsbuildPlugin => ({
  name: 'lobe-rsbuild-html-compat',
  setup(api) {
    api.modifyHTML((html) => html.replaceAll(scriptEntryPattern, '\n'));
  },
});

export default defineConfig({
  html: {
    inject: 'body',
    template: htmlTemplate,
  },
  output: {
    assetPrefix,
    cleanDistPath: true,
    distPath: {
      assets: 'assets',
      css: 'assets',
      cssAsync: 'assets',
      font: 'assets',
      image: 'assets',
      js: 'assets',
      jsAsync: 'assets',
      media: 'assets',
      root: outDir,
      svg: 'assets',
      wasm: 'assets',
    },
  },
  performance: {
    printFileSize: false,
  },
  plugins: [pluginReact(), rsbuildHtmlCompatPlugin()],
  resolve: {
    alias: {
      'node-fetch': './plugins/rsbuild/emptyModule.ts',
      'node:stream': './plugins/rsbuild/emptyModule.ts',
    },
    extensions: createExtensionList(),
  },
  server: {
    base: isDev ? '/' : assetPrefix,
    cors: true,
    host: '0.0.0.0',
    port: isMobile
      ? Number(process.env.MOBILE_SPA_PORT) || 3012
      : isAuth
        ? Number(process.env.AUTH_SPA_PORT) || 3013
        : Number(process.env.SPA_PORT) || 9876,
    proxy: {
      '/api': `http://localhost:${process.env.PORT || 3010}`,
      '/oidc': `http://localhost:${process.env.PORT || 3010}`,
      '/trpc': `http://localhost:${process.env.PORT || 3010}`,
      '/webapi': `http://localhost:${process.env.PORT || 3010}`,
    },
    strictPort: true,
  },
  source: {
    define: rsbuildDefine,
    entry: {
      [entryName]: entry,
    },
  },
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
        ...platformExtensionAliases,
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
