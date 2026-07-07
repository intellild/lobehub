'use client';

import { type CredType } from '@lobechat/types';
import { Flexbox } from '@lobehub/ui';
import { Card } from 'antd';
import { File, Globe, Key, TerminalSquare } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './CredTypeSelector.module.css';

interface CredTypeSelectorProps {
  disabled?: boolean;
  onSelect: (type: CredType) => void;
}

const typeConfigs: Array<{
  description: string;
  icon: React.ReactNode;
  type: CredType;
}> = [
  {
    description: 'creds.typeDesc.kv-env',
    icon: <TerminalSquare size={24} />,
    type: 'kv-env',
  },
  {
    description: 'creds.typeDesc.kv-header',
    icon: <Globe size={24} />,
    type: 'kv-header',
  },
  {
    description: 'creds.typeDesc.oauth',
    icon: <Key size={24} />,
    type: 'oauth',
  },
  {
    description: 'creds.typeDesc.file',
    icon: <File size={24} />,
    type: 'file',
  },
];

const CredTypeSelector: FC<CredTypeSelectorProps> = ({ disabled, onSelect }) => {
  const { t } = useTranslation('setting');

  return (
    <div className={styles.grid}>
      {typeConfigs.map(({ type, icon, description }) => (
        <Card
          className={`${styles.card} ${disabled ? styles.cardDisabled : ''}`}
          key={type}
          size="small"
          onClick={() => {
            if (disabled) return;
            onSelect(type);
          }}
        >
          <Flexbox align="center">
            <div className={styles.icon}>{icon}</div>
            <div className={styles.title}>{t(`creds.types.${type}`)}</div>
            <div className={styles.description}>{t(description as any)}</div>
          </Flexbox>
        </Card>
      ))}
    </div>
  );
};

export default CredTypeSelector;
