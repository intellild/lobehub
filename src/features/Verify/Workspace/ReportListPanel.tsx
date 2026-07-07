'use client';

import type { VerifyRunStatus, VerifyVerdict } from '@lobechat/types';
import {
  ActionIcon,
  Center,
  DraggablePanel,
  DraggablePanelContainer,
  type DraggablePanelProps,
  Empty,
  Flexbox,
  Icon,
  Text,
} from '@lobehub/ui';
import type { DropdownItem } from '@lobehub/ui/base-ui';
import { confirmModal, DropdownMenu } from '@lobehub/ui/base-ui';
import { App } from 'antd';
import dayjs from 'dayjs';
import isEqual from 'fast-deep-equal';
import {
  CircleCheck,
  CircleHelp,
  CircleX,
  ClipboardCheck,
  LoaderCircle,
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Search,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import NavItem from '@/features/NavPanel/components/NavItem';
import { SkeletonList } from '@/features/NavPanel/components/SkeletonList';
import { useResponsive } from '@/hooks/useResponsive';
import { mutate } from '@/libs/swr';
import { verifyKeys } from '@/libs/swr/keys';
import type { VerifyReportSummary } from '@/services/verify';
import { verifyService } from '@/services/verify';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

import { useVerifyReportSummariesInfinite } from '../hooks';
import styles from './ReportListPanel.module.css';

const PANEL_MIN = 260;
const PANEL_MAX = 420;

type Glyph = 'ok' | 'bad' | 'unsure' | 'running';

const runningStatuses = new Set<VerifyRunStatus>(['planned', 'repairing', 'verifying']);

const glyphOf = (
  status: VerifyRunStatus | null,
  verdict: VerifyVerdict | null | undefined,
): Glyph => {
  if (status && runningStatuses.has(status)) return 'running';
  if (verdict === 'passed' || status === 'passed' || status === 'delivered') return 'ok';
  if (verdict === 'failed' || status === 'failed') return 'bad';
  return 'unsure';
};

const glyphMeta: Record<Glyph, { color: string; icon: typeof CircleCheck }> = {
  bad: { color: 'var(--ant-color-error)', icon: CircleX },
  ok: { color: 'var(--ant-color-success)', icon: CircleCheck },
  running: { color: 'var(--ant-color-info)', icon: LoaderCircle },
  unsure: { color: 'var(--ant-color-warning)', icon: CircleHelp },
};

const relativeTime = (value?: Date | string | null) => {
  if (!value) return '';
  const d = dayjs(value);
  return dayjs().diff(d, 'day') < 7 ? d.fromNow() : d.format('MMM D');
};

const ReportListItem = memo<{
  active: boolean;
  item: VerifyReportSummary;
  onReportsChanged: () => Promise<unknown> | unknown;
}>(({ active, item, onReportsChanged }) => {
  const { t } = useTranslation(['verify', 'common']);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(item.run.title || '');
  const [mutating, setMutating] = useState(false);
  const isSavingRef = useRef(false);

  const status = item.run.status ?? null;
  const glyph = glyphOf(status, item.report?.verdict);
  const meta = glyphMeta[glyph];

  const planCount = Array.isArray(item.run.plan) ? item.run.plan.length : 0;
  const total = item.report?.totalChecks ?? planCount;
  const passed = item.report?.passedChecks ?? 0;
  const failed = item.report?.failedChecks ?? 0;
  const title = item.run.title || t('verify:reports.untitled');
  const time =
    glyph === 'running'
      ? t('verify:list.running')
      : relativeTime(item.report?.generatedAt ?? item.run.createdAt);

  const refreshRelatedReports = async () => {
    await Promise.all([onReportsChanged(), mutate(verifyKeys.reportBundle(item.run.id))]);
  };

  const startRename = () => {
    setDraftTitle(title);
    setEditing(true);
  };

  const cancelRename = () => {
    if (isSavingRef.current) return;
    setDraftTitle(item.run.title || '');
    setEditing(false);
  };

  const commitRename = async () => {
    if (isSavingRef.current) return;

    const nextTitle = draftTitle.trim();
    if (!nextTitle) {
      message.error(t('verify:workspace.renameEmpty'));
      setDraftTitle(item.run.title || '');
      setEditing(false);
      return;
    }

    if (nextTitle === title) {
      setEditing(false);
      return;
    }

    isSavingRef.current = true;
    setMutating(true);
    try {
      await verifyService.updateRunTitle(item.run.id, nextTitle);
      await refreshRelatedReports();
      message.success(t('verify:workspace.renameSuccess'));
      setEditing(false);
    } catch (error) {
      console.error('[verify:renameReport]', error);
      message.error(t('verify:workspace.renameError'));
    } finally {
      isSavingRef.current = false;
      setMutating(false);
    }
  };

  const deleteReport = () => {
    confirmModal({
      cancelText: t('common:cancel'),
      content: t('verify:workspace.deleteConfirmDescription', { title }),
      okButtonProps: { danger: true },
      okText: t('common:delete'),
      onOk: async () => {
        setMutating(true);
        try {
          await verifyService.deleteRun(item.run.id);
          if (active) navigate('/verify', { replace: true });
          await Promise.all([
            onReportsChanged(),
            mutate(verifyKeys.reportBundle(item.run.id), null, { revalidate: false }),
          ]);
          message.success(t('verify:workspace.deleteSuccess'));
        } catch (error) {
          console.error('[verify:deleteReport]', error);
          message.error(t('verify:workspace.deleteError'));
        } finally {
          setMutating(false);
        }
      },
      title: t('verify:workspace.deleteConfirmTitle'),
    });
  };

  const menuItems: DropdownItem[] = [
    {
      icon: <Icon icon={Pencil} />,
      key: 'rename',
      label: t('verify:workspace.actions.rename'),
      onClick: startRename,
    },
    {
      danger: true,
      icon: <Icon icon={Trash2} />,
      key: 'delete',
      label: t('verify:workspace.actions.delete'),
      onClick: deleteReport,
    },
  ];

  // Rename swaps the whole row for an inline input.
  if (editing) {
    return (
      <div className={styles.editRow}>
        <input
          autoFocus
          className={styles.itemTitleInput}
          value={draftTitle}
          onBlur={() => void commitRename()}
          onChange={(e) => setDraftTitle(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              void commitRename();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              cancelRename();
            }
          }}
        />
      </div>
    );
  }

  const description =
    time || (total > 0 && glyph !== 'running') ? (
      <Flexbox horizontal className={styles.itemSub} gap={8}>
        {time ? <span>{time}</span> : null}
        {total > 0 && glyph !== 'running' ? (
          <span className={styles.counts}>
            {passed}/{total}
            {failed > 0 ? (
              <>
                {' · '}
                <em>{t('verify:list.failedCount', { count: failed })}</em>
              </>
            ) : null}
          </span>
        ) : null}
      </Flexbox>
    ) : undefined;

  return (
    <NavItem
      active={active}
      description={description}
      style={mutating ? { opacity: 0.62, pointerEvents: 'none' } : undefined}
      title={title}
      titleColor={'var(--ant-color-text)'}
      actions={
        <DropdownMenu
          iconSpaceMode={'group'}
          items={menuItems}
          placement={'bottomRight'}
          popupProps={{ style: { minWidth: 140 } }}
        >
          <ActionIcon
            icon={MoreHorizontal}
            size={'small'}
            title={t('verify:workspace.actions.more')}
          />
        </DropdownMenu>
      }
      icon={
        <Icon
          className={glyph === 'running' ? styles.spin : undefined}
          icon={meta.icon}
          size={16}
          style={{ color: meta.color }}
        />
      }
      onClick={() => navigate(`/verify/${item.run.id}`)}
    />
  );
});

