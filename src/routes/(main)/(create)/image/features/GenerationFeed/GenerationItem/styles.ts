
import stylesModule from './styles.module.css';

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
export const styles: typeof stylesModule & { generationActionButton: string } = {
  ...stylesModule,
  generationActionButton: [stylesModule.generationActionButton, 'generation-actions'].join(' '),
};
