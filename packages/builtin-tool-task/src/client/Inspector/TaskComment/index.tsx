'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type {
  AddTaskCommentParams,
  AddTaskCommentState,
  DeleteTaskCommentParams,
  DeleteTaskCommentState,
  UpdateTaskCommentParams,
  UpdateTaskCommentState,
} from '../../../types';
import { TaskApiName } from '../../../types';
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

interface TaskCommentInspectorProps extends BuiltinInspectorProps<
  AddTaskCommentParams | UpdateTaskCommentParams | DeleteTaskCommentParams,
  AddTaskCommentState | UpdateTaskCommentState | DeleteTaskCommentState
> {
  apiName: string;
}

const selectLabelKey = (apiName: string) => {
  switch (apiName) {
    case TaskApiName.addTaskComment: {
      return 'builtins.lobe-task.apiName.addTaskComment';
    }
    case TaskApiName.updateTaskComment: {
      return 'builtins.lobe-task.apiName.updateTaskComment';
    }
    case TaskApiName.deleteTaskComment: {
      return 'builtins.lobe-task.apiName.deleteTaskComment';
    }
    default: {
      return 'builtins.lobe-task.apiName.addTaskComment';
    }
  }
};

export const TaskCommentInspector = memo<TaskCommentInspectorProps>(
  ({ apiName, args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');

    const params = args || partialArgs || {};
    const identifier = 'identifier' in params ? params.identifier : undefined;
    const commentId = 'commentId' in params ? params.commentId : undefined;
    const content = 'content' in params ? params.content : undefined;

    return (
      <div
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <span>{t(selectLabelKey(apiName))}</span>
        {identifier && <span className={styles.chip}>{identifier}</span>}
        {commentId && <span className={styles.chip}>{commentId}</span>}
        {content && <span className={styles.contentChip}>{content}</span>}
      </div>
    );
  },
);

TaskCommentInspector.displayName = 'TaskCommentInspector';

export const AddTaskCommentInspector = (
  props: BuiltinInspectorProps<AddTaskCommentParams, AddTaskCommentState>,
) => <TaskCommentInspector {...props} apiName={TaskApiName.addTaskComment} />;
AddTaskCommentInspector.displayName = 'AddTaskCommentInspector';

export const UpdateTaskCommentInspector = (
  props: BuiltinInspectorProps<UpdateTaskCommentParams, UpdateTaskCommentState>,
) => <TaskCommentInspector {...props} apiName={TaskApiName.updateTaskComment} />;
UpdateTaskCommentInspector.displayName = 'UpdateTaskCommentInspector';

export const DeleteTaskCommentInspector = (
  props: BuiltinInspectorProps<DeleteTaskCommentParams, DeleteTaskCommentState>,
) => <TaskCommentInspector {...props} apiName={TaskApiName.deleteTaskComment} />;
DeleteTaskCommentInspector.displayName = 'DeleteTaskCommentInspector';
