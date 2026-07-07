'use client';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import styles from './CollapsibleContent.module.css';

const DEFAULT_MAX_HEIGHT = 280;
const VIEWPORT_RATIO = 0.35;
// Only collapse when the overflow is meaningful; avoids hiding a button for a
// handful of extra pixels.
const OVERFLOW_THRESHOLD = 32;

const computeThreshold = () => {
  if (typeof window === 'undefined') return DEFAULT_MAX_HEIGHT;
  return Math.min(DEFAULT_MAX_HEIGHT, Math.round(window.innerHeight * VIEWPORT_RATIO));
};

interface CollapsibleContentProps {
  children: ReactNode;
}

/**
 * Collapses long user message content to a bounded max-height with a gradient
 * mask and a toggle button. Prevents very long user messages from pushing the
 * AI response out of the viewport after auto-scroll pins the user message
 * to the top.
 */
const CollapsibleContent = memo<CollapsibleContentProps>(({ children }) => {
  const { t } = useTranslation('chat');
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [maxHeight, setMaxHeight] = useState(() => computeThreshold());
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [collapsed, setCollapsed] = useState(true);

  // Measure content's natural (unconstrained) height. We read scrollHeight so
  // the value is unaffected by our own max-height clamp.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      setNaturalHeight(el.scrollHeight);
    };
    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setMaxHeight(computeThreshold());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldCollapse = naturalHeight > maxHeight + OVERFLOW_THRESHOLD;
  const isCollapsed = shouldCollapse && collapsed;

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={isCollapsed ? styles.contentCollapsed : styles.contentExpanded}
        ref={contentRef}
        style={isCollapsed ? { maxHeight } : undefined}
      >
        {children}
      </div>
      {shouldCollapse && (
        <div className={styles.toggleWrapper}>
          <button className={styles.toggleButton} type="button" onClick={handleToggle}>
            {collapsed ? <ChevronDownIcon size={14} /> : <ChevronUpIcon size={14} />}
            {collapsed ? t('messageLongCollapse.expand') : t('messageLongCollapse.collapse')}
          </button>
        </div>
      )}
    </div>
  );
});

CollapsibleContent.displayName = 'CollapsibleContent';

export default CollapsibleContent;