ReportListItem.displayName = 'ReportListItem';

const ReportListPanel = memo(() => {
  const { t } = useTranslation('verify');
  const { runId } = useParams<{ runId: string }>();
  const { md = true } = useResponsive();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  // Debounce the server-side search so each keystroke doesn't fire a query.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  const { items, error, hasMore, isLoadingInitial, isLoadingMore, loadMore, reload } =
    useVerifyReportSummariesInfinite(debouncedQuery);

  const [showPanel, panelWidth, updateSystemStatus] = useGlobalStore((s) => [
    systemStatusSelectors.showVerifyReportPanel(s),
    systemStatusSelectors.verifyReportPanelWidth(s),
    s.updateSystemStatus,
  ]);
  const [tmpWidth, setTmpWidth] = useState(panelWidth);
  if (tmpWidth !== panelWidth) setTmpWidth(panelWidth);

  const handleSizeChange: DraggablePanelProps['onSizeChange'] = (_, size) => {
    if (!size) return;
    const w = typeof size.width === 'string' ? Number.parseInt(size.width) : size.width;
    if (!w || isEqual(w, panelWidth)) return;
    setTmpWidth(w);
    updateSystemStatus({ verifyReportPanelWidth: w });
  };

  // Infinite scroll: load the next page when a sentinel near the list's end
  // scrolls into view (rootMargin pre-fetches before the user hits the bottom).
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) loadMore();
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <DraggablePanel
      className={styles.panel}
      defaultSize={{ width: tmpWidth }}
      expand={showPanel}
      maxWidth={PANEL_MAX}
      minWidth={PANEL_MIN}
      mode={md ? 'fixed' : 'float'}
      placement={'left'}
      size={{ height: '100%', width: panelWidth }}
      onExpandChange={(expand) => updateSystemStatus({ showVerifyReportPanel: expand })}
      onSizeChange={handleSizeChange}
    >
      <DraggablePanelContainer style={{ flex: 'none', height: '100%', minWidth: PANEL_MIN }}>
        <div className={styles.head}>
          <div className={styles.titleRow}>
            <Text strong style={{ fontSize: 15 }}>
              {t('workspace.title')}
            </Text>
            <button
              aria-label={t('workspace.collapse')}
              className={styles.collapseBtn}
              title={t('workspace.collapse')}
              type={'button'}
              onClick={() => updateSystemStatus({ showVerifyReportPanel: false })}
            >
              <Icon icon={PanelLeftClose} size={16} />
            </button>
          </div>
          <label className={styles.search}>
            <Icon icon={Search} size={13} />
            <input
              placeholder={t('workspace.search')}
              type={'search'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <Flexbox flex={1} style={{ minHeight: 0, overflowX: 'hidden', overflowY: 'auto' }}>
          {error && items.length === 0 ? (
            // A failed fetch must read as an error with a retry — not masquerade
            // as an empty "no reports" page.
            <Center className={styles.emptyState} gap={12}>
              <Empty
                description={t('workspace.loadError')}
                icon={TriangleAlert}
                title={t('workspace.loadErrorTitle')}
              />
              <button className={styles.clearBtn} type={'button'} onClick={() => reload()}>
                {t('workspace.retry')}
              </button>
            </Center>
          ) : isLoadingInitial ? (
            <SkeletonList rows={6} style={{ paddingBlock: 6, paddingInline: 8 }} />
          ) : items.length === 0 ? (
            debouncedQuery ? (
              <div className={styles.empty}>
                <span className={styles.emptyMsg}>
                  {t('workspace.searchEmptyPrefix')}
                  <b className={styles.queryHl}>{debouncedQuery}</b>
                  {t('workspace.searchEmptySuffix')}
                </span>
                <button className={styles.clearBtn} type={'button'} onClick={() => setQuery('')}>
                  {t('workspace.clearSearch')}
                </button>
              </div>
            ) : (
              <Center className={styles.emptyState}>
                <Empty
                  description={t('workspace.listEmpty')}
                  icon={ClipboardCheck}
                  title={t('workspace.listEmptyTitle')}
                />
              </Center>
            )
          ) : (
            <div className={styles.list}>
              {items.map((item) => (
                <ReportListItem
                  active={item.run.id === runId}
                  item={item}
                  key={item.run.id}
                  onReportsChanged={reload}
                />
              ))}
              {/* Sentinel drives infinite scroll; keep it mounted so the observer
                  can re-fire after each page appends. */}
              <div aria-hidden ref={sentinelRef} style={{ height: 1 }} />
              {isLoadingMore ? (
                <SkeletonList rows={2} style={{ paddingBlock: 6, paddingInline: 8 }} />
              ) : error ? (
                // A later page failed (page 1 already rendered above): offer an
                // inline retry instead of a silently stuck bottom skeleton.
                <div className={styles.loadMoreError}>
                  <span>{t('workspace.loadMoreError')}</span>
                  <button className={styles.clearBtn} type={'button'} onClick={() => reload()}>
                    {t('workspace.retry')}
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </Flexbox>
      </DraggablePanelContainer>
    </DraggablePanel>
  );
});

ReportListPanel.displayName = 'ReportListPanel';

export default ReportListPanel;
