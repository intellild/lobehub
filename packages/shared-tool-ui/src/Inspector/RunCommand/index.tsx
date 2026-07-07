'use client';

import type { RunCommandState } from '@lobechat/tool-runtime';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Check, SquareChevronRight, X } from 'lucide-react';
import { type ComponentType, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '../../styles';
import { getRunCommandDisplayCommand } from '../../utils/runCommand';
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

interface RunCommandArgs {
  background?: boolean;
  command: string;
  description?: string;
  timeout?: number;
}

export interface RunCommandInspectorProps extends BuiltinInspectorProps<
  RunCommandArgs,
  RunCommandState
> {
  /**
   * Program brand icon (e.g. Node.js / Git / Python). When provided it leads the whole row —
   * placed before the label — and the command chip drops its terminal glyph. When omitted, the
   * default terminal glyph stays inside the command chip.
   */
  icon?: ComponentType<{ className?: string; size?: number }>;
  /** i18n key for the API name label, e.g. 'builtins.lobe-local-system.apiName.runCommand' */
  translationKey: string;
}

export const RunCommandInspector = memo<RunCommandInspectorProps>(
  ({
    args,
    partialArgs,
    isArgumentsStreaming,
    pluginState,
    isLoading,
    translationKey,
    icon: BrandIcon,
  }) => {
    const { t } = useTranslation('plugin');

    const command = getRunCommandDisplayCommand(args?.command || partialArgs?.command);
    const description = args?.description || partialArgs?.description || command;

    // Brand icon leads the row (before the label); otherwise the terminal glyph sits in the chip.
    const leading = BrandIcon ? <BrandIcon className={styles.leadingIcon} size={14} /> : null;
    const chipIcon = BrandIcon ? null : (
      <SquareChevronRight className={styles.terminalIcon} size={14} />
    );

    if (isArgumentsStreaming) {
      if (!description)
        return (
          <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
            {leading}
            <span>{t(translationKey as any)}</span>
          </div>
        );

      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          {leading}
          <span>{t(translationKey as any)}:</span>
          <span className={styles.chip}>
            {chipIcon}
            <span className={styles.command}>{description}</span>
          </span>
        </div>
      );
    }

    const isSuccess = pluginState?.success || pluginState?.exitCode === 0;

    return (
      <div className={cx(inspectorTextStyles.root, isLoading && shinyTextStyles.shinyText)}>
        {leading}
        <span>{t(translationKey as any)}:</span>
        {description && (
          <span className={styles.chip}>
            {chipIcon}
            <span className={styles.command}>{description}</span>
          </span>
        )}
        {isLoading ? null : pluginState?.success !== undefined ? (
          isSuccess ? (
            <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
          ) : (
            <X className={styles.statusIcon} color={'var(--ant-color-error)'} size={14} />
          )
        ) : null}
      </div>
    );
  },
);

RunCommandInspector.displayName = 'RunCommandInspector';

/**
 * Factory to create a RunCommandInspector with a bound translation key.
 * Use this in each package's inspector registry to avoid wrapper components.
 */
export const createRunCommandInspector = (translationKey: string) => {
  const Inspector = memo<BuiltinInspectorProps<RunCommandArgs, RunCommandState>>((props) => (
    <RunCommandInspector {...props} translationKey={translationKey} />
  ));
  Inspector.displayName = 'RunCommandInspector';
  return Inspector;
};
