import { Icon, Tag } from '@lobehub/ui';
import { BadgeCheck, CircleUser, Package } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { type InstallPluginMeta } from '@/types/tool/plugin';

import styles from './PluginTag.module.css';

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

interface PluginTagProps extends Pick<InstallPluginMeta, 'author' | 'type'> {
  showIcon?: boolean;
  showText?: boolean;
}

const PluginTag = memo<PluginTagProps>(({ showIcon = true, author, type, showText = true }) => {
  const { t } = useTranslation('plugin');
  const isCustom = type === 'customPlugin';
  const isOfficial = author === 'LobeHub';

  return (
    <Tag
      className={cx(isCustom ? styles.custom : isOfficial ? styles.official : styles.community)}
      icon={showIcon && <Icon icon={isCustom ? Package : isOfficial ? BadgeCheck : CircleUser} />}
    >
      {showText && (author || t(isCustom ? 'store.customPlugin' : 'store.communityPlugin'))}
    </Tag>
  );
});

export default PluginTag;
