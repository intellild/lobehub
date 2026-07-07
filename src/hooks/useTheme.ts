import { theme as antdTheme } from 'antd';
import { useTheme as useNextThemesTheme } from 'next-themes';

import { useIsDark } from './useIsDark';

export const useTheme = () => {
  const { theme, resolvedTheme } = useNextThemesTheme();
  const { token } = antdTheme.useToken();
  const isDarkMode = useIsDark();

  return {
    ...token,
    appearance: resolvedTheme,
    colorBgContainerSecondary:
      token.colorBgContainerDisabled || token.colorFillQuaternary || token.colorBgContainer,
    isDarkMode,
    resolvedTheme,
    theme,
    yellowBg: token.yellow1,
    yellowBorder: token.yellow3,
  };
};

export const useThemeMode = () => {
  const theme = useTheme();

  return {
    isDarkMode: theme.isDarkMode,
  };
};
