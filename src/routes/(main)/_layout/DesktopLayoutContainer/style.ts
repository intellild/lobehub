import { isDesktop } from '@/const/version';

import stylesModule from './style.module.css';

export const styles: typeof stylesModule & { outerContainer: string } = {
  ...stylesModule,
  outerContainer: [
    stylesModule.outerContainer,
    isDesktop ? stylesModule.outerContainerDesktop : stylesModule.outerContainerWeb,
  ].join(' '),
};
