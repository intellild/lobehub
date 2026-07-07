import { ActionIcon, Block } from '@lobehub/ui';
import { MaximizeIcon, MinimizeIcon } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

import Loading from '@/components/Loading/BrandTextLoading';
import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { type QueryTagsResult } from '@/database/models/userMemory';
import dynamic from '@/libs/next/dynamic';

import styles from './index.module.css';

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

const TagCloudCanvas = dynamic(() => import('./TagCloudCanvas'), {
  loading: () => <Loading debugId={'TagCloud'} />,
  ssr: false,
});

interface RoleTagCloudProps {
  tags: QueryTagsResult[];
}

const RoleTagCloud = memo<RoleTagCloudProps>(({ tags }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenAnimation, setFullscreenAnimation] = useState(false);

  useEffect(() => {
    setFullscreenAnimation(true);
    setTimeout(() => {
      setFullscreenAnimation(false);
    }, 500);
  }, [fullscreen]);

  if (!tags.length) return null;
  return (
    <Block
      variant={fullscreen ? 'borderless' : 'outlined'}
      className={cx(
        styles.root,
        fullscreen && styles.fullscreen,
        fullscreenAnimation && styles.fullscreenAnimation,
      )}
    >
      <ActionIcon
        className={cx('fullscreen-icon', styles.icon)}
        icon={fullscreen ? MinimizeIcon : MaximizeIcon}
        size={DESKTOP_HEADER_ICON_SIZE}
        onClick={() => {
          setFullscreen(!fullscreen);
        }}
      />
      <TagCloudCanvas tags={tags} />
    </Block>
  );
});

export default RoleTagCloud;
