
import { useMemo } from 'react';

import { useResponsive } from './useResponsive';

export const useIsMobile = (): boolean => {
  const { mobile } = useResponsive();

  return useMemo(() => !!mobile, [mobile]);
};
