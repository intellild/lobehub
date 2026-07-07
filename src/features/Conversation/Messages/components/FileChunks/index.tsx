import { type ChatFileChunk } from '@lobechat/types';
import { Flexbox, Icon } from '@lobehub/ui';
import { BookOpenTextIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsDark } from '@/hooks/useIsDark';

import ChunkItem from './ChunkItem';
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

interface FileChunksProps {
  data: ChatFileChunk[];
}

const FileChunks = memo<FileChunksProps>(({ data }) => {
  const { t } = useTranslation('chat');
  const isDarkMode = useIsDark();

  const [showDetail, setShowDetail] = useState(false);

  return (
    <Flexbox
      className={cx(styles.container, isDarkMode ? styles.containerDark : styles.containerLight)}
      gap={16}
      width={'100%'}
      onClick={() => {
        setShowDetail(!showDetail);
      }}
    >
      <Flexbox horizontal distribution={'space-between'} flex={1}>
        <Flexbox horizontal gap={8}>
          <Icon color={'var(--ant-geekblue)'} icon={BookOpenTextIcon} /> {t('rag.referenceChunks')}
        </Flexbox>
        <Icon icon={showDetail ? ChevronDown : ChevronRight} />
      </Flexbox>
      {showDetail && (
        <Flexbox horizontal gap={8} wrap={'wrap'}>
          {data.map((item, index) => {
            return <ChunkItem index={index} key={item.id} {...item} />;
          })}
        </Flexbox>
      )}
    </Flexbox>
  );
});

export default FileChunks;
