import { Flexbox, Icon } from '@lobehub/ui';
import { CheckIcon } from 'lucide-react';

const renderCheck = () => <Icon color={'var(--ant-color-text-secondary)'} icon={CheckIcon} size={14} />;

export const renderMenuExtra = (shortcut: string, isCurrent: boolean) =>
  isCurrent ? (
    <Flexbox horizontal align={'center'} gap={6}>
      {renderCheck()}
      {shortcut}
    </Flexbox>
  ) : (
    shortcut
  );
