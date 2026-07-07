import { isMacOSWithLargeWindowBorders } from '@/utils/platform';

import stylesModule from './style.module.css';

const borderRadiusClass = isMacOSWithLargeWindowBorders()
  ? stylesModule.largeWindowBorderRadius
  : stylesModule.defaultBorderRadius;

export const styles: typeof stylesModule & {
  innerContainerDark: string;
  innerContainerLight: string;
} = {
  ...stylesModule,
  innerContainerDark: [stylesModule.innerContainerDark, borderRadiusClass].join(' '),
  innerContainerLight: [stylesModule.innerContainerLight, borderRadiusClass].join(' '),
};
