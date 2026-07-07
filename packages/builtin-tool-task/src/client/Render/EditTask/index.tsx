'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Markdown, Text } from '@lobehub/ui';
import { Pencil } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import TaskPriorityTag from '@/features/AgentTasks/features/TaskPriorityTag';

import type { EditTaskParams, EditTaskState } from '../../../types';
import {
  AssigneeInline,
  InlineField,
  monoChipClassName,
  SectionField,
  TaskResultCard,
} from '../shared';
import styles from './index.module.css';

export const EditTaskRender = memo<BuiltinRenderProps<EditTaskParams, EditTaskState>>(
  ({ args, pluginState }) => {
    const { t } = useTranslation('plugin');

    const params = args ?? ({} as Partial<EditTaskParams>);
    const identifier = pluginState?.identifier ?? params.identifier;

    const hasName = params.name !== undefined;
    const hasPriority = params.priority !== undefined;
    const hasAssignee = params.assigneeAgentId !== undefined;
    const hasParent = params.parentIdentifier !== undefined;
    const hasInstruction = params.instruction !== undefined;
    const hasDescription = params.description !== undefined;
    const hasAddDeps = !!params.addDependencies?.length;
    const hasRemoveDeps = !!params.removeDependencies?.length;

    const hasAnyChange =
      hasName ||
      hasPriority ||
      hasAssignee ||
      hasParent ||
      hasInstruction ||
      hasDescription ||
      hasAddDeps ||
      hasRemoveDeps;

    return (
      <TaskResultCard
        icon={Pencil}
        identifier={identifier}
        title={t('builtins.lobe-task.apiName.editTask')}
      >
        {hasAnyChange ? (
          <>
            {hasName && (
              <InlineField label={t('builtins.lobe-task.edit.rename')}>{params.name}</InlineField>
            )}
            {hasPriority && (
              <InlineField label={t('builtins.lobe-task.edit.priority')}>
                <TaskPriorityTag disableDropdown priority={params.priority!} size={16} />
              </InlineField>
            )}
            {hasAssignee && (
              <InlineField label={t('builtins.lobe-task.edit.assign')}>
                {params.assigneeAgentId === null ? (
                  <Text type={'secondary'}>{t('builtins.lobe-task.edit.unassign')}</Text>
                ) : (
                  <AssigneeInline agentId={params.assigneeAgentId!} />
                )}
              </InlineField>
            )}
            {hasParent && (
              <InlineField label={t('builtins.lobe-task.edit.parent')}>
                {params.parentIdentifier === null ? (
                  <Text type={'secondary'}>{t('builtins.lobe-task.edit.parentClear')}</Text>
                ) : (
                  <span className={monoChipClassName}>{params.parentIdentifier}</span>
                )}
              </InlineField>
            )}
            {hasInstruction && (
              <SectionField label={t('builtins.lobe-task.field.instruction')}>
                <Markdown fontSize={12} variant={'chat'}>
                  {params.instruction!}
                </Markdown>
              </SectionField>
            )}
            {hasDescription && (
              <SectionField label={t('builtins.lobe-task.field.description')}>
                {params.description}
              </SectionField>
            )}
            {hasAddDeps && (
              <InlineField label={t('builtins.lobe-task.edit.blocksOn')}>
                <div className={styles.deps}>
                  {params.addDependencies!.map((dep) => (
                    <span className={styles.addChip} key={`add-${dep}`}>
                      {dep}
                    </span>
                  ))}
                </div>
              </InlineField>
            )}
            {hasRemoveDeps && (
              <InlineField label={t('builtins.lobe-task.edit.unblocks')}>
                <div className={styles.deps}>
                  {params.removeDependencies!.map((dep) => (
                    <span className={styles.removeChip} key={`remove-${dep}`}>
                      {dep}
                    </span>
                  ))}
                </div>
              </InlineField>
            )}
          </>
        ) : null}
      </TaskResultCard>
    );
  },
);

EditTaskRender.displayName = 'EditTaskRender';

export default EditTaskRender;
