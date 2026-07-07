import { ActionIcon, Block, Center, Flexbox, Text } from '@lobehub/ui';
import { Trash2Icon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useFileStore } from '@/store/file';
import { type UploadFileItem } from '@/types/files/upload';

import UploadDetail from '../../../components/UploadDetail';
import Content from './Content';
import styles from './index.module.css';

type FileItemProps = UploadFileItem;

const FileItem = memo<FileItemProps>((props) => {
  const { file, uploadState, status, id, tasks } = props;
  const { t } = useTranslation(['chat', 'common']);
  const [removeChatUploadFile] = useFileStore((s) => [s.removeChatUploadFile]);

  return (
    <Block horizontal align={'center'} className={styles.container} variant={'outlined'}>
      <Center flex={1} height={64} padding={4} style={{ maxWidth: 64 }}>
        <Content {...props} />
      </Center>
      <Flexbox flex={1} gap={4} style={{ paddingBottom: 4, paddingInline: 4 }}>
        <Text
          style={{ fontSize: 12, maxWidth: 88 }}
          ellipsis={{
            tooltip: file.name,
          }}
        >
          {file.name}
        </Text>
        <UploadDetail size={file.size} status={status} tasks={tasks} uploadState={uploadState} />
      </Flexbox>
      <Flexbox className={styles.actions}>
        <ActionIcon
          color={'red'}
          icon={Trash2Icon}
          size={'small'}
          title={t('delete', { ns: 'common' })}
          onClick={() => {
            removeChatUploadFile(id);
          }}
        />
      </Flexbox>
    </Block>
  );
});

export default FileItem;
