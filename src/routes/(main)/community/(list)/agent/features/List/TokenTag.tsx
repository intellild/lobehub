import { MCP } from '@lobehub/icons';
import { Flexbox, Icon, Tag, Tooltip } from '@lobehub/ui';
import { BookTextIcon, CoinsIcon, GitForkIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatIntergerNumber } from '@/utils/format';

import styles from './TokenTag.module.css';

interface TokenTagProps {
  forkCount?: number;
  knowledgeCount?: number;
  placement?: 'top' | 'right';
  pluginCount?: number;
  tokenUsage: number;
}

const TokenTag = memo<TokenTagProps>(
  ({ tokenUsage, pluginCount, knowledgeCount, forkCount, placement = 'right' }) => {
    const { t } = useTranslation('discover');
    return (
      <Flexbox horizontal align={'center'} gap={4}>
        <Tooltip
          placement={placement}
          styles={{ root: { pointerEvents: 'none' } }}
          title={t('assistants.tokenUsage')}
        >
          <Tag className={styles.token} icon={<Icon icon={CoinsIcon} />}>
            {formatIntergerNumber(tokenUsage)}
          </Tag>
        </Tooltip>
        {Boolean(forkCount && forkCount > 0) && (
          <Tooltip
            placement={placement}
            styles={{ root: { pointerEvents: 'none' } }}
            title={t('fork.forksCount', { count: forkCount })}
          >
            <Tag className={styles.token} icon={<Icon icon={GitForkIcon} />}>
              {formatIntergerNumber(forkCount)}
            </Tag>
          </Tooltip>
        )}
        {Boolean(pluginCount && pluginCount > 0) && (
          <Tooltip
            placement={placement}
            styles={{ root: { pointerEvents: 'none' } }}
            title={t('assistants.withPlugin')}
          >
            <Tag icon={<Icon fill={'var(--ant-color-text-secondary)'} icon={MCP} />}>{pluginCount}</Tag>
          </Tooltip>
        )}
        {Boolean(knowledgeCount && knowledgeCount > 0) && (
          <Tooltip
            placement={placement}
            styles={{ root: { pointerEvents: 'none' } }}
            title={t('assistants.withKnowledge')}
          >
            <Tag icon={<Icon icon={BookTextIcon} />}>{knowledgeCount}</Tag>
          </Tooltip>
        )}
      </Flexbox>
    );
  },
);

export default TokenTag;
