import { ActionIcon, Flexbox, Text } from '@lobehub/ui';
import { FilePlusIcon, FolderPlusIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './DocumentExplorerToolbar.module.css';

interface Props {
  onCreateDocument: () => void;
  onCreateFolder: () => void;
}

const DocumentExplorerToolbar = memo<Props>(({ onCreateDocument, onCreateFolder }) => {
  const { t } = useTranslation('chat');
  return (
    <Flexbox horizontal align={'center'} className={styles.toolbar} distribution={'space-between'}>
      <Text className={styles.title} type={'secondary'}>
        {t('workingPanel.resources.filter.documents')}
      </Text>
      <Flexbox horizontal gap={2}>
        <ActionIcon
          icon={FolderPlusIcon}
          size={'small'}
          title={t('workingPanel.resources.tree.newFolder')}
          onClick={onCreateFolder}
        />
        <ActionIcon
          icon={FilePlusIcon}
          size={'small'}
          title={t('workingPanel.resources.tree.newDocument')}
          onClick={onCreateDocument}
        />
      </Flexbox>
    </Flexbox>
  );
});

DocumentExplorerToolbar.displayName = 'DocumentExplorerToolbar';

export default DocumentExplorerToolbar;
