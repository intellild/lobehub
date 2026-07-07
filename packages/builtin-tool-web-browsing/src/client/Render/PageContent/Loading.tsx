'use client';

import { CopyButton, Flexbox, Skeleton } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { lineEllipsis, shinyTextStyles } from '@/styles';

import stylesModule from './Loading.module.css';

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
const styles: typeof stylesModule & { text: string } = {
  ...stylesModule,
  text: [lineEllipsis(2), shinyTextStyles.shinyText].join(' '),
};

const LoadingCard = memo<{ url: string }>(({ url }) => {
  const { t } = useTranslation('plugin');

  return (
    <Flexbox className={styles.container}>
      <Flexbox horizontal className={styles.cardBody} justify={'space-between'}>
        <a href={url} rel={'nofollow'} target={'_blank'}>
          <div className={styles.text}>{url}</div>
        </a>
        <CopyButton content={url} size={'small'} />
      </Flexbox>
      <Flexbox gap={4} paddingInline={16}>
        <Skeleton.Block active style={{ height: 14, width: '95%' }} />
        <Skeleton.Block active style={{ height: 14, width: '40%' }} />
      </Flexbox>

      <div className={styles.footer}>{t('search.crawPages.crawling')}</div>
    </Flexbox>
  );
});

export default LoadingCard;
