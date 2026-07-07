import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { ActionIcon, Center, Flexbox, Icon, Text } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import { UploadIcon, XIcon } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fileManagerSelectors, useFileStore } from '@/store/file';

import styles from './index.module.css';
import Item from './Item';

/**
 * Show & manage current uploading tasks
 */
const UploadDock = memo(() => {
  const { t } = useTranslation('file');
  const [show, setShow] = useState(true);

  const dispatchDockFileList = useFileStore((s) => s.dispatchDockFileList);
  const expand = useFileStore((s) => s.uploadDockExpanded);
  const setExpand = useFileStore((s) => s.setUploadDockExpanded);
  const totalUploadingProgress = useFileStore(fileManagerSelectors.overviewUploadingProgress);
  const fileList = useFileStore(fileManagerSelectors.dockFileList, isEqual);
  const cancelUploads = useFileStore((s) => s.cancelUploads);
  const overviewUploadingStatus = useFileStore(
    fileManagerSelectors.overviewUploadingStatus,
    isEqual,
  );
  const isUploading = overviewUploadingStatus === 'uploading';

  const hasCancellableUploads = useMemo(
    () => fileList.some((item) => item.status === 'uploading' || item.status === 'pending'),
    [fileList],
  );

  const cancelAllActiveUploads = useCallback(() => {
    cancelUploads(
      fileList
        .filter((item) => item.status === 'uploading' || item.status === 'pending')
        .map((item) => item.id),
    );
  }, [cancelUploads, fileList]);

  const icon = useMemo(() => {
    switch (overviewUploadingStatus) {
      case 'success': {
        return <CheckCircleFilled style={{ color: 'var(--ant-color-success)' }} />;
      }
      case 'error': {
        return <CloseCircleFilled style={{ color: 'var(--ant-color-error)' }} />;
      }

      default: {
        return <Icon icon={UploadIcon} />;
      }
    }
  }, [overviewUploadingStatus]);

  const count = fileList.length;

  useEffect(() => {
    if (show) return;
    if (isUploading) setShow(true);
  }, [isUploading, show]);

  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isUploading || overviewUploadingStatus === 'pending') {
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
      }
      return;
    }

    autoDismissTimerRef.current = setTimeout(() => {
      setShow(false);
      dispatchDockFileList({ ids: fileList.map((item) => item.id), type: 'removeFiles' });
    }, 3000);

    return () => {
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
      }
    };
  }, [isUploading, overviewUploadingStatus, fileList, dispatchDockFileList]);

  if (count === 0 || !show) return;

  return (
    <Flexbox className={styles.container}>
      <Flexbox
        horizontal
        align={'center'}
        justify={'space-between'}
        style={{
          background: 'var(--ant-color-bg-container)',
          borderBottom: expand ? `1px solid ${'var(--ant-color-split)'}` : undefined,
          borderBottomLeftRadius: expand ? 0 : 8,
          borderBottomRightRadius: expand ? 0 : 8,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          cursor: 'pointer',
          paddingBlock: 8,
          paddingInline: '24px 12px',
          transition: 'all 0.3s ease-in-out',
        }}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <Flexbox horizontal align={'center'} className={styles.title} gap={16}>
          {icon}
          {t(`uploadDock.uploadStatus.${overviewUploadingStatus}`)} ·{' '}
          {t('uploadDock.totalCount', { count })}
        </Flexbox>
        <Flexbox
          horizontal
          align={'center'}
          gap={12}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {hasCancellableUploads && (
            <Text
              style={{ cursor: 'pointer', flexShrink: 0, fontSize: 13 }}
              type={'secondary'}
              onClick={cancelAllActiveUploads}
            >
              {t('uploadDock.header.cancelAll')}
            </Text>
          )}
          {!isUploading && (
            <ActionIcon
              icon={XIcon}
              onClick={() => {
                setShow(false);
                dispatchDockFileList({ ids: fileList.map((item) => item.id), type: 'removeFiles' });
              }}
            />
          )}
        </Flexbox>
      </Flexbox>

      <AnimatePresence mode="wait">
        {expand ? (
          <m.div
            animate={{ height: 400, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            key="expanded"
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Flexbox
              style={{
                background: 'var(--ant-color-bg-container)',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                height: 400,
              }}
            >
              <Flexbox
                flex={1}
                gap={8}
                paddingBlock={8}
                style={{ minHeight: 0, overflowY: 'scroll' }}
              >
                {fileList.map((item) => (
                  <Item key={item.id} {...item} />
                ))}
              </Flexbox>
              {isUploading && (
                <Center style={{ flexShrink: 0, height: 40, minHeight: 40 }}>
                  <Text
                    style={{ cursor: 'pointer' }}
                    type={'secondary'}
                    onClick={() => {
                      setExpand(false);
                    }}
                  >
                    {t('uploadDock.body.collapse')}
                  </Text>
                </Center>
              )}
            </Flexbox>
          </m.div>
        ) : (
          overviewUploadingStatus !== 'pending' && (
            <m.div
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              initial={{ opacity: 0, scaleY: 0 }}
              key="collapsed"
              style={{ originY: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div
                className={styles.progress}
                style={{
                  borderColor:
                    overviewUploadingStatus === 'success'
                      ? 'var(--ant-color-success)'
                      : overviewUploadingStatus === 'error'
                        ? 'var(--ant-color-error)'
                        : undefined,
                  insetInlineEnd: `${100 - totalUploadingProgress}%`,
                }}
              />
            </m.div>
          )
        )}
      </AnimatePresence>
    </Flexbox>
  );
});

export default UploadDock;
