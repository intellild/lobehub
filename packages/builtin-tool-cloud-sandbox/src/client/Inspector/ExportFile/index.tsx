'use client';

import { FilePathDisplay } from '@lobechat/shared-tool-ui/components';
import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon } from '@lobehub/ui';
import { Check, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ExportFileState } from '../../../types';

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

interface ExportFileArgs {
  path?: string;
}

export const ExportFileInspector = memo<BuiltinInspectorProps<ExportFileArgs, ExportFileState>>(
  ({ args, partialArgs, isArgumentsStreaming, pluginState, isLoading }) => {
    const { t } = useTranslation('plugin');

    const filePath = args?.path || partialArgs?.path || '';
    const showShiny = isArgumentsStreaming || isLoading;

    return (
      <div className={cx(inspectorTextStyles.root, showShiny && shinyTextStyles.shinyText)}>
        <span style={{ marginInlineEnd: 6 }}>
          {t('builtins.lobe-cloud-sandbox.apiName.exportFile')}:
        </span>
        {filePath && <FilePathDisplay filePath={filePath} />}
        {!isLoading && pluginState !== undefined && (
          <span style={{ marginInlineStart: 4 }}>
            {pluginState.success ? (
              <Icon color={'var(--ant-color-success)'} icon={Check} size={14} />
            ) : (
              <Icon color={'var(--ant-color-error)'} icon={X} size={14} />
            )}
          </span>
        )}
      </div>
    );
  },
);

ExportFileInspector.displayName = 'ExportFileInspector';
