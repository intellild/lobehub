import { Center, Flexbox, Icon } from '@lobehub/ui';
import { type LucideIcon } from 'lucide-react';
import { memo } from 'react';

import { useIsDark } from '@/hooks/useIsDark';

import styles from './index.module.css';

export interface FeatureItem {
  avatar: LucideIcon;
  desc: string;
  title: string;
}
interface FeatureListProps {
  data: FeatureItem[];
}

const FeatureList = memo<FeatureListProps>(({ data }) => {
  const isDarkMode = useIsDark();

  return (
    <Flexbox gap={32}>
      {data.map((item) => {
        return (
          <Flexbox horizontal align={'flex-start'} gap={24} key={item.title}>
            <Center className={isDarkMode ? styles.iconCtnDark : styles.iconCtnLight}>
              <Icon
                className={isDarkMode ? styles.iconDark : styles.iconLight}
                icon={item.avatar}
                size={36}
              />
            </Center>
            <Flexbox gap={8}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.desc}>{item.desc}</p>
            </Flexbox>
          </Flexbox>
        );
      })}
    </Flexbox>
  );
});

export default FeatureList;
