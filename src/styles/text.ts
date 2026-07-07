import inspectorTextStyles from './text.module.css';

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

export const lineEllipsis = (line: number) =>
  line === 1
    ? inspectorTextStyles.lineEllipsis1
    : line === 2
      ? inspectorTextStyles.lineEllipsis2
      : inspectorTextStyles.lineEllipsis;

export const oneLineEllipsis = lineEllipsis(1);
export { inspectorTextStyles };

/**
 * Highlight underline effect using gradient background
 * - primary: default blue highlight
 * - info: info blue highlight
 * - warning: warning yellow highlight
 * - gold: gold highlight (for page-agent etc.)
 */
export const highlightTextStyles = inspectorTextStyles;
