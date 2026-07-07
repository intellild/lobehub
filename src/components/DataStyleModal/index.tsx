import { Flexbox, Icon } from '@lobehub/ui';
import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

import ImperativeModal from '@/components/ImperativeModal';
import { useIsDark } from '@/hooks/useIsDark';

import stylesModule from './index.module.css';

const prefixCls = 'ant';
const styles = stylesModule;

interface DataStyleModalProps {
  children: ReactNode;
  height?: number | string;
  icon: LucideIcon;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  title: string;
  width?: number;
}

const DataStyleModal = memo<DataStyleModalProps>(
  ({ icon, onOpenChange, title, open, children, width = 550, height }) => {
    const isDarkMode = useIsDark();

    return (
      <ImperativeModal
        centered
        afterOpenChange={onOpenChange}
        closable={false}
        footer={null}
        height={height}
        open={open}
        width={width}
        classNames={{
          header: isDarkMode ? styles.modalTitleDark : styles.modalTitleLight,
        }}
        title={
          <Flexbox horizontal gap={8}>
            <Icon icon={icon} />
            {title}
          </Flexbox>
        }
      >
        {children}
      </ImperativeModal>
    );
  },
);

export default DataStyleModal;
