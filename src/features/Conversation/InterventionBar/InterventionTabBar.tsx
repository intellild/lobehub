
import { memo } from 'react';

import { type PendingIntervention } from '../store/slices/data/pendingInterventions';
import { styles } from './style';

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

interface InterventionTabBarProps {
  activeIndex: number;
  interventions: PendingIntervention[];
  onTabChange: (index: number) => void;
}

const InterventionTabBar = memo<InterventionTabBarProps>(
  ({ interventions, activeIndex, onTabChange }) => {
    return (
      <div className={styles.tabBar}>
        {interventions.map((item, index) => (
          <div
            className={cx(styles.tab, index === activeIndex && styles.tabActive)}
            key={item.toolCallId}
            onClick={() => onTabChange(index)}
          >
            🔧 {item.apiName}
          </div>
        ))}
        <div className={styles.tabCounter}>
          {activeIndex + 1} / {interventions.length}
        </div>
      </div>
    );
  },
);

export default InterventionTabBar;
