'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { RemoveDocumentArgs, RemoveDocumentState } from '../../../types';
import { formatDocumentId } from '../_styles';
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

export const RemoveDocumentInspector = memo<
  BuiltinInspectorProps<RemoveDocumentArgs, RemoveDocumentState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
  const { t } = useTranslation('plugin');

  const id = args?.id || partialArgs?.id;

  return (
    <div
      style={{ flexWrap: 'wrap', gap: 4 }}
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span style={{ color: 'var(--ant-color-error)' }}>
        {t('builtins.lobe-agent-documents.apiName.removeDocument')}
      </span>
      {id && <span className={styles.removeChip}>{formatDocumentId(id)}</span>}
    </div>
  );
});

RemoveDocumentInspector.displayName = 'RemoveDocumentInspector';

export default RemoveDocumentInspector;
