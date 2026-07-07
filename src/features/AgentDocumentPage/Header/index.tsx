'use client';

import { ActionIcon, Flexbox, Text } from '@lobehub/ui';
import { DropdownMenu } from '@lobehub/ui/base-ui';
import { MoreHorizontal } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import ShareButton from '@/business/client/features/PageShare/ShareButton';
import { DESKTOP_HEADER_ICON_SMALL_SIZE } from '@/const/layoutTokens';
import { AutoSaveHint } from '@/features/EditorCanvas';
import NavHeader from '@/features/NavHeader';
import ToggleRightPanelButton from '@/features/RightPanel/ToggleRightPanelButton';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { oneLineEllipsis } from '@/styles';

import { useMenu } from './useMenu';

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

interface HeaderProps {
  agentDocumentId?: string;
  agentId: string;
  documentId: string;
  itemError?: unknown;
  onBack: () => void;
  onDeleted: () => void;
  title?: string;
  updatedAt?: Date | string | null;
}

const Header = memo<HeaderProps>(
  ({ agentId, agentDocumentId, documentId, itemError, onBack, onDeleted, title, updatedAt }) => {
    const { t } = useTranslation(['file', 'chat']);
    const meta = useAgentStore(agentSelectors.getAgentMetaById(agentId));
    const showTitleError = !!itemError && !title;
    const resolvedTitle = showTitleError
      ? t('workingPanel.resources.error', { ns: 'chat' })
      : title || t('pageEditor.titlePlaceholder');
    const { menuItems } = useMenu({
      agentDocumentId,
      agentId,
      documentId,
      onDeleted,
      title,
      updatedAt,
    });

    return (
      <NavHeader
        left={
          <Flexbox horizontal align={'center'} gap={4} style={{ minWidth: 0 }}>
            {/* Breadcrumb: agent → document. The agent label returns to chat. */}
            <Flexbox
              horizontal
              align={'center'}
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={onBack}
            >
              <Text style={{ color: 'var(--ant-color-text-secondary)' }}>
                {meta.title || t('untitledAgent', { ns: 'chat' })}
              </Text>
            </Flexbox>
            <Text style={{ color: 'var(--ant-color-text-quaternary)', flexShrink: 0 }}>/</Text>
            <Text
              className={cx(oneLineEllipsis)}
              style={{ color: showTitleError ? 'var(--ant-color-error)' : undefined, minWidth: 0 }}
              weight={500}
            >
              {resolvedTitle}
            </Text>
          </Flexbox>
        }
        right={
          <Flexbox horizontal align={'center'} gap={4}>
            {documentId && <AutoSaveHint documentId={documentId} />}
            {documentId && <ShareButton documentId={documentId} />}
            <ToggleRightPanelButton hideWhenExpanded />
            <DropdownMenu
              iconSpaceMode={'group'}
              items={menuItems}
              placement={'bottomRight'}
              popupProps={{ style: { minWidth: 200 } }}
            >
              <ActionIcon icon={MoreHorizontal} size={DESKTOP_HEADER_ICON_SMALL_SIZE} />
            </DropdownMenu>
          </Flexbox>
        }
      />
    );
  },
);

Header.displayName = 'AgentDocumentPageHeader';

export default Header;
