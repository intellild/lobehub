import { Tooltip } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { isDesktop } from '@/const/version';
import { localFileService } from '@/services/electron/localFileService';
import { useChatStore } from '@/store/chat';
import { topicSelectors } from '@/store/chat/selectors';

import styles from './FolderTag.module.css';

const FolderTag = memo(() => {
  const { t } = useTranslation('tool');

  const topicBoundDirectory = useChatStore(topicSelectors.currentTopicWorkingDirectory);

  if (!isDesktop || !topicBoundDirectory) return null;
  const handleOpen = () => {
    void localFileService.openLocalFolder({ isDirectory: true, path: topicBoundDirectory });
  };

  const displayName = topicBoundDirectory.split('/').findLast(Boolean) || topicBoundDirectory;

  return (
    <Tooltip title={`${topicBoundDirectory} · ${t('localFiles.openFolder')}`}>
      <span className={styles.chip} onClick={handleOpen}>
        {displayName}
      </span>
    </Tooltip>
  );
});

FolderTag.displayName = 'TopicFolderTag';

export default FolderTag;
