'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Flexbox, Highlighter, Text } from '@lobehub/ui';
import { memo, useMemo } from 'react';

import styles from './RunCommandRender.module.css';
import {
  getGithubOutput,
  type GithubRunCommandArgs,
  type GithubRunCommandState,
  normalizeGhCommand,
  tryParseJson,
} from './utils';

const GithubRunCommandRender = memo<
  BuiltinRenderProps<GithubRunCommandArgs, GithubRunCommandState>
>(({ args, content, pluginState }) => {
  const rawCommand = args?.command || '';
  const normalized = normalizeGhCommand(rawCommand);

  const output = getGithubOutput(pluginState, content);
  const stderr = pluginState?.stderr || '';
  const exitCode = pluginState?.exitCode;
  const success = pluginState?.success ?? (exitCode === undefined ? undefined : exitCode === 0);

  const { language: outputLanguage, body: outputBody } = useMemo(() => {
    const parsed = tryParseJson(output);
    if (parsed !== undefined) {
      return { body: JSON.stringify(parsed, null, 2), language: 'json' as const };
    }
    return { body: output, language: 'text' as const };
  }, [output]);

  if (!normalized && !output && !stderr) return null;

  return (
    <Flexbox gap={12}>
      {normalized && (
        <div>
          <Text className={styles.sectionLabel}>
            Command
            {success !== undefined && (
              <span
                className={`${styles.exitCode} ${
                  success ? styles.exitCodeSuccess : styles.exitCodeError
                }`}
              >
                exit {exitCode ?? (success ? 0 : 1)}
              </span>
            )}
          </Text>
          <Highlighter
            wrap
            language={'sh'}
            showLanguage={false}
            style={{ maxHeight: 160, overflow: 'auto', paddingInline: 8 }}
            variant={'outlined'}
          >
            {`gh ${normalized}`}
          </Highlighter>
        </div>
      )}
      {outputBody && (
        <div>
          <Text className={styles.sectionLabel}>Output</Text>
          <Highlighter
            wrap
            language={outputLanguage}
            showLanguage={outputLanguage === 'json'}
            style={{ maxHeight: 360, overflow: 'auto', paddingInline: 8 }}
            variant={'filled'}
          >
            {outputBody}
          </Highlighter>
        </div>
      )}
      {stderr && (
        <div>
          <Text className={styles.sectionLabel} style={{ color: 'var(--ant-color-error)' }}>
            Stderr
          </Text>
          <Highlighter
            wrap
            language={'text'}
            showLanguage={false}
            style={{ maxHeight: 200, overflow: 'auto', paddingInline: 8 }}
            variant={'filled'}
          >
            {stderr}
          </Highlighter>
        </div>
      )}
    </Flexbox>
  );
});

GithubRunCommandRender.displayName = 'GithubRunCommandRender';

export default GithubRunCommandRender;
