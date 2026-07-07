'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Github } from '@lobehub/icons';
import { Check, X } from 'lucide-react';
import { memo } from 'react';

import styles from './RunCommandInspector.module.css';
import { getGhSubcommand, type GithubRunCommandArgs, type GithubRunCommandState } from './utils';

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

const GithubRunCommandInspector = memo<
  BuiltinInspectorProps<GithubRunCommandArgs, GithubRunCommandState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const command = args?.command || partialArgs?.command || '';
  const description = args?.description || partialArgs?.description || '';
  const subcommand = getGhSubcommand(command);
  const label = description || subcommand;

  const pulse = isArgumentsStreaming || isLoading;
  const isSuccess = pluginState?.success ?? pluginState?.exitCode === 0;
  const hasResult = !pulse && pluginState && pluginState.success !== undefined;

  return (
    <div className={cx(inspectorTextStyles.root, pulse && shinyTextStyles.shinyText)}>
      <Github className={styles.icon} size={14} />
      <span className={styles.ghPrefix}>gh</span>
      {label && (
        <span className={styles.chip}>
          <span className={styles.command}>{label}</span>
        </span>
      )}
      {hasResult ? (
        isSuccess ? (
          <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
        ) : (
          <X className={styles.statusIcon} color={'var(--ant-color-error)'} size={14} />
        )
      ) : null}
    </div>
  );
});

GithubRunCommandInspector.displayName = 'GithubRunCommandInspector';

export default GithubRunCommandInspector;
