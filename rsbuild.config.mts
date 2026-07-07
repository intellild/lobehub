import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  type CSSLoaderOptions,
  defineConfig,
  type RsbuildPlugin,
  type Rspack,
} from '@rsbuild/core';
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
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
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

const useNativeCss = !['0', 'false'].includes((process.env.RSBUILD_NATIVE_CSS ?? '').toLowerCase());

const entryName = isAuth ? 'index.auth' : isMobile ? 'index.mobile' : 'index';
const entry = isAuth
  ? './src/spa/entry.auth.tsx'
  : isMobile
    ? './src/spa/entry.mobile.tsx'
    : './src/spa/entry.web.tsx';
const htmlTemplate = isAuth
  ? './index.auth.html'
  : isMobile
    ? './index.mobile.html'
    : './index.html';
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

const preservePublicImageUrls = (config: CSSLoaderOptions) => {
  config.url = {
    filter: (url) => !url.startsWith('/images/'),
  };
};

type Rule = Rspack.RuleSetRule;
type RuleUseItem = Rspack.RuleSetUseItem;

const isRule = (rule: unknown): rule is Rule => {
  return typeof rule === 'object' && rule !== null;
};

const hasLoader = (useItem: RuleUseItem, matcher: (loader: string) => boolean) => {
  if (typeof useItem === 'string') return matcher(useItem);

  return matcher(useItem.loader);
};

const hasCssLoaderPipeline = (rule: Rule) => {
  const isCssPipelineLoader = (loader: string) => {
    return (
      loader.includes('/css-loader/') ||
      loader.includes('cssExtractLoader') ||
      loader.includes('/style-loader/') ||
      loader.includes('/postcss-loader/') ||
      loader.includes('builtin:lightningcss-loader')
    );
  };

  if (rule.loader && isCssPipelineLoader(rule.loader)) return true;

  if (!rule.use || typeof rule.use === 'function') return false;

  const useItems = Array.isArray(rule.use) ? rule.use : [rule.use];

  return useItems.some((useItem) => hasLoader(useItem, isCssPipelineLoader));
};

const isCssRule = (rule: Rule) => {
  return rule.test instanceof RegExp && rule.test.test('index.css');
};

const toNativeCssRule = (rule: Rule) => {
  delete rule.loader;
  delete rule.options;
  delete rule.use;
  rule.sideEffects = true;
  rule.type = 'css/auto';
};

const enableNativeCssRules = (rules: Rspack.RuleSetRules | undefined) => {
  if (!rules) return;

  for (const rule of rules) {
    if (!isRule(rule)) continue;

    if (isCssRule(rule)) {
      const passthroughRules = rule.oneOf?.filter((oneOfRule) => {
        return isRule(oneOfRule) && !hasCssLoaderPipeline(oneOfRule);
      });

      if (passthroughRules?.length) {
        rule.oneOf = [...passthroughRules, { sideEffects: true, type: 'css/auto' }];
      } else {
        delete rule.oneOf;
        toNativeCssRule(rule);
      }

      continue;
    }

    enableNativeCssRules(rule.rules);
    enableNativeCssRules(rule.oneOf);
  }
};

const enableNativeCss = (config: Rspack.Configuration) => {
  config.module ??= {};
  config.module.parser ??= {};
  config.module.generator ??= {};

  const parserOptions = {
    import: true,
    namedExports: false,
    url: false,
  };
  const moduleGeneratorOptions = {
    esModule: true,
    exportsConvention: 'camel-case' as const,
    localIdentName: isDev ? '[path][name]__[local]-[hash:base64:6]' : '[local]-[hash:base64:6]',
  };

  config.module.parser.css = {
    ...(config.module.parser.css as Record<string, unknown> | undefined),
    ...parserOptions,
  };
  config.module.parser['css/auto'] = {
    ...(config.module.parser['css/auto'] as Record<string, unknown> | undefined),
    ...parserOptions,
  };
  config.module.parser['css/global'] = {
    ...(config.module.parser['css/global'] as Record<string, unknown> | undefined),
    ...parserOptions,
  };
  config.module.parser['css/module'] = {
    ...(config.module.parser['css/module'] as Record<string, unknown> | undefined),
    ...parserOptions,
  };

  config.module.generator.css = {
    ...(config.module.generator.css as Record<string, unknown> | undefined),
    esModule: true,
  };
  config.module.generator['css/auto'] = {
    ...(config.module.generator['css/auto'] as Record<string, unknown> | undefined),
    ...moduleGeneratorOptions,
  };
  config.module.generator['css/global'] = {
    ...(config.module.generator['css/global'] as Record<string, unknown> | undefined),
    ...moduleGeneratorOptions,
  };
  config.module.generator['css/module'] = {
    ...(config.module.generator['css/module'] as Record<string, unknown> | undefined),
    ...moduleGeneratorOptions,
  };

  config.ignoreWarnings = [
    ...(config.ignoreWarnings ?? []),
    { message: /Conflicting order between .*\.css and .*\.css/ },
  ];

  enableNativeCssRules(config.module.rules);
  config.plugins = config.plugins?.filter((plugin) => {
    return plugin?.constructor?.name !== 'CssExtractRspackPlugin';
  });
};

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
    ...(useNativeCss ? {} : { cssLoader: preservePublicImageUrls }),
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

      if (useNativeCss) enableNativeCss(config);
    },
  },
});
