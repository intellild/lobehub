'use client';

import { ActionIcon, Flexbox, Input, Text } from '@lobehub/ui';
import { Badge, Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Eye, Search } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useEvalStore } from '@/store/eval';

import SegmentBar from '../../../../features/SegmentBar';
import { createTestCasePreviewModal } from '../TestCasePreviewModal';
import styles from './index.module.css';

interface TestCasesTabProps {
  datasetId: string;
}

const TestCasesTab = memo<TestCasesTabProps>(({ datasetId }) => {
  const { t } = useTranslation('eval');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const useFetchTestCases = useEvalStore((s) => s.useFetchTestCases);

  const { data: testCaseData, isLoading: loading } = useFetchTestCases({
    datasetId,
    limit: pagination.pageSize,
    offset: (pagination.current - 1) * pagination.pageSize,
  });

  const data = testCaseData?.data || [];
  const total = testCaseData?.total || 0;

  // Difficulty mix across the loaded page — drives the summary strip's bar.
  const difficulty = useMemo(() => {
    const counts = { easy: 0, hard: 0, medium: 0 };
    for (const c of data) {
      const d = c?.metadata?.difficulty as 'easy' | 'hard' | 'medium' | undefined;
      if (d === 'easy' || d === 'medium' || d === 'hard') counts[d] += 1;
    }
    return {
      counts,
      segments: [
        { color: 'var(--ant-color-success)', value: counts.easy },
        { color: 'var(--ant-color-warning)', value: counts.medium },
        { color: 'var(--ant-color-error)', value: counts.hard },
      ],
      tagged: counts.easy + counts.medium + counts.hard,
    };
  }, [data]);

  // Client-side filtering
  const filteredData = data.filter((c: any) => {
    if (diffFilter !== 'all' && c.metadata?.difficulty !== diffFilter) return false;
    if (search && !c.content?.input?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'id',
      key: 'index',
      render: (_: any, __: any, index: number) => (
        <span className={styles.indexCell}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
      title: '#',
      width: 64,
    },
    {
      dataIndex: ['content', 'input'],
      ellipsis: true,
      key: 'input',
      render: (text: string) => <p className={styles.inputCell}>{text}</p>,
      title: t('table.columns.input'),
    },
    {
      dataIndex: ['metadata', 'difficulty'],
      key: 'difficulty',
      render: (difficulty: string) => (difficulty ? getDifficultyBadge(difficulty) : '-'),
      title: t('table.columns.difficulty'),
      width: 96,
    },
    {
      dataIndex: ['metadata', 'tags'],
      key: 'tags',
      render: (tags: string[]) =>
        tags?.length > 0 ? (
          <Flexbox horizontal gap={4}>
            {tags.slice(0, 1).map((tag) => (
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
        ) : (
          '-'
        ),
      title: t('table.columns.tags'),
      width: 112,
    },
    {
      key: 'actions',
      render: (_: any, record: any) => (
        <ActionIcon
          icon={Eye}
          size="small"
          onClick={() => createTestCasePreviewModal({ testCase: record })}
        />
      ),
      width: 64,
    },
  ];

  return (
    <>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Flexbox horizontal align="center" justify="space-between">
            <span className={styles.headerTitle}>{t('benchmark.detail.tabs.data')}</span>
            <Flexbox horizontal align="center" gap={12}>
              <div style={{ position: 'relative' }}>
                <Search className={styles.searchIcon} size={14} />
                <Input
                  className={styles.searchInput}
                  placeholder={t('testCase.search.placeholder')}
                  size="small"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination({ ...pagination, current: 1 });
                  }}
                />
              </div>
              <div className={styles.filterContainer}>
                {(['all', 'easy', 'medium', 'hard'] as const).map((f) => (
                  <button
                    className={styles.filterButton}
                    data-active={diffFilter === f}
                    key={f}
                    onClick={() => {
                      setDiffFilter(f);
                      setPagination({ ...pagination, current: 1 });
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Flexbox>
          </Flexbox>
        </div>

        <div className={styles.summaryRow}>
          <Flexbox gap={2}>
            <span className={styles.summaryValue}>{total}</span>
            <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
              {t('benchmark.detail.stats.cases')}
            </Text>
          </Flexbox>
          {difficulty.tagged > 0 && (
            <Flexbox flex={1} gap={6} style={{ maxWidth: 320, minWidth: 0 }}>
              <SegmentBar segments={difficulty.segments} />
              <Flexbox horizontal gap={12} style={{ flexWrap: 'wrap' }}>
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <Flexbox horizontal align="center" gap={6} key={d}>
                    <span
                      className={styles.summaryDot}
                      style={{
                        background:
                          d === 'easy'
                            ? 'var(--ant-color-success)'
                            : d === 'medium'
                              ? 'var(--ant-color-warning)'
                              : 'var(--ant-color-error)',
                      }}
                    />
                    <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
                      {t(`difficulty.${d}`)} {difficulty.counts[d]}
                    </Text>
                  </Flexbox>
                ))}
              </Flexbox>
            </Flexbox>
          )}
        </div>

        <div className={styles.table}>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            size="middle"
            pagination={{
              current: pagination.current,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
              pageSize: pagination.pageSize,
              showSizeChanger: false,
              total: filteredData.length,
            }}
          />
        </div>
      </Card>
    </>
  );
});

export default TestCasesTab;
