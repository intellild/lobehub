'use client';

import 'antd/dist/reset.css';

import { TITLE_BAR_HEIGHT } from '@lobechat/desktop-bridge';
import { type NeutralColors, type PrimaryColors } from '@lobehub/ui';
import { ConfigProvider, FontLoader, ThemeProvider } from '@lobehub/ui';
import { message as antdMessage } from 'antd';
import { AppConfigContext } from 'antd/es/app/context';
import * as m from 'motion/react-m';
import { type ReactNode } from 'react';
import { memo, useEffect, useMemo, useState } from 'react';

import AntdStaticMethods from '@/components/AntdStaticMethods';
import Link from '@/components/Link';
import { LOBE_THEME_NEUTRAL_COLOR, LOBE_THEME_PRIMARY_COLOR } from '@/const/theme';
import { isDesktop } from '@/const/version';
import { useIsDark } from '@/hooks/useIsDark';
import { useTheme } from '@/hooks/useTheme';
import { getUILocaleAndResources } from '@/libs/getUILocaleAndResources';
import type { UILocaleResources } from '@/libs/getUILocaleAndResources.utils';
import { resolveUILocale } from '@/libs/getUILocaleAndResources.utils';
import Image from '@/libs/next/Image';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useUserStore } from '@/store/user';
import { userGeneralSettingsSelectors } from '@/store/user/selectors';
import { GlobalStyle } from '@/styles';
import { setCookie } from '@/utils/client/cookie';

import styles from './AppTheme.module.css';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

export interface AppThemeProps {
  children?: ReactNode;
  customFontFamily?: string;
  customFontURL?: string;
  defaultNeutralColor?: NeutralColors;
  defaultPrimaryColor?: PrimaryColors;
  globalCDN?: boolean;
}

const AppTheme = memo<AppThemeProps>(
  ({
    children,
    defaultPrimaryColor,
    defaultNeutralColor,
    globalCDN,
    customFontURL,
    customFontFamily,
  }) => {
    const language = useGlobalStore(systemStatusSelectors.language);
    const antdTheme = useTheme();
    const isDark = useIsDark();

    const [primaryColor, neutralColor, animationMode] = useUserStore((s) => [
      userGeneralSettingsSelectors.primaryColor(s),
      userGeneralSettingsSelectors.neutralColor(s),
      userGeneralSettingsSelectors.animationMode(s),
    ]);
    const messageTop = isDesktop ? TITLE_BAR_HEIGHT + 8 : undefined;
    const appConfig = useMemo(
      () => (messageTop === undefined ? {} : { message: { top: messageTop } }),
      [messageTop],
    );

    const [uiResources, setUIResources] = useState<UILocaleResources>();
    const [uiLocale, setUILocale] = useState(() => resolveUILocale(language).uiLocale);

    useEffect(() => {
      let mounted = true;
      setUILocale(resolveUILocale(language).uiLocale);
      getUILocaleAndResources(language)
        .then(({ locale, resources }) => {
          if (mounted) {
            setUILocale(locale);
            setUIResources(resources);
          }
        })
        .catch((error) => {
          console.error('Failed to load UI locale resources:', error);
        });
      return () => {
        mounted = false;
      };
    }, [language]);

    useEffect(() => {
      setCookie(LOBE_THEME_PRIMARY_COLOR, primaryColor);
    }, [primaryColor]);

    useEffect(() => {
      setCookie(LOBE_THEME_NEUTRAL_COLOR, neutralColor);
    }, [neutralColor]);

    useEffect(() => {
      if (messageTop === undefined) return;
      antdMessage.config({ top: messageTop });
    }, [messageTop]);

    const currentAppearence = isDark ? 'dark' : 'light';

    return (
      <AppConfigContext value={appConfig}>
        <ThemeProvider
          appearance={currentAppearence}
          className={cx(styles.app, styles.scrollbar, styles.scrollbarPolyfill)}
          defaultAppearance={currentAppearence}
          defaultThemeMode={currentAppearence}
          customTheme={{
            neutralColor: neutralColor ?? defaultNeutralColor,
            primaryColor: primaryColor ?? defaultPrimaryColor,
          }}
          theme={{
            cssVar: { key: 'lobe-vars' },
            token: {
              fontFamily: customFontFamily
                ? `${customFontFamily},${antdTheme.fontFamily}`
                : undefined,
              motion: animationMode !== 'disabled',
              motionUnit: animationMode === 'agile' ? 0.05 : 0.1,
            },
          }}
        >
          {!!customFontURL && <FontLoader url={customFontURL} />}
          <GlobalStyle />
          <AntdStaticMethods />
          <ConfigProvider
            locale={uiLocale}
            motion={m}
            resources={uiResources}
            config={{
              aAs: Link,
              imgAs: Image,
              imgUnoptimized: true,
              proxy: globalCDN ? 'unpkg' : undefined,
            }}
          >
            {children}
          </ConfigProvider>
        </ThemeProvider>
      </AppConfigContext>
    );
  },
);

export default AppTheme;
