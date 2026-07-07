'use client';

import { Flexbox, Text } from '@lobehub/ui';
import { memo, useEffect, useRef } from 'react';

import styles from './ApiList.module.css';
import type { ApiEntry } from './useDevtoolsEntries';

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

/**
 * Split a name at its last `__` so the long `mcp__<server>__` namespace can
 * elide from the middle (`mcp__claude_ai_Li…get_diff`) — keeping both the
 * `mcp` signal up front and the distinguishing action at the end, instead of
 * truncating one or the other away. Non-namespaced names are all tail.
 */
const splitName = (name: string): { head: string; tail: string } => {
  const cut = name.lastIndexOf('__');
  if (cut === -1) return { head: '', tail: name };
  return { head: name.slice(0, cut + 2), tail: name.slice(cut + 2) };
};

interface ApiListProps {
  activeApiName?: string;
  apis: ApiEntry[];
  onSelect: (apiName: string) => void;
}

/**
 * Middle column for the render gallery: a dense jump-list of the current
 * toolset's APIs. Clicking scrolls the matching `ToolPreview` card into view
 * and pins a URL hash (`#api-<name>`) so a specific render is deep-linkable;
 * the active item is driven by the scrollspy in `ToolPage`. The leading dot
 * lights up when the API ships a Render.
 */
const ApiList = memo<ApiListProps>(({ apis, activeApiName, onSelect }) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the highlighted item visible as the scrollspy walks down the right
  // pane — otherwise the list stays pinned at the top and you lose your place.
  useEffect(() => {
    if (!activeApiName) return;
    const el = listRef.current?.querySelector(`[data-api="${CSS.escape(activeApiName)}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeApiName]);

  return (
    <aside className={styles.column}>
      <div className={styles.header}>
        <Text fontSize={12} type={'secondary'} weight={600}>
          APIs · {apis.length}
        </Text>
      </div>
      <Flexbox className={styles.list} ref={listRef}>
        {apis.map((api) => {
          const active = api.apiName === activeApiName;
          const { head, tail } = splitName(api.apiName);
          return (
            <Flexbox
              horizontal
              className={cx(styles.item, active && styles.itemActive)}
              data-api={api.apiName}
              key={api.apiName}
              title={api.apiName}
              onClick={() => onSelect(api.apiName)}
            >
              <span className={cx(styles.dot, api.render && styles.dotActive)} />
              <span className={styles.labelRow}>
                {head && <span className={styles.labelHead}>{head}</span>}
                <span className={styles.labelTail}>{tail}</span>
              </span>
            </Flexbox>
          );
        })}
      </Flexbox>
    </aside>
  );
});

ApiList.displayName = 'DevtoolsApiList';

export default ApiList;
