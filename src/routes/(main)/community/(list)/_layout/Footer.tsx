import { Button, Flexbox, Text } from '@lobehub/ui';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DefaultFooter from '@/features/Setting/Footer';
import { useIsDark } from '@/hooks/useIsDark';
import { useMarketAuth } from '@/layout/AuthProvider/MarketAuth';

import styles from './Footer.module.css';

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

const Footer = memo(() => {
  const { t } = useTranslation('discover');
  const isDarkMode = useIsDark();
  const { isAuthenticated, signIn } = useMarketAuth();
  const [loading, setLoading] = useState(false);
  const handleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      await signIn();
    } catch {
      // User cancelled or error occurred
    }
    setLoading(false);
  }, [signIn]);

  if (isAuthenticated) return <DefaultFooter />;

  return (
    <Flexbox
      align={'center'}
      className={cx(styles.footer, isDarkMode ? styles.footer_dark : styles.footer_light)}
      flex={'none'}
      gap={4}
    >
      <Text strong align={'center'} as={'h2'} fontSize={22}>
        {t('footer.title')}
      </Text>
      <Text align={'center'} fontSize={16} type={'secondary'}>
        {t('footer.desc')}
      </Text>
      <Button
        loading={loading}
        type={'primary'}
        style={{
          marginTop: 16,
        }}
        onClick={handleSignIn}
      >
        {t('user.login')}
      </Button>
    </Flexbox>
  );
});

export default Footer;
