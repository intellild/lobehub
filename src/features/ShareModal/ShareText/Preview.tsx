import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import { containerStyles } from '../style';

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

const Preview = memo<{ content: string }>(({ content }) => {
  return (
    <div
      className={cx(containerStyles.preview, containerStyles.previewWide)}
      style={{ padding: 12 }}
    >
      <Markdown variant={'chat'}>{content}</Markdown>
    </div>
  );
});

export default Preview;
