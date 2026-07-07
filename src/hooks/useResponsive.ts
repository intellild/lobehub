import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
  const xs = useMediaQuery({ maxWidth: 479.98 });
  const sm = useMediaQuery({ maxWidth: 575.98 });
  const md = useMediaQuery({ maxWidth: 767.98 });
  const lg = useMediaQuery({ maxWidth: 991.98 });
  const xl = useMediaQuery({ maxWidth: 1199.98 });
  const xxl = useMediaQuery({ minWidth: 1200 });

  return {
    desktop: xxl,
    laptop: lg,
    lg,
    md,
    mobile: xs,
    sm,
    tablet: md,
    xl,
    xs,
    xxl,
  };
};
