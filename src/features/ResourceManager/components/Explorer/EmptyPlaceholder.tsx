import { Center, FileTypeIcon, Flexbox, Icon, Text } from '@lobehub/ui';
import { Upload } from 'antd';
import { ArrowUpIcon, PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCreateNewModal } from '@/features/LibraryModal';
import { useTopLevelFileUpload } from '@/features/ResourceManager/hooks/useTopLevelFileUpload';
import { usePermission } from '@/hooks/usePermission';
import { useCurrentFolderId } from '@/routes/(main)/resource/features/hooks/useCurrentFolderId';
import { useResourceManagerStore } from '@/routes/(main)/resource/features/store';
import { useFileStore } from '@/store/file';

import styles from './EmptyPlaceholder.module.css';

const ICON_SIZE = 80;

const EmptyPlaceholder = () => {
  const { t } = useTranslation('components');

  const pushDockFileList = useFileStore((s) => s.pushDockFileList);
  const uploadTopLevel = useTopLevelFileUpload();

  const libraryId = useResourceManagerStore((s) => s.libraryId);
  const currentFolderId = useCurrentFolderId();

  const { open } = useCreateNewModal();
  const { allowed: canCreate } = usePermission('create_content');

  if (!canCreate) {
    return (
      <Center height={'100%'} style={{ paddingBottom: 100 }} width={'100%'}>
        <Text as={'h4'}>{t('FileManager.emptyStatus.title')}</Text>
      </Center>
    );
  }

  return (
    <Center gap={24} height={'100%'} style={{ paddingBottom: 100 }} width={'100%'}>
      <Flexbox justify={'center'} style={{ textAlign: 'center' }}>
        <Text as={'h4'}>{t('FileManager.emptyStatus.title')}</Text>
        <Text type={'secondary'}>{t('FileManager.emptyStatus.or')}</Text>
      </Flexbox>
      <Flexbox horizontal gap={12}>
        {!libraryId && (
          <Flexbox
            className={styles.card}
            padding={16}
            onClick={() => {
              open();
            }}
          >
            <span className={styles.actionTitle}>
              {t('FileManager.emptyStatus.actions.knowledgeBase')}
            </span>
            <div className={styles.glow} style={{ background: 'var(--ant-purple)' }} />
            <FileTypeIcon
              className={styles.icon}
              color={'var(--ant-purple)'}
              icon={<Icon color={'#fff'} icon={PlusIcon} />}
              size={ICON_SIZE}
              type={'folder'}
            />
          </Flexbox>
        )}
        <Upload
          multiple={true}
          showUploadList={false}
          beforeUpload={async (file) => {
            await uploadTopLevel([file]);
            return false;
          }}
        >
          <Flexbox className={styles.card} padding={16}>
            <span className={styles.actionTitle}>{t('FileManager.emptyStatus.actions.file')}</span>
            <div className={styles.glow} style={{ background: 'var(--ant-gold)' }} />
            <FileTypeIcon
              className={styles.icon}
              color={'var(--ant-gold)'}
              icon={<Icon color={'#fff'} icon={ArrowUpIcon} />}
              size={ICON_SIZE}
            />
          </Flexbox>
        </Upload>
        <Upload
          directory
          multiple={true}
          showUploadList={false}
          beforeUpload={async (file) => {
            // Directory upload keeps its own path — the whole tree inherits
            // its root's visibility, so we skip the mode-driven default and
            // let the server infer from the parent chain.
            await pushDockFileList([file], libraryId, currentFolderId ?? undefined);

            return false;
          }}
        >
          <Flexbox className={styles.card} padding={16}>
            <span className={styles.actionTitle}>
              {t('FileManager.emptyStatus.actions.folder')}
            </span>
            <div className={styles.glow} style={{ background: 'var(--ant-geekblue)' }} />
            <FileTypeIcon
              className={styles.icon}
              color={'var(--ant-geekblue)'}
              icon={<Icon color={'#fff'} icon={ArrowUpIcon} />}
              size={ICON_SIZE}
              type={'folder'}
            />
          </Flexbox>
        </Upload>
      </Flexbox>
    </Center>
  );
};

export default EmptyPlaceholder;
