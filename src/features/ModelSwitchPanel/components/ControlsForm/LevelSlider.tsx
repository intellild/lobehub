import { Flexbox } from '@lobehub/ui';
import { Slider } from 'antd';
import type { SliderSingleProps } from 'antd/es/slider';
import type { CSSProperties, ReactNode } from 'react';
import { memo, useMemo } from 'react';
import useMergeState from 'use-merge-value';

import styles from './LevelSlider.module.css';

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

export interface LevelSliderProps<T extends string = string> {
  /**
   * Default value when uncontrolled
   */
  defaultValue?: T;
  disabled?: boolean;
  /**
   * Ordered array of level values (left to right on slider)
   */
  levels: readonly T[];
  /**
   * Optional custom marks. If not provided, uses level values as marks.
   */
  marks?: SliderSingleProps['marks'];
  /**
   * Callback when value changes
   */
  onChange?: (value: T) => void;
  /**
   * Style for the slider container
   */
  style?: CSSProperties;
  /**
   * Controlled value
   */
  value?: T;
}

interface LevelOption<T extends string> {
  label: ReactNode;
  style?: CSSProperties;
  value: T;
}

const getMinimumWidth = (levelCount: number, customMinWidth: CSSProperties['minWidth']) => {
  const minimumWidth = levelCount >= 5 ? 260 : levelCount === 4 ? 220 : 180;

  if (customMinWidth === undefined) return minimumWidth;

  return typeof customMinWidth === 'number'
    ? Math.max(customMinWidth, minimumWidth)
    : customMinWidth;
};

const resolveMark = (
  mark: NonNullable<SliderSingleProps['marks']>[number] | undefined,
  fallback: string,
): { label: ReactNode; style?: CSSProperties } => {
  if (!mark) return { label: fallback };

  if (typeof mark === 'object' && 'label' in mark) {
    return {
      label: mark.label ?? fallback,
      style: mark.style,
    };
  }

  return { label: mark as ReactNode };
};

function LevelSlider<T extends string = string>({
  levels,
  value,
  defaultValue,
  onChange,
  marks: customMarks,
  style,
  disabled,
}: LevelSliderProps<T>) {
  const defaultLevel = defaultValue ?? levels[Math.floor(levels.length / 2)];

  const [currentLevel, setCurrentLevel] = useMergeState<T>(defaultLevel, {
    defaultValue,
    onChange,
    value,
  });

  const options = useMemo(
    () =>
      levels.map<LevelOption<T>>((level, index) => ({
        ...resolveMark(customMarks?.[index], level),
        value: level,
      })),
    [customMarks, levels],
  );

  const currentIndex = levels.indexOf(currentLevel);
  const sliderValue = currentIndex === -1 ? Math.floor(levels.length / 2) : currentIndex;
  const { minWidth: customMinWidth, ...restStyle } = style ?? {};

  const handleChange = (index: number) => {
    if (disabled) return;

    const newLevel = levels[index];
    if (newLevel !== undefined) {
      setCurrentLevel(newLevel);
    }
  };

  return (
    <Flexbox
      className={styles.root}
      gap={8}
      style={{
        ...restStyle,
        minWidth: getMinimumWidth(levels.length, customMinWidth),
        width: '100%',
      }}
    >
      <div className={styles.slider}>
        <Slider
          dots
          disabled={disabled}
          max={levels.length - 1}
          min={0}
          step={1}
          tooltip={{ open: false }}
          value={sliderValue}
          onChange={handleChange}
        />
      </div>
      <div
        className={styles.labels}
        style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }}
      >
        {options.map((option, index) => {
          const selected = index === sliderValue;

          return (
            <button
              aria-current={selected ? 'true' : undefined}
              className={cx(styles.label, selected && styles.selectedLabel)}
              disabled={disabled}
              key={option.value}
              style={option.style}
              type="button"
              onClick={() => {
                if (disabled) return;
                setCurrentLevel(option.value);
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </Flexbox>
  );
}

export default memo(LevelSlider) as typeof LevelSlider;
