import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import InfoTooltip from '@/components/InfoTooltip';
import { useAgentStore } from '@/store/agent';
import { chatConfigByIdSelectors } from '@/store/agent/selectors';

import { useAgentId } from '../../hooks/useAgentId';
import { useUpdateAgentConfig } from '../../hooks/useUpdateAgentConfig';
import styles from './FCSearchModel.module.css';
import FunctionCallingModelSelect from './FunctionCallingModelSelect';

interface FCSearchModelProps {
  disabled?: boolean;
}

const FCSearchModel = memo<FCSearchModelProps>(({ disabled }) => {
  const { t } = useTranslation('chat');
  const agentId = useAgentId();
  const { updateAgentChatConfig } = useUpdateAgentConfig();
  const searchFCModel = useAgentStore((s) =>
    chatConfigByIdSelectors.getSearchFCModelById(agentId)(s),
  );
  return (
    <Flexbox horizontal distribution={'space-between'} gap={16} padding={8}>
      <Flexbox horizontal align={'center'} gap={4}>
        <Flexbox className={styles.title}>{t('search.searchModel.title')}</Flexbox>
        <InfoTooltip title={t('search.searchModel.desc')} />
      </Flexbox>
      <FunctionCallingModelSelect
        disabled={disabled}
        value={searchFCModel}
        style={{
          maxWidth: 160,
          width: 160,
        }}
        onChange={async (value) => {
          if (disabled) return;
          await updateAgentChatConfig({ searchFCModel: value });
        }}
      />
    </Flexbox>
  );
});

export default FCSearchModel;
