'use client';

import { CheckCircleFilled, CloseCircleFilled, DownloadOutlined } from '@ant-design/icons';
import type { BuiltinRenderProps } from '@lobechat/types';
import { ActionIcon, Flexbox, Text } from '@lobehub/ui';
import { memo, useCallback } from 'react';

import type { ExportFileState } from '../../../types';
import styles from './index.module.css';

interface ExportFileParams {
  path: string;
}

const ExportFile = memo<BuiltinRenderProps<ExportFileParams, ExportFileState>>(
  ({ args, pluginState }) => {
    const isSuccess = pluginState?.success;

    const handleDownload = useCallback(async () => {
      if (!pluginState?.downloadUrl || !pluginState?.filename) return;

      try {
        // Fetch the file content to bypass cross-origin download restrictions
        const response = await fetch(pluginState.downloadUrl);
        const blob = await response.blob();

        // Create a blob URL and trigger download
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = pluginState.filename;
        document.body.append(link);
        link.click();
        link.remove();

        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
      } catch {
        // Fallback: open in new tab if fetch fails
        window.open(pluginState.downloadUrl, '_blank');
      }
    }, [pluginState?.downloadUrl, pluginState?.filename]);

    return (
      <Flexbox className={styles.container} gap={8}>
        <Flexbox horizontal align={'center'} gap={8}>
          {pluginState === undefined ? null : isSuccess ? (
            <CheckCircleFilled
              className={styles.statusIcon}
              style={{ color: 'var(--ant-color-success)' }}
            />
          ) : (
            <CloseCircleFilled className={styles.statusIcon} style={{ color: 'var(--ant-color-error)' }} />
          )}
          <Text code as={'span'} fontSize={12}>
            {isSuccess
              ? `Exported: ${pluginState?.filename || args.path}`
              : `Failed to export ${args.path}`}
          </Text>
          {isSuccess && pluginState?.downloadUrl && (
            <ActionIcon
              icon={DownloadOutlined}
              size={'small'}
              title="Download"
              onClick={handleDownload}
            />
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

ExportFile.displayName = 'ExportFile';

export default ExportFile;
