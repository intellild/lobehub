import { Block, Flexbox, Text } from '@lobehub/ui';
import type { CSSProperties } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';

import { WebBrowsingManifest } from '../../../../manifest';
import { EngineAvatarGroup } from '../../../components/EngineAvatar';
import styles from './ShowMore.module.css';

interface ShowMoreProps {
  engines: string[];
  messageId: string;
  resultsNumber: number;
  style?: CSSProperties;
}
const ShowMore = memo<ShowMoreProps>(({ style, messageId, engines, resultsNumber }) => {
  const [openToolUI] = useChatStore((s) => [s.openToolUI]);

  const { t } = useTranslation('tool');

  return (
    <Block
      className={styles.container}
      gap={2}
      justify={'space-between'}
      style={style}
      variant={'outlined'}
      onClick={() => {
        openToolUI(messageId, WebBrowsingManifest.identifier);
      }}
    >
      <Text ellipsis={{ rows: 2 }}>{t('search.viewMoreResults', { results: resultsNumber })}</Text>
      <Flexbox horizontal align={'center'} gap={4}>
        <EngineAvatarGroup engines={engines} />
      </Flexbox>
    </Block>
  );
});

export default ShowMore;
