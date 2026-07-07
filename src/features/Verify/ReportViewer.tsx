'use client';

import type { VerifyEvidenceType, VerifyRunContext } from '@lobechat/types';
import {
  Block,
  Center,
  Empty,
  Flexbox,
  Highlighter,
  Icon,
  Image,
  Markdown,
  Text,
} from '@lobehub/ui';
import { Button, Modal } from '@lobehub/ui/base-ui';
import type { TFunction } from 'i18next';
import {
  AlertTriangle,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Video,
  X,
} from 'lucide-react';
import { memo, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Loading from '@/components/Loading/BrandTextLoading';
import { useTextFileLoader } from '@/features/FileViewer/hooks/useTextFileLoader';
import type { VerifyEvidenceWithUrl, VerifyResultWithEvidence } from '@/services/verify';
import { getLanguageFromFilename } from '@/utils/fileLanguage';

import { useVerifyReportBundle } from './hooks';
import styles from './ReportViewer.module.css';

type Verdict = 'passed' | 'failed' | 'uncertain';
type Filter = 'all' | Verdict;

/** Best-effort filename from a (possibly signed) file URL, for syntax highlighting. */
const filenameFromUrl = (url: string): string => {
  try {
    return new URL(url).pathname.split('/').pop() || 'document';
  } catch {
    return 'document';
  }
};

const VERDICT_META: Record<
  Verdict,
  { bg: string; color: string; dot: string; icon: typeof Check; labelKey: string }
> = {
  failed: {
    bg: 'var(--ant-color-error-bg)',
    color: 'var(--ant-color-error-text)',
    dot: 'var(--ant-color-error)',
    icon: X,
    labelKey: 'report.verdict.failed',
  },
  passed: {
    bg: 'var(--ant-color-success-bg)',
    color: 'var(--ant-color-success-text)',
    dot: 'var(--ant-color-success)',
    icon: Check,
    labelKey: 'report.verdict.passed',
  },
  uncertain: {
    bg: 'var(--ant-color-warning-bg)',
    color: 'var(--ant-color-warning-text)',
    dot: 'var(--ant-color-warning)',
    icon: CircleHelp,
    labelKey: 'report.verdict.uncertain',
  },
};

const imageEvidenceTypes = new Set(['gif', 'screenshot']);
/** Media that renders/plays inline in the check body (image + video), no click-to-open. */
const isInlineEvidence = (evidence: VerifyEvidenceWithUrl) =>
  Boolean(evidence.fileUrl && (imageEvidenceTypes.has(evidence.type) || evidence.type === 'video'));

/** Coarse attachment bucket for the type marker: image / video / everything else. */
type EvidenceCategory = 'file' | 'image' | 'video';
const evidenceCategory = (type: VerifyEvidenceType): EvidenceCategory =>
  type === 'video' ? 'video' : imageEvidenceTypes.has(type) ? 'image' : 'file';
const CATEGORY_ICON: Record<EvidenceCategory, typeof FileText> = {
  file: FileText,
  image: ImageIcon,
  video: Video,
};
const CATEGORY_ORDER: EvidenceCategory[] = ['image', 'video', 'file'];
// `errored` is terminal too (the verifier couldn't run) — stop polling and don't
// treat it as a live/in-progress status.
const terminalRunStatuses = new Set(['delivered', 'errored', 'failed', 'passed']);
const liveStatusLabelKey = {
  planned: 'report.status.planned',
  repairing: 'report.status.repairing',
  unverified: 'report.status.unverified',
  verifying: 'report.status.verifying',
} as const;

/** Severity-first sort: failed → uncertain → passed. */
const SEVERITY_RANK: Record<Verdict, number> = { failed: 0, passed: 2, uncertain: 1 };

const checkVerdict = (result: VerifyResultWithEvidence): Verdict => {
  const v = result.verdict ?? result.status;
  if (v === 'passed' || v === 'failed' || v === 'uncertain') return v;
  return 'uncertain';
};

const evidenceDisplayName = (
  evidence: VerifyEvidenceWithUrl,
  t: TFunction<'verify'>,
  index: number,
) =>
  evidence.fileName ||
  (evidence.fileUrl ? filenameFromUrl(evidence.fileUrl) : '') ||
  evidence.description ||
  t('report.evidence.inlineFallback', { index });

/** A file-backed text evidence, decoded + syntax highlighted (avoids mojibake). */
const DocumentViewer = memo<{ fileName?: string | null; url: string }>(({ fileName, url }) => {
  const { t } = useTranslation('verify');
  const { fileData, loading, error } = useTextFileLoader(url);

  if (loading)
    return (
      <Center flex={1} height={'100%'}>
        <Loading debugId="verify-document-viewer" />
      </Center>
    );

  if (error || fileData === null)
    return (
      <Center flex={1} gap={8} height={'100%'}>
        <Text type="secondary">{t('report.document.failed')}</Text>
        <a href={url} rel="noreferrer" target="_blank">
          {t('report.document.openOriginal')}
        </a>
      </Center>
    );

  return (
    <Flexbox className={styles.docViewer}>
      <Highlighter
        wrap
        language={getLanguageFromFilename(fileName || filenameFromUrl(url))}
        showLanguage={false}
        variant={'borderless'}
      >
        {fileData}
      </Highlighter>
    </Flexbox>
  );
});

/** One evidence artifact rendered by its type: zoomable image/gif, video, doc, text. */
const EvidenceItem = memo<{ evidence: VerifyEvidenceWithUrl; index: number }>(
  ({ evidence: e, index }) => {
    const { t } = useTranslation('verify');
    const label = evidenceDisplayName(e, t, index);
    const description = e.description && e.description !== label ? e.description : null;
    // Inline media (image/gif/video) speaks for itself — the raw filename header
    // is visual noise, so only keep a meaningful caption (description) for it.
    const isMedia = isInlineEvidence(e);

    return (
      <Flexbox gap={6}>
        {!isMedia && (
          <Text strong fontSize={13}>
            {label}
          </Text>
        )}
        {description && (
          <Text fontSize={13} type={'secondary'}>
            {description}
          </Text>
        )}
        {e.fileUrl && imageEvidenceTypes.has(e.type) ? (
          <Flexbox align={'flex-start'} style={{ maxWidth: '100%' }}>
            <Image
              preview
              alt={e.description ?? label}
              src={e.fileUrl}
              style={{ maxWidth: '100%' }}
              variant={'outlined'}
            />
          </Flexbox>
        ) : e.fileUrl && e.type === 'video' ? (
          <video controls className={styles.evidenceVideo} src={e.fileUrl} />
        ) : e.fileUrl ? (
          <div className={styles.evidenceDoc}>
            <DocumentViewer fileName={e.fileName} url={e.fileUrl} />
          </div>
        ) : e.content ? (
          <div className={styles.evidenceText}>{e.content}</div>
        ) : (
          <span className={styles.softTag}>{e.type}</span>
        )}
      </Flexbox>
    );
  },
);

const EvidenceFileButton = memo<{
  evidence: VerifyEvidenceWithUrl;
  index: number;
  onClick: () => void;
}>(({ evidence, index, onClick }) => {
  const { t } = useTranslation('verify');
  const name = evidenceDisplayName(evidence, t, index);
  const description =
    evidence.description && evidence.description !== name ? evidence.description : null;

  return (
    <button
      className={styles.evidenceFile}
      title={t('report.evidence.openDetail', { name })}
      type={'button'}
      onClick={onClick}
    >
      <span className={styles.evidenceFileIcon}>
        <Icon icon={CATEGORY_ICON[evidenceCategory(evidence.type)]} size={13} />
      </span>
      <span className={styles.evidenceFileBody}>
        <span className={styles.evidenceFileName}>{name}</span>
        {description && <span className={styles.evidenceFileDesc}>{description}</span>}
      </span>
    </button>
  );
});

EvidenceFileButton.displayName = 'EvidenceFileButton';

/** Modal gallery of one check's evidence — one section per artifact, by type. */
const EvidenceModal = memo<{
  evidence: VerifyEvidenceWithUrl[];
  onClose: () => void;
  open: boolean;
  title: string;
}>(({ evidence, onClose, open, title }) => (
  <Modal
    footer={null}
    open={open}
    title={title}
    width={'min(760px, 92vw)'}
    onCancel={() => onClose()}
  >
    <Flexbox gap={20} style={{ maxHeight: '68vh', overflow: 'auto', paddingBlock: 4 }}>
      {evidence.map((e, index) => (
        <EvidenceItem evidence={e} index={index + 1} key={e.id} />
      ))}
    </Flexbox>
  </Modal>
));

EvidenceItem.displayName = 'EvidenceItem';

EvidenceModal.displayName = 'EvidenceModal';

/** One check — an expandable row; evidence opens one artifact at a time. */
const CheckRow = memo<{ defaultOpen: boolean; result: VerifyResultWithEvidence }>(
  ({ defaultOpen, result }) => {
    const { t } = useTranslation('verify');
    const [open, setOpen] = useState(defaultOpen);
    const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
    const verdict = checkVerdict(result);
    const meta = VERDICT_META[verdict];
    const evidenceCount = result.evidence.length;
    const categoryCounts = result.evidence.reduce(
      (acc, e) => {
        acc[evidenceCategory(e.type)] += 1;
        return acc;
      },
      { file: 0, image: 0, video: 0 } as Record<EvidenceCategory, number>,
    );
    const hasBody =
      Boolean(result.toulmin?.evidence) || Boolean(result.suggestion) || evidenceCount > 0;
    const selectedEvidenceIndex = selectedEvidenceId
      ? result.evidence.findIndex((e) => e.id === selectedEvidenceId)
      : -1;
    const selectedEvidence =
      selectedEvidenceIndex >= 0 ? result.evidence[selectedEvidenceIndex] : null;

    return (
      <div className={styles.row}>
        <button
          className={styles.rowHead}
          type={'button'}
          onClick={() => hasBody && setOpen((o) => !o)}
        >
          <span style={{ color: meta.dot, display: 'flex' }}>
            <Icon icon={meta.icon} size={16} />
          </span>
          <span className={styles.rowTitle} data-failed={verdict === 'failed'}>
            {result.checkItemTitle || result.checkItemId}
          </span>
          <span className={styles.rowSide}>
            {CATEGORY_ORDER.map((cat) =>
              categoryCounts[cat] > 0 ? (
                <span
                  className={styles.evChip}
                  key={cat}
                  title={`${t(`report.evidence.category.${cat}`)} × ${categoryCounts[cat]}`}
                >
                  <Icon icon={CATEGORY_ICON[cat]} size={12} />
                  {categoryCounts[cat]}
                </span>
              ) : null,
            )}
            {!result.required && (
              <span className={styles.softTag}>{t('report.check.optional')}</span>
            )}
            {hasBody && (
              <Icon className={styles.chev} data-open={open} icon={ChevronRight} size={14} />
            )}
          </span>
        </button>
        {open && hasBody && (
          <div className={styles.rowBody}>
            {result.toulmin?.evidence && (
              <p className={styles.reasoning}>{result.toulmin.evidence}</p>
            )}
            {result.suggestion && <p className={styles.suggestion}>{result.suggestion}</p>}
            {evidenceCount > 0 && (
              <>
                <div className={styles.evidenceList}>
                  {result.evidence.map((e, index) =>
                    isInlineEvidence(e) ? (
                      <EvidenceItem evidence={e} index={index + 1} key={e.id} />
                    ) : (
                      <EvidenceFileButton
                        evidence={e}
                        index={index + 1}
                        key={e.id}
                        onClick={() => setSelectedEvidenceId(e.id)}
                      />
                    ),
                  )}
                </div>
                {selectedEvidence && (
                  <EvidenceModal
                    evidence={[selectedEvidence]}
                    open={Boolean(selectedEvidence)}
                    title={evidenceDisplayName(selectedEvidence, t, selectedEvidenceIndex + 1)}
                    onClose={() => setSelectedEvidenceId(null)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

CheckRow.displayName = 'CheckRow';

const ReportPageState = memo<{
  action?: ReactNode;
  description: string;
  icon: typeof AlertTriangle;
  title: string;
}>(({ action, description, icon, title }) => (
  <Center gap={16} height={'100%'} style={{ minHeight: '70vh' }} width={'100%'}>
    <Empty description={description} icon={icon} title={title} />
    {action}
  </Center>
));

/** Build the meta row (branch / commit / surface / verified) from the run scope. */
const scopeToMeta = (
  context: VerifyRunContext | null | undefined,
  scenario: string | null | undefined,
  t: TFunction<'verify'>,
): { label: string; value: string }[] => {
  if (scenario !== 'coding' || !context) return [];
  const { branch, commit, surfaces, entry, focus, testedAt } = context;
  const surface = surfaces && surfaces.length > 0 ? surfaces.join(' / ') : undefined;
  const date = testedAt ? new Date(testedAt).toLocaleString() : undefined;
  return (
    [
      { label: t('report.scope.focus'), value: focus },
      { label: t('report.scope.branch'), value: branch },
      { label: t('report.scope.surface'), value: surface },
      { label: t('report.scope.entry'), value: entry },
      { label: t('report.scope.commit'), value: commit },
      { label: t('report.scope.date'), value: date },
    ] as { label: string; value?: string | null }[]
  ).filter((m): m is { label: string; value: string } => Boolean(m.value));
};

/**
 * The report detail pane. Renders the verdict hero, a sticky verdict-filter bar,
 * every check as a severity-ordered expandable row (failed rows open by default),
 * and the full narrative behind a collapsed disclosure. Addressed by `:runId`;
 * refreshes itself while the run is non-terminal.
 */
const ReportViewer = memo(() => {
  const { t } = useTranslation('verify');
  const { runId } = useParams<{ runId: string }>();
  const verifyRunId = runId ?? null;
  const { data, error, isLoading, mutate } = useVerifyReportBundle(verifyRunId);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const status = data?.run.status;
    if (!status || terminalRunStatuses.has(status)) return;
    const timer = window.setInterval(() => void mutate(), 5000);
    return () => window.clearInterval(timer);
  }, [data?.run.status, mutate]);

  const ordered = useMemo(() => {
    if (!data) return [];
    return [...data.results].sort(
      (a, b) => SEVERITY_RANK[checkVerdict(a)] - SEVERITY_RANK[checkVerdict(b)],
    );
  }, [data]);

  if (!verifyRunId) {
    return (
      <ReportPageState
        description={t('report.missing.description')}
        icon={AlertTriangle}
        title={t('report.missing.title')}
      />
    );
  }
  if (isLoading) return <Loading debugId="verify-report-viewer" />;
  if (error) {
    return (
      <ReportPageState
        description={t('report.error.description')}
        icon={X}
        title={t('report.error.title')}
        action={
          <Button icon={<RefreshCw size={16} />} onClick={() => void mutate()}>
            {t('report.actions.retry')}
          </Button>
        }
      />
    );
  }
  if (!data) {
    return (
      <ReportPageState
        description={t('report.notFound.description')}
        icon={FileText}
        title={t('report.notFound.title')}
      />
    );
  }

  const { run, report } = data;
  const liveStatus =
    run.status && !terminalRunStatuses.has(run.status)
      ? (run.status as keyof typeof liveStatusLabelKey)
      : null;

  const counts = ordered.reduce(
    (acc, r) => {
      acc[checkVerdict(r)] += 1;
      return acc;
    },
    { failed: 0, passed: 0, uncertain: 0 } as Record<Verdict, number>,
  );
  const total = report?.totalChecks ?? ordered.length;
  const passed = report?.passedChecks ?? counts.passed;
  const failed = report?.failedChecks ?? counts.failed;
  const uncertain = report?.uncertainChecks ?? counts.uncertain;
  const verdict = (report?.verdict as Verdict | null) ?? null;
  const visible = filter === 'all' ? ordered : ordered.filter((r) => checkVerdict(r) === filter);
  const meta = scopeToMeta(run.context, run.scenario, t);

  const chips: { count: number; dot?: string; key: Filter; label: string }[] = [
    { count: total, key: 'all', label: t('report.filter.all') },
    { count: failed, dot: 'var(--ant-color-error)', key: 'failed', label: t('report.filter.failed') },
    {
      count: uncertain,
      dot: 'var(--ant-color-warning)',
      key: 'uncertain',
      label: t('report.filter.uncertain'),
    },
    { count: passed, dot: 'var(--ant-color-success)', key: 'passed', label: t('report.filter.passed') },
  ];

  return (
    <div className={styles.scroll}>
      <div className={styles.page}>
        <Flexbox gap={12}>
          <div className={styles.heroLine}>
            {verdict && (
              <span
                className={styles.pill}
                style={{ background: VERDICT_META[verdict].bg, color: VERDICT_META[verdict].color }}
              >
                <Icon icon={VERDICT_META[verdict].icon} size={15} />
                {t(`report.verdict.${verdict}`)}
              </span>
            )}
            <Text as={'h1'} style={{ fontSize: 24, lineHeight: 1.3, margin: 0 }}>
              {run.title || t('report.titleFallback')}
            </Text>
          </div>

          {run.scenario !== 'coding' && run.goal && (
            <Text className={styles.summary}>{run.goal}</Text>
          )}
          {report?.summary && <Text className={styles.summary}>{report.summary}</Text>}

          {meta.length > 0 && (
            <div className={styles.meta}>
              {meta.map((m) => (
                <span className={styles.metaItem} key={m.label}>
                  {m.label} <code>{m.value}</code>
                </span>
              ))}
            </div>
          )}

          {liveStatus && (
            <div className={styles.liveBanner}>
              <Icon icon={Clock3} size={14} />
              {t(liveStatusLabelKey[liveStatus])}
            </div>
          )}
        </Flexbox>

        <div className={styles.stats}>
          {chips.map((c) => (
            <button
              className={styles.chip}
              data-active={filter === c.key}
              key={c.key}
              type={'button'}
              onClick={() => setFilter(c.key)}
            >
              {c.dot && <span className={styles.dot} style={{ background: c.dot }} />}
              {c.label} <b>{c.count}</b>
            </button>
          ))}
          {typeof report?.overallConfidence === 'number' && (
            <span className={`${styles.chip} ${styles.score}`}>
              {t('report.stats.confidence')} <b>{Math.round(report.overallConfidence * 100)}%</b>
            </span>
          )}
        </div>

        {visible.length > 0 ? (
          <div className={styles.checks}>
            {visible.map((r) => (
              <CheckRow
                defaultOpen={checkVerdict(r) === 'failed' || r.evidence.some(isInlineEvidence)}
                key={r.id}
                result={r}
              />
            ))}
          </div>
        ) : (
          <Block align={'center'} padding={24}>
            <Text type={'secondary'}>{t('report.filterEmpty')}</Text>
          </Block>
        )}

        {report?.content && (
          <details className={styles.narrative}>
            <summary className={styles.narrativeSummary}>
              <Icon icon={ChevronRight} size={13} />
              {t('report.sections.details')}
            </summary>
            <div className={styles.narrativeBody}>
              <Markdown>{report.content}</Markdown>
            </div>
          </details>
        )}
      </div>
    </div>
  );
});

export default ReportViewer;
