'use client';

import { priorityLabel } from '@lobechat/prompts';
import type { BuiltinInspectorProps } from '@lobechat/types';
import type { ReactNode } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import AssigneeAvatar from '@/features/AgentTasks/features/AssigneeAvatar';
import { useAgentDisplayMeta } from '@/features/AgentTasks/shared/useAgentDisplayMeta';
import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { EditTaskParams, EditTaskState } from '../../../types';
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

const AssigneeChip = memo<{ agentId: string }>(({ agentId }) => {
  const agentMeta = useAgentDisplayMeta(agentId, { fallbackToDefault: false });
  const displayName = agentMeta?.title || agentId;

  return (
    <span className={styles.assigneeChip} title={displayName}>
      <span className={styles.assigneeAvatar}>
        <AssigneeAvatar agentId={agentId} fallbackToDefault={false} size={16} />
      </span>
      <span className={styles.assigneeName}>{displayName}</span>
    </span>
  );
});

AssigneeChip.displayName = 'AssigneeChip';

export const EditTaskInspector = memo<BuiltinInspectorProps<EditTaskParams, EditTaskState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');

    const params = args || partialArgs || ({} as Partial<EditTaskParams>);
    const identifier = params.identifier;

    const segments: { content: ReactNode; key: string }[] = [];

    if (params.name !== undefined) {
      segments.push({
        content: (
          <>
            <span className={styles.label}>{t('builtins.lobe-task.edit.rename')}</span>
            <span className={styles.chip}>{params.name}</span>
          </>
        ),
        key: 'name',
      });
    }

    if (params.priority !== undefined) {
      segments.push({
        content: (
          <>
            <span className={styles.label}>{t('builtins.lobe-task.edit.priority')}</span>
            <span className={styles.chip}>{priorityLabel(params.priority)}</span>
          </>
        ),
        key: 'priority',
      });
    }

    if (params.instruction !== undefined) {
      segments.push({
        content: <span className={styles.chip}>{t('builtins.lobe-task.edit.instruction')}</span>,
        key: 'instruction',
      });
    }

    if (params.description !== undefined) {
      segments.push({
        content: <span className={styles.chip}>{t('builtins.lobe-task.edit.description')}</span>,
        key: 'description',
      });
    }

    if (params.parentIdentifier !== undefined) {
      segments.push({
        content:
          params.parentIdentifier === null ? (
            <span className={styles.chip}>{t('builtins.lobe-task.edit.parentClear')}</span>
          ) : (
            <>
              <span className={styles.label}>{t('builtins.lobe-task.edit.parent')}</span>
              <span className={styles.chip}>{params.parentIdentifier}</span>
            </>
          ),
        key: 'parent',
      });
    }

    if (params.assigneeAgentId !== undefined) {
      segments.push({
        content:
          params.assigneeAgentId === null ? (
            <span className={styles.chip}>{t('builtins.lobe-task.edit.unassign')}</span>
          ) : (
            <>
              <span className={styles.label}>{t('builtins.lobe-task.edit.assign')}</span>
              <AssigneeChip agentId={params.assigneeAgentId} />
            </>
          ),
        key: 'assignee',
      });
    }

    if (params.addDependencies?.length) {
      segments.push({
        content: (
          <>
            <span className={styles.label}>{t('builtins.lobe-task.edit.blocksOn')}</span>
            {params.addDependencies.map((dep) => (
              <span className={styles.addChip} key={`add-${dep}`}>
                {dep}
              </span>
            ))}
          </>
        ),
        key: 'addDeps',
      });
    }

    if (params.removeDependencies?.length) {
      segments.push({
        content: (
          <>
            <span className={styles.label}>{t('builtins.lobe-task.edit.unblocks')}</span>
            {params.removeDependencies.map((dep) => (
              <span className={styles.removeChip} key={`remove-${dep}`}>
                {dep}
              </span>
            ))}
          </>
        ),
        key: 'removeDeps',
      });
    }

    return (
      <div
        style={{ flexWrap: 'wrap', gap: 6 }}
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <span>{t('builtins.lobe-task.apiName.editTask')}</span>
        {identifier && <span className={styles.identifierChip}>{identifier}</span>}
        {segments.map((segment, index) => (
          <span className={styles.group} key={segment.key}>
            {index > 0 && <span style={{ color: 'var(--ant-color-text-quaternary)' }}>·</span>}
            {segment.content}
          </span>
        ))}
      </div>
    );
  },
);

EditTaskInspector.displayName = 'EditTaskInspector';

export default EditTaskInspector;
