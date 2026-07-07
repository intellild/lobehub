import { type ItemType } from '@lobehub/ui';
import { Icon } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import { LibraryBig } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import FileIcon from '@/components/FileIcon';
import RepoIcon from '@/components/LibIcon';
import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors } from '@/store/agent/selectors';

import { useAgentId } from '../../hooks/useAgentId';
import CheckboxItem from '../components/CheckboxWithLoading';
import styles from './useControls.module.css';

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

// Cap so the widest library/file row (icon + label + checkbox + paddings) stays within the
// submenu's 320px footer-driven width, keeping it level with the skill submenu instead of
// growing past it.
const labelMaxWidth = 'min(210px, 45vw)';

export interface KnowledgeControls {
  enabledCount: number;
  footer: ReactNode;
  items: ItemType[];
}

export const useControls = ({
  openAttachKnowledgeModal,
}: {
  openAttachKnowledgeModal: () => void;
}) => {
  const { t } = useTranslation('chat');
  const agentId = useAgentId();

  const files = useAgentStore((s) => agentByIdSelectors.getAgentFilesById(agentId)(s), isEqual);
  const knowledgeBases = useAgentStore(
    (s) => agentByIdSelectors.getAgentKnowledgeBasesById(agentId)(s),
    isEqual,
  );

  const [toggleFile, toggleKnowledgeBase] = useAgentStore((s) => [
    s.toggleFile,
    s.toggleKnowledgeBase,
  ]);
  const enabledCount =
    files.filter((item) => item.enabled).length +
    knowledgeBases.filter((item) => item.enabled).length;

  const libraryItems = knowledgeBases.map((item) => ({
    icon: <RepoIcon />,
    key: item.id,
    label: (
      <CheckboxItem
        checked={item.enabled}
        hasPadding={false}
        id={item.id}
        label={item.name}
        labelMaxWidth={labelMaxWidth}
        onUpdate={async (id, enabled) => {
          await toggleKnowledgeBase(id, enabled);
        }}
      />
    ),
  }));

  const fileItems = files.map((item) => ({
    icon: <FileIcon fileName={item.name} fileType={item.type} size={20} />,
    key: item.id,
    label: (
      <CheckboxItem
        checked={item.enabled}
        hasPadding={false}
        id={item.id}
        label={item.name}
        labelMaxWidth={labelMaxWidth}
        onUpdate={async (id, enabled) => {
          await toggleFile(id, enabled);
        }}
      />
    ),
  }));

  // Flat list (no "Libraries" / "Files" group headers): libraries first, then files.
  const relatedGroups: ItemType[] = [
    ...libraryItems,
    ...(libraryItems.length > 0 && fileItems.length > 0 ? [{ type: 'divider' as const }] : []),
    ...fileItems,
  ];

  const footer = (
    <button
      className={cx(styles.viewMore)}
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        openAttachKnowledgeModal();
      }}
    >
      <Icon icon={LibraryBig} size={16} />
      <span className={cx(styles.viewMoreLabel)}>{t('knowledgeBase.viewMore')}</span>
    </button>
  );

  return { enabledCount, footer, items: relatedGroups } satisfies KnowledgeControls;
};
