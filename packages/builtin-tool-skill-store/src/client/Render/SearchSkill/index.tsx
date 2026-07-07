'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Flexbox, Tag, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { MarketSkillItem, SearchSkillParams, SearchSkillState } from '../../../types';
import styles from './index.module.css';

interface SkillItemProps {
  skill: MarketSkillItem;
}

const SkillItem = memo<SkillItemProps>(({ skill }) => {
  const { t } = useTranslation('plugin');

  return (
    <Flexbox className={styles.item} gap={6}>
      <Flexbox gap={2}>
        <div className={styles.title}>{skill.name}</div>
        <div className={styles.identifier}>{skill.identifier}</div>
      </Flexbox>
      {(skill.description || skill.summary) && (
        <div className={styles.description}>{skill.summary || skill.description}</div>
      )}
      <Flexbox horizontal gap={6} wrap={'wrap'}>
        {skill.version && (
          <Tag
            size={'small'}
          >{`${t('builtins.lobe-skill-store.render.version')}: ${skill.version}`}</Tag>
        )}
        <Tag
          size={'small'}
        >{`${t('builtins.lobe-skill-store.render.installs')}: ${skill.installCount}`}</Tag>
        {skill.category && <Tag size={'small'}>{skill.category}</Tag>}
      </Flexbox>
      {skill.repository && (
        <Text ellipsis className={styles.meta}>
          {`${t('builtins.lobe-skill-store.render.repository')}: ${skill.repository}`}
        </Text>
      )}
    </Flexbox>
  );
});

SkillItem.displayName = 'SkillItem';

const SearchSkill = memo<BuiltinRenderProps<SearchSkillParams, SearchSkillState>>(
  ({ pluginState }) => {
    const { t } = useTranslation('plugin');

    const items = pluginState?.items || [];

    if (items.length === 0) {
      return (
        <div className={styles.container}>
          <div className={styles.empty}>{t('builtins.lobe-skill-store.inspector.noResults')}</div>
        </div>
      );
    }

    return (
      <Flexbox className={styles.container}>
        {items.map((skill) => (
          <SkillItem key={skill.identifier} skill={skill} />
        ))}
      </Flexbox>
    );
  },
);

SearchSkill.displayName = 'SearchSkill';

export default SearchSkill;
