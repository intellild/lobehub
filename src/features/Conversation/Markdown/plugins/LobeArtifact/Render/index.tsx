import { Center, Flexbox, Icon } from '@lobehub/ui';
import { Loader2 } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsDark } from '@/hooks/useIsDark';
import { useChatStore } from '@/store/chat';
import { chatPortalSelectors, messageStateSelectors } from '@/store/chat/selectors';
import { dotLoading } from '@/styles/loading';

import { type MarkdownElementProps } from '../../type';
import ArtifactIcon from './Icon';
import styles from './index.module.css';

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

interface ArtifactProps extends MarkdownElementProps {
  identifier: string;
  language?: string;
  title: string;
  type: string;
}

const Render = memo<ArtifactProps>(({ identifier, title, type, language, children, id }) => {
  const { t } = useTranslation('chat');
  const isDarkMode = useIsDark();

  const hasChildren = !!children;
  const str = ((children as string) || '').toString?.();

  const [isGenerating, isArtifactTagClosed, openArtifact, closeArtifact] = useChatStore((s) => {
    return [
      messageStateSelectors.isMessageGenerating(id)(s),
      chatPortalSelectors.isArtifactTagClosed(id, identifier)(s),
      s.openArtifact,
      s.closeArtifact,
    ];
  });

  const openArtifactUI = () => {
    openArtifact({ id, identifier, language, title, type });
  };

  useEffect(() => {
    if (!hasChildren || !isGenerating) return;

    openArtifactUI();
  }, [isGenerating, hasChildren, str, identifier, title, type, id, language]);

  return (
    <Flexbox
      className={cx(styles.container, isDarkMode && styles.container_dark)}
      gap={16}
      width={'100%'}
      onClick={() => {
        const state = useChatStore.getState();
        const currentArtifactMessageId = chatPortalSelectors.artifactMessageId(state);
        const currentArtifactIdentifier = chatPortalSelectors.artifactIdentifier(state);
        if (currentArtifactMessageId === id && currentArtifactIdentifier === identifier) {
          closeArtifact();
        } else {
          openArtifactUI();
        }
      }}
    >
      <Flexbox horizontal align={'center'} flex={1}>
        <Center horizontal className={styles.avatar} height={64} width={64}>
          <ArtifactIcon type={type} />
        </Center>
        <Flexbox gap={4} paddingBlock={8} paddingInline={12}>
          {!title && isGenerating ? (
            <Flexbox horizontal className={dotLoading as string}>
              {t('artifact.generating')}
            </Flexbox>
          ) : (
            <Flexbox className={cx(styles.title)}>{title || t('artifact.unknownTitle')}</Flexbox>
          )}
          {hasChildren && (
            <Flexbox horizontal className={styles.desc}>
              {identifier} ·{' '}
              <Flexbox horizontal gap={2}>
                {!isArtifactTagClosed && (
                  <div>
                    <Icon spin icon={Loader2} />
                  </div>
                )}
                {str?.length}
              </Flexbox>
            </Flexbox>
          )}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default Render;
