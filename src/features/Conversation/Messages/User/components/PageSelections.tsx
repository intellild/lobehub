import { Flexbox } from '@lobehub/ui';
import { Code2Icon } from 'lucide-react';
import { memo } from 'react';

import type { ContextSelection, PageSelection } from '@/types/index';

import styles from './PageSelections.module.css';

type UserContextSelection = ContextSelection | PageSelection;

interface PageSelectionsProps {
  selections: UserContextSelection[];
}

const isContextSelection = (selection: UserContextSelection): selection is ContextSelection =>
  'source' in selection;

const isCodeSelection = (selection: UserContextSelection): selection is ContextSelection =>
  isContextSelection(selection) && selection.source === 'code';

const getCodeSelectionMeta = (selection: ContextSelection): string => {
  if (selection.source !== 'code') return selection.title || '';

  const lineRange = selection.lineRange
    ? `:${selection.lineRange.startLine}-${selection.lineRange.endLine ?? selection.lineRange.startLine}`
    : '';

  return `${selection.filePath}${lineRange}`;
};

const CodeSelection = memo<{ selection: ContextSelection }>(({ selection }) => (
  <Flexbox className={styles.codeContainer}>
    <Flexbox horizontal className={styles.codeHeader} gap={6}>
      <Code2Icon size={14} />
      <div className={styles.codeMeta}>{getCodeSelectionMeta(selection)}</div>
    </Flexbox>
    <pre className={styles.codeContent}>{selection.content}</pre>
  </Flexbox>
));

CodeSelection.displayName = 'UserMessageCodeSelection';

const QuoteSelection = memo<{ selection: UserContextSelection }>(({ selection }) => (
  <Flexbox className={styles.container}>
    <Flexbox horizontal className={styles.wrapper} gap={4} padding={4}>
      <span className={styles.quote}>"</span>
      <div className={styles.content}>{selection.content}</div>
    </Flexbox>
  </Flexbox>
));

QuoteSelection.displayName = 'UserMessageQuoteSelection';

const SelectionItem = memo<{ selection: UserContextSelection }>(({ selection }) => {
  if (isCodeSelection(selection)) return <CodeSelection selection={selection} />;

  return <QuoteSelection selection={selection} />;
});

SelectionItem.displayName = 'UserMessageSelectionItem';

const PageSelections = memo<PageSelectionsProps>(({ selections }) => {
  if (!selections || selections.length === 0) return null;

  return (
    <Flexbox gap={8}>
      {selections.map((selection) => (
        <SelectionItem key={selection.id} selection={selection} />
      ))}
    </Flexbox>
  );
});

export default PageSelections;
