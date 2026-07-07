'use client';

import { Center } from '@lobehub/ui';
import { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { MORE_MODEL_PROVIDER_REQUEST_URL } from '@/const/url';

const Footer = memo(() => {
  const { t } = useTranslation('setting');
  return (
    <Center
      width={'100%'}
      style={{
        background: 'var(--ant-color-fill-quaternary)',
        border: `1px dashed ${'var(--ant-color-fill-secondary)'}`,
        borderRadius: 'var(--ant-border-radius-lg)',
        padding: 12,
      }}
    >
      <div style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12, textAlign: 'center' }}>
        <Trans
          i18nKey="llm.waitingForMore"
          ns={'setting'}
          components={[
            <span key="0" />,
            <a
              aria-label={t('llm.waitingForMoreLinkAriaLabel')}
              href={MORE_MODEL_PROVIDER_REQUEST_URL}
              key="1"
              rel="noreferrer"
              target="_blank"
            />,
          ]}
        />
      </div>
    </Center>
  );
});

export default Footer;
