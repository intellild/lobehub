'use client';

import { Flexbox, Tag, Text } from '@lobehub/ui';
import { Tabs } from '@lobehub/ui/base-ui';
import { useMemo, useState } from 'react';

import {
  bodyKindForMode,
  deriveFixtureProps,
  type LifecycleMode,
  type ToolRenderFixtureVariant,
} from './lifecycleMode';
import styles from './ToolPreview.module.css';
import { ToolBodySlot, ToolInspectorSlot } from './toolSurfaces';
import type { ApiEntry } from './useDevtoolsEntries';
import { toApiAnchor } from './useDevtoolsEntries';

interface ToolPreviewProps {
  api: ApiEntry;
  mode: LifecycleMode;
}

const ToolPreview = ({ api, mode }: ToolPreviewProps) => {
  const messageId = `devtools-${api.identifier}-${api.apiName}`;
  const toolCallId = `${messageId}-tool`;

  const variants = api.fixture.variants;
  const [activeVariantId, setActiveVariantId] = useState<string>(variants[0]?.id ?? 'default');
  const activeVariant: ToolRenderFixtureVariant =
    variants.find((variant) => variant.id === activeVariantId) ?? variants[0];

  const derived = useMemo(() => deriveFixtureProps(activeVariant, mode), [activeVariant, mode]);

  return (
    <Flexbox className={styles.card} id={toApiAnchor(api.apiName)}>
      <Flexbox className={styles.cardHeader}>
        <Flexbox horizontal align={'center'} gap={8} wrap={'wrap'}>
          <Text fontSize={18} weight={600}>
            {api.apiName}
          </Text>
          <Tag>{api.identifier}</Tag>
          {variants.length > 1 && (
            <Tabs
              activeKey={activeVariant.id}
              size={'small'}
              items={variants.map((variant) => ({
                key: variant.id,
                label: variant.label,
              }))}
              onChange={(key) => setActiveVariantId(key)}
            />
          )}
        </Flexbox>
        {(api.description || activeVariant.description) && (
          <Text fontSize={13} type={'secondary'}>
            {activeVariant.description ?? api.description}
          </Text>
        )}
      </Flexbox>

      <Flexbox className={styles.cardBody} gap={16}>
        <Flexbox gap={8}>
          <Flexbox horizontal className={styles.sectionLabel}>
            <Text fontSize={12} type={'secondary'} weight={600}>
              Inspector
            </Text>
          </Flexbox>
          <div className={styles.previewShell}>
            <ToolInspectorSlot
              api={api}
              derived={derived}
              toolCallId={toolCallId}
              variant={activeVariant}
            />
          </div>
        </Flexbox>

        <Flexbox gap={8}>
          <Flexbox horizontal className={styles.sectionLabel}>
            <Text fontSize={12} type={'secondary'} weight={600}>
              Body
            </Text>
            <Tag>{bodyKindForMode(mode)}</Tag>
          </Flexbox>
          <div className={styles.previewShell}>
            <ToolBodySlot
              api={api}
              derived={derived}
              messageId={messageId}
              mode={mode}
              toolCallId={toolCallId}
            />
          </div>
        </Flexbox>

        <details>
          <summary className={styles.fixtureSummary}>Fixture payload</summary>
          <pre className={styles.code}>
            {JSON.stringify(
              {
                args: derived.args,
                content: derived.content,
                isArgumentsStreaming: derived.isArgumentsStreaming,
                isLoading: derived.isLoading,
                partialArgs: derived.partialArgs,
                pluginError: derived.pluginError,
                pluginState: derived.pluginState,
              },
              null,
              2,
            )}
          </pre>
        </details>
      </Flexbox>
    </Flexbox>
  );
};

export default ToolPreview;
