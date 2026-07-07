import { Github, ModelTag, ProviderCombine } from '@lobehub/icons';
import { ActionIcon, Block, Flexbox, MaskShadow, stopPropagation, Text } from '@lobehub/ui';
import { GlobeIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import urlJoin from 'url-join';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import WorkspaceLink from '@/features/Workspace/WorkspaceLink';
import { type DiscoverProviderItem } from '@/types/discover';

import styles from './Item.module.css';

const ProviderItem = memo<DiscoverProviderItem>(
  ({ url, name, description, identifier, models }) => {
    const navigate = useWorkspaceAwareNavigate();
    const link = urlJoin('/community/provider', identifier);
    const { t } = useTranslation(['discover', 'providers']);

    return (
      <Block
        clickable
        data-testid="provider-item"
        height={'100%'}
        variant={'outlined'}
        width={'100%'}
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={() => {
          navigate(link);
        }}
      >
        <Flexbox
          horizontal
          align={'flex-start'}
          gap={16}
          justify={'space-between'}
          padding={16}
          width={'100%'}
        >
          <Flexbox
            title={identifier}
            style={{
              overflow: 'hidden',
            }}
          >
            <WorkspaceLink style={{ color: 'inherit', overflow: 'hidden' }} to={link}>
              <ProviderCombine provider={identifier} size={28} style={{ flex: 'none' }} />
            </WorkspaceLink>
            <div className={styles.author}>@{name}</div>
          </Flexbox>
          <Flexbox horizontal align={'center'}>
            <a href={url} rel="noopener noreferrer" target={'_blank'} onClick={stopPropagation}>
              <ActionIcon color={'var(--ant-color-text-description)'} icon={GlobeIcon} />
            </a>
            <a
              href={`https://github.com/lobehub/lobe-chat/blob/main/src/config/modelProviders/${identifier}.ts`}
              rel="noopener noreferrer"
              target={'_blank'}
              onClick={stopPropagation}
            >
              <ActionIcon fill={'var(--ant-color-text-description)'} icon={Github} />
            </a>
          </Flexbox>
        </Flexbox>
        <Flexbox flex={1} gap={12} paddingInline={16}>
          {description && (
            <Text
              className={styles.desc}
              ellipsis={{
                rows: 3,
              }}
            >
              {t(`${identifier}.description`, { defaultValue: description, ns: 'providers' })}
            </Text>
          )}
        </Flexbox>
        <Flexbox
          horizontal
          align={'center'}
          className={styles.footer}
          justify={'space-between'}
          padding={16}
        >
          <MaskShadow horizontal gap={6} position={'right'} size={10} width={'100%'}>
            {models
              .slice(0, 6)
              .filter(Boolean)
              .map((tag: string) => (
                <WorkspaceLink key={tag} to={urlJoin('/community/model', tag)}>
                  <ModelTag model={tag} style={{ margin: 0 }} />
                </WorkspaceLink>
              ))}
          </MaskShadow>
        </Flexbox>
      </Block>
    );
  },
);

export default ProviderItem;
