'use client';

import { ActionIcon, Block, Center, DropdownMenu, Flexbox, Icon, Text, Tooltip } from '@lobehub/ui';
import { ChevronDownIcon, PlusIcon } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';
import { usePermission } from '@/hooks/usePermission';
import { SessionDefaultGroup } from '@/types/session';

import { useCreateMenuItems } from '../../hooks';
import stylesModule from './CreateAgentButton.module.css';

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

const ACTION_CLASS_NAME = 'create-agent-actions';
const styles = stylesModule;

interface CreateAgentButtonProps {
  className?: string;
  groupId?: string;
  visibility?: 'private' | 'public';
}

const CreateAgentButton = memo<CreateAgentButtonProps>(({ groupId, className, visibility }) => {
  const { t } = useTranslation('chat');
  const { allowed: canCreate, reason } = usePermission('create_content');
  const {
    createAgent,
    createAgentMenuItem,
    createGroupChatMenuItem,
    createHeterogeneousAgentMenuItems,
    createPlatformAgentMenuItem,
    isMutatingAgent,
    openCreateModal,
  } = useCreateMenuItems();

  const isCustomGroup = Boolean(groupId) && groupId !== SessionDefaultGroup.Default;
  // Always carry visibility so agents created inside a private session group
  // land in the private bucket (otherwise they default to public and end up
  // orphaned — invisible in both lists). groupId is only attached for custom
  // groups so the default list keeps creating top-level agents.
  const menuOptions = useMemo(
    () =>
      isCustomGroup || visibility
        ? { ...(isCustomGroup ? { groupId } : {}), ...(visibility ? { visibility } : {}) }
        : undefined,
    [groupId, isCustomGroup, visibility],
  );

  const dropdownItems = useMemo(() => {
    const heteroItems = createHeterogeneousAgentMenuItems(menuOptions);
    const platformItem = createPlatformAgentMenuItem(menuOptions);
    return [
      createAgentMenuItem(menuOptions),
      createGroupChatMenuItem(menuOptions),
      ...(heteroItems.length > 0 ? [{ type: 'divider' as const }, ...heteroItems] : []),
      ...(platformItem ? [{ type: 'divider' as const }, platformItem] : []),
    ];
  }, [
    createAgentMenuItem,
    createGroupChatMenuItem,
    createHeterogeneousAgentMenuItems,
    createPlatformAgentMenuItem,
    menuOptions,
  ]);

  const handleClick = () => {
    if (!canCreate) return;
    if (openCreateModal) {
      openCreateModal('agent', menuOptions);
    } else {
      createAgent(menuOptions);
    }
  };

  const content = (
    <Block
      horizontal
      align={'center'}
      className={cx(styles.container, className)}
      clickable={canCreate}
      gap={8}
      height={36}
      paddingInline={4}
      style={canCreate ? { height: 36 } : { cursor: 'not-allowed', height: 36, opacity: 0.5 }}
      variant={'borderless'}
      onClick={handleClick}
    >
      <Center flex={'none'} height={28} width={28}>
        {isMutatingAgent ? (
          <NeuralNetworkLoading size={14} />
        ) : (
          <Icon icon={PlusIcon} size={'small'} />
        )}
      </Center>
      <Text style={{ flex: 1 }} type={'secondary'}>
        {t('newAgent')}
      </Text>
      {canCreate && (
        <Flexbox
          horizontal
          align={'center'}
          className={ACTION_CLASS_NAME}
          flex={'none'}
          justify={'flex-end'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DropdownMenu items={dropdownItems} nativeButton={false}>
            <ActionIcon
              color={'var(--ant-color-text-quaternary)'}
              icon={ChevronDownIcon}
              size={'small'}
              style={{ flex: 'none' }}
            />
          </DropdownMenu>
        </Flexbox>
      )}
    </Block>
  );

  // Wrap in Tooltip when the viewer/member lacks `create_content`. The
  // dropdown is hidden in the disabled state (it'd let users bypass the
  // gate); the main click target is intercepted in `handleClick`.
  return canCreate ? content : <Tooltip title={reason}>{content}</Tooltip>;
});

export default CreateAgentButton;
