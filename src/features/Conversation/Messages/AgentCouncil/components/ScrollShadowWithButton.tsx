import { type FlexboxProps } from '@lobehub/ui';
import { Button, Flexbox, ScrollShadow } from '@lobehub/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import styles from './ScrollShadowWithButton.module.css';

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

const ScrollShadowWithButton = memo<FlexboxProps>(({ children, ...rest }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const handleScroll = useCallback(
    (direction: 'left' | 'right') => {
      const container = scrollRef.current;
      if (!container) return;

      const scrollAmount = container.clientWidth / 1.5;
      const targetScroll =
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        behavior: 'smooth',
        left: targetScroll,
      });

      setTimeout(checkScrollability, 300);
    },
    [checkScrollability],
  );

  useEffect(() => {
    checkScrollability();
  }, []);

  return (
    <Flexbox horizontal className={styles.container} width={'100%'} {...rest}>
      {canScrollLeft && (
        <Button
          className={cx(styles.button, styles.leftButton, 'scroll-button')}
          icon={ChevronLeft}
          shape={'circle'}
          type={'default'}
          onClick={() => handleScroll('left')}
        />
      )}
      <ScrollShadow
        hideScrollBar
        offset={16}
        orientation={'horizontal'}
        ref={scrollRef}
        size={16}
        onScroll={checkScrollability}
        onScrollCapture={checkScrollability}
      >
        {children}
      </ScrollShadow>
      {canScrollRight && (
        <Button
          className={cx(styles.button, styles.rightButton, 'scroll-button')}
          icon={ChevronRight}
          shape={'circle'}
          type={'default'}
          onClick={() => handleScroll('right')}
        />
      )}
    </Flexbox>
  );
});

export default ScrollShadowWithButton;
