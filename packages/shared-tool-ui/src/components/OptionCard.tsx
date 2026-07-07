'use client';

import { Flexbox, Icon, Text } from '@lobehub/ui';
import { Check } from 'lucide-react';
import { memo } from 'react';

import styles from './OptionCard.module.css';

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

export interface OptionCardProps {
  description?: string;
  disabled?: boolean;
  index: number;
  label: string;
  onToggle: () => void;
  selected: boolean;
}

/**
 * One numbered option in a question. Filled when picked, neutral otherwise;
 * a right-side checkmark seals the selection so the state reads cleanly even
 * with the number chip kept neutral.
 *
 * Presentational and self-contained — shared across the ask-user surfaces
 * (Claude Code `AskUserQuestion`, the builtin `user-interaction` /
 * `lobe-agent` clarification form) so the tiled options read identically
 * everywhere.
 */
export const OptionCard = memo<OptionCardProps>(
  ({ index, label, description, selected, disabled, onToggle }) => (
    <Flexbox
      horizontal
      align="center"
      aria-selected={selected}
      className={cx(styles.option, selected && styles.optionSelected)}
      gap={12}
      role="option"
      onClick={() => {
        if (!disabled) onToggle();
      }}
    >
      <span className={styles.optionIndex}>{index}</span>
      <Flexbox flex={1} gap={2}>
        <Text className={styles.optionLabel}>{label}</Text>
        {description && <span className={styles.optionDescription}>{description}</span>}
      </Flexbox>
      {selected && <Icon className={styles.optionCheck} icon={Check} size={16} />}
    </Flexbox>
  ),
);

OptionCard.displayName = 'OptionCard';

export default OptionCard;
