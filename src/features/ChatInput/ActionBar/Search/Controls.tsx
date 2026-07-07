import { Center, Flexbox, Icon } from '@lobehub/ui';
import { GlobeOffIcon } from '@lobehub/ui/icons';
import { Divider } from 'antd';
import { type LucideIcon } from 'lucide-react';
import { SparkleIcon } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { usePermission } from '@/hooks/usePermission';
import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors, chatConfigByIdSelectors } from '@/store/agent/selectors';
import { aiModelSelectors, aiProviderSelectors, useAiInfraStore } from '@/store/aiInfra';
import { type SearchMode } from '@/types/search';

import { useAgentId } from '../../hooks/useAgentId';
import { useUpdateAgentConfig } from '../../hooks/useUpdateAgentConfig';
import styles from './Controls.module.css';
import FCSearchModel from './FCSearchModel';
import ModelBuiltinSearch from './ModelBuiltinSearch';

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

interface NetworkOption {
  description: string;
  disable?: boolean;
  icon: LucideIcon;
  label: string;
  value: SearchMode;
}

const Item = memo<NetworkOption>(({ value, description, icon, label }) => {
  const agentId = useAgentId();
  const { updateAgentChatConfig } = useUpdateAgentConfig();
  const mode = useAgentStore((s) => chatConfigByIdSelectors.getSearchModeById(agentId)(s));
  const { allowed: canCreate } = usePermission('create_content');

  return (
    <Flexbox
      horizontal
      align={'flex-start'}
      className={cx(styles.option, mode === value && styles.active)}
      gap={12}
      key={value}
      style={{
        cursor: canCreate ? undefined : 'not-allowed',
        opacity: canCreate ? undefined : 0.5,
      }}
      onClick={async () => {
        if (!canCreate) return;
        await updateAgentChatConfig({ searchMode: value });
      }}
    >
      <Center className={styles.icon} flex={'none'} height={32} width={32}>
        <Icon icon={icon} />
      </Center>
      <Flexbox flex={1}>
        <div className={styles.title}>{label}</div>
        <div className={styles.description}>{description}</div>
      </Flexbox>
    </Flexbox>
  );
});

const Controls = memo(() => {
  const { t } = useTranslation('chat');
  const agentId = useAgentId();
  const { updateAgentChatConfig } = useUpdateAgentConfig();
  const { allowed: canCreate } = usePermission('create_content');

  const [model, provider, useModelBuiltinSearch, searchMode] = useAgentStore((s) => [
    agentByIdSelectors.getAgentModelById(agentId)(s),
    agentByIdSelectors.getAgentModelProviderById(agentId)(s),
    chatConfigByIdSelectors.getUseModelBuiltinSearchById(agentId)(s),
    chatConfigByIdSelectors.getChatConfigById(agentId)(s).searchMode,
  ]);

  const supportFC = useAiInfraStore(aiModelSelectors.isModelSupportToolUse(model, provider));
  const isProviderHasBuiltinSearchConfig = useAiInfraStore(
    aiProviderSelectors.isProviderHasBuiltinSearchConfig(provider),
  );
  const isModelHasBuiltinSearchConfig = useAiInfraStore(
    aiModelSelectors.isModelHasBuiltinSearchConfig(model, provider),
  );
  const isModelBuiltinSearchInternal = useAiInfraStore(
    aiModelSelectors.isModelBuiltinSearchInternal(model, provider),
  );
  const modelBuiltinSearchImpl = useAiInfraStore(
    aiModelSelectors.modelBuiltinSearchImpl(model, provider),
  );

  useEffect(() => {
    if (!canCreate) return;
    if (isModelBuiltinSearchInternal && (searchMode ?? 'auto') === 'off') {
      updateAgentChatConfig({ searchMode: 'auto' });
    }
  }, [canCreate, isModelBuiltinSearchInternal, searchMode, updateAgentChatConfig]);

  const options: NetworkOption[] = isModelBuiltinSearchInternal
    ? [
        {
          description: t('search.mode.auto.desc'),
          icon: SparkleIcon,
          label: t('search.mode.auto.title'),
          value: 'auto',
        },
      ]
    : [
        {
          description: t('search.mode.off.desc'),
          icon: GlobeOffIcon,
          label: t('search.mode.off.title'),
          value: 'off',
        },
        {
          description: t('search.mode.auto.desc'),
          icon: SparkleIcon,
          label: t('search.mode.auto.title'),
          value: 'auto',
        },
      ];

  const showModelBuiltinSearch =
    searchMode !== 'off' &&
    !isModelBuiltinSearchInternal &&
    (isModelHasBuiltinSearchConfig || isProviderHasBuiltinSearchConfig);

  const showFCSearchModel =
    !supportFC &&
    (!modelBuiltinSearchImpl || (!isModelBuiltinSearchInternal && !useModelBuiltinSearch));

  const showDivider = showModelBuiltinSearch || showFCSearchModel;

  return (
    <Flexbox gap={4}>
      {options.map((option) => (
        <Item {...option} key={option.value} />
      ))}
      {showDivider && <Divider style={{ margin: 0 }} />}
      {showModelBuiltinSearch && <ModelBuiltinSearch disabled={!canCreate} />}
      {showFCSearchModel && <FCSearchModel disabled={!canCreate} />}
    </Flexbox>
  );
});

export default Controls;
