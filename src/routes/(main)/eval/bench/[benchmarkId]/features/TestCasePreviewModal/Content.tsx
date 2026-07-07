'use client';

import { Flexbox } from '@lobehub/ui';
import { Badge } from 'antd';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Content.module.css';

const getDifficultyBadge = (difficulty: string) => {
  const config: Record<string, { bg: string; color: string }> = {
    easy: {
      bg: 'var(--ant-color-success-bg)',
      color: 'var(--ant-color-success)',
    },
    hard: {
      bg: 'var(--ant-color-error-bg)',
      color: 'var(--ant-color-error)',
    },
    medium: {
      bg: 'var(--ant-color-warning-bg)',
      color: 'var(--ant-color-warning)',
    },
  };

  const c = config[difficulty] || config.easy;
  return (
    <Badge
      style={{
        backgroundColor: c.bg,
        borderColor: c.color + '30',
        color: c.color,
        fontSize: 12,
        textTransform: 'capitalize',
      }}
    >
      {difficulty}
    </Badge>
  );
};

export interface TestCasePreviewContentProps {
  testCase: any;
}

const TestCasePreviewContent: FC<TestCasePreviewContentProps> = ({ testCase }) => {
  const { t } = useTranslation('eval');

  if (!testCase) return null;

  return (
    <Flexbox gap={16}>
      <Flexbox gap={4}>
        <p className={styles.previewLabel}>{t('testCase.preview.input')}</p>
        <div className={styles.previewBlock}>{testCase.content?.input}</div>
      </Flexbox>
      <Flexbox gap={4}>
        <p className={styles.previewLabel}>{t('testCase.preview.expected')}</p>
        <div className={styles.previewBlock}>{testCase.content?.expectedOutput || '-'}</div>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        {testCase.metadata?.difficulty && getDifficultyBadge(testCase.metadata.difficulty)}
        {testCase.metadata?.tags?.map((tag: string) => (
          <Badge
            key={tag}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--ant-color-border)',
              color: 'var(--ant-color-text-tertiary)',
              fontSize: 12,
            }}
          >
            {tag}
          </Badge>
        ))}
      </Flexbox>
    </Flexbox>
  );
};

export default TestCasePreviewContent;
