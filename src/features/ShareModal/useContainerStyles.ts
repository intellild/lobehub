import { lobeStaticStylish } from '@lobehub/ui';

import stylesModule from './useContainerStyles.module.css';

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
export const styles: typeof stylesModule & { preview: string } = {
  ...stylesModule,
  preview: [stylesModule.preview, lobeStaticStylish.noScrollbar].join(' '),
};
