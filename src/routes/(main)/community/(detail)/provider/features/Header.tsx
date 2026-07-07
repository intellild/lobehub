'use client';

import { Github, ProviderCombine } from '@lobehub/icons';
import { ActionIcon, Flexbox, stopPropagation } from '@lobehub/ui';
import { GlobeIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import urlJoin from 'url-join';

import { useResponsive } from '@/hooks/useResponsive';

import { useDetailContext } from './DetailProvider';

const Header = memo<{ mobile?: boolean }>(({ mobile: isMobile }) => {
  const { t } = useTranslation('providers');
  const { description, identifier, url, modelsUrl, name } = useDetailContext();
  const { mobile = isMobile } = useResponsive();

  return (
    <Flexbox gap={12}>
      <Flexbox
        horizontal
        align={'flex-start'}
        gap={8}
        justify={'space-between'}
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Flexbox align={'flex-start'} width={'100%'}>
          <ProviderCombine provider={identifier} size={mobile ? 32 : 48} />
          <Flexbox horizontal align={'center'} gap={4}>
            {Boolean(url || modelsUrl) ? (
              <a href={url || (modelsUrl as string)} rel="noreferrer" target="_blank">
                @{name}
              </a>
            ) : (
              <span>@{name}</span>
            )}
          </Flexbox>
        </Flexbox>
        <Flexbox horizontal align={'center'}>
          {Boolean(url || modelsUrl) && (
            <a
              href={(url || modelsUrl) as string}
              rel="noreferrer"
              target="_blank"
              onClick={stopPropagation}
            >
              <ActionIcon color={'var(--ant-color-text-description)'} icon={GlobeIcon} />
            </a>
          )}

          <a
            rel="noreferrer"
            target="_blank"
            href={urlJoin(
              'https://github.com/lobehub/lobe-chat-agents/tree/main/locales',
              identifier as string,
            )}
            onClick={stopPropagation}
          >
            <ActionIcon fill={'var(--ant-color-text-description)'} icon={Github} />
          </a>
        </Flexbox>
      </Flexbox>

      <Flexbox
        horizontal
        align={'center'}
        gap={mobile ? 12 : 24}
        style={{
          color: 'var(--ant-color-text-secondary)',
        }}
      >
        {t(`${identifier}.description`, { defaultValue: description })}
      </Flexbox>
    </Flexbox>
  );
});

export default Header;
