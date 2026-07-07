'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { ActionIcon, Block, Markdown, Text } from '@lobehub/ui';
import { PanelRight, PanelRightClose } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import TaskPriorityTag from '@/features/AgentTasks/features/TaskPriorityTag';
import TaskStatusTag from '@/features/AgentTasks/features/TaskStatusTag';
import { useChatStore } from '@/store/chat';
import { chatPortalSelectors } from '@/store/chat/selectors';

import type { CreateTaskParams, CreateTaskState } from '../../../types';
import styles from './index.module.css';

export const CreateTaskRender = memo<BuiltinRenderProps<CreateTaskParams, CreateTaskState>>(
  ({ args, pluginState }) => {
    const { t } = useTranslation('chat');
    const [activeTaskDetailId, showTaskDetail, openTaskDetail, closeTaskDetail] = useChatStore(
      (s) => [
        chatPortalSelectors.taskDetailId(s),
        chatPortalSelectors.showTaskDetail(s),
        s.openTaskDetail,
        s.closeTaskDetail,
      ],
    );

    const identifier = pluginState?.identifier;
    // Auto-expanding the freshly created task's detail portal is driven by the
    // executor's `onAfterCall` hook (gateway `tool_end`), not a render effect —
    // see `client/executor`. The card itself only handles the manual toggle.

    // Prefer the resolved task (`pluginState`); fall back to `args` while the
    // call is still streaming and no result has landed yet.
    const name = pluginState?.name ?? args?.name;

    if (!name && !identifier) return null;

    const status = pluginState?.status;
    const priority = pluginState?.priority ?? undefined;
    const description = pluginState?.description;
    const instruction = args?.instruction;
    const parent = pluginState?.parentIdentifier ?? args?.parentIdentifier;
    const isExpanded = !!identifier && showTaskDetail && activeTaskDetailId === identifier;

    const toggle = () => {
      if (!identifier) return;
      if (isExpanded) closeTaskDetail();
      else openTaskDetail(identifier);
    };

    return (
      <Block
        clickable={!!identifier}
        variant={'outlined'}
        width={'100%'}
        onClick={identifier ? () => openTaskDetail(identifier) : undefined}
      >
        <div className={styles.taskItem}>
          <div className={styles.row}>
            {identifier && <span className={styles.identifier}>{identifier}</span>}
            {name && <Text className={styles.title}>{name}</Text>}
            {status && <TaskStatusTag disableDropdown size={14} status={status} />}
            {!!priority && <TaskPriorityTag disableDropdown priority={priority} size={14} />}
            {identifier && (
              <ActionIcon
                active={isExpanded}
                icon={isExpanded ? PanelRightClose : PanelRight}
                size={'small'}
                title={t(isExpanded ? 'taskDetail.closeDetail' : 'taskDetail.openDetail')}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle();
                }}
              />
            )}
          </div>
          {description ? (
            <div className={styles.description}>{description}</div>
          ) : instruction ? (
            <div className={styles.instruction}>
              <Markdown fontSize={12} variant={'chat'}>
                {instruction}
              </Markdown>
            </div>
          ) : null}
          {parent && (
            <Text as={'span'} color={'var(--ant-color-text-tertiary)'} fontSize={11}>
              {`Subtask of ${parent}`}
            </Text>
          )}
        </div>
      </Block>
    );
  },
);

CreateTaskRender.displayName = 'CreateTaskRender';

export default CreateTaskRender;
