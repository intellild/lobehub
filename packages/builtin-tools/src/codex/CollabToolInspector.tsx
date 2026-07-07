'use client';

import {
  highlightTextStyles,
  inspectorTextStyles,
  shinyTextStyles,
} from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import type { TFunction } from 'i18next';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { CodexCollabToolArgs, CodexCollabToolState } from './collabToolUtils';
import { getCollabAgentCount, getCollabPrompt, getCollabToolName } from './collabToolUtils';

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

const getToolLabel = (t: TFunction<'plugin'>, toolName: string) => {
  switch (toolName) {
    case 'close_agent': {
      return t('builtins.codex.collabTool.closeAgent', { defaultValue: 'Close subagent' });
    }
    case 'send_input': {
      return t('builtins.codex.collabTool.sendInput', { defaultValue: 'Message subagent' });
    }
    case 'spawn_agent': {
      return t('builtins.codex.collabTool.spawnAgent', { defaultValue: 'Spawn subagent' });
    }
    case 'wait': {
      return t('builtins.codex.collabTool.wait', { defaultValue: 'Wait for subagents' });
    }
    default: {
      return t('builtins.codex.apiName.collab_tool_call', {
        defaultValue: 'Coordinate subagents',
      });
    }
  }
};

const CollabToolInspector = memo<BuiltinInspectorProps<CodexCollabToolArgs, CodexCollabToolState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
    const { t } = useTranslation('plugin');
    const toolName = getCollabToolName(args, pluginState) || getCollabToolName(partialArgs);
    const label = getToolLabel(t, toolName);

    const prompt = getCollabPrompt(args, pluginState) || getCollabPrompt(partialArgs);
    const agentCount = getCollabAgentCount(args, pluginState);
    const target =
      prompt.split('\n')[0].trim() ||
      (agentCount > 0 ? t('builtins.codex.collabTool.agentCount', { count: agentCount }) : '');

    if (isArgumentsStreaming && !target) {
      return <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>{label}</div>;
    }

    return (
      <div
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <span>{label}</span>
        {target && (
          <>
            <span>: </span>
            <span className={highlightTextStyles.primary}>{target}</span>
          </>
        )}
      </div>
    );
  },
);

CollabToolInspector.displayName = 'CodexCollabToolInspector';

export default CollabToolInspector;
