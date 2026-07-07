import { Center, Flexbox, Icon, Text } from '@lobehub/ui';
import { CheckIcon, RouterIcon, TerminalIcon } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { isDesktop } from '@/const/version';

import styles from './MCPTypeSelect.module.css';

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

// Helper component for feature list items (moved from MCPManifestForm)
const FeatureItem = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.featureItem}>
      <Center className={styles.featureIcon}>
        <CheckIcon color={'var(--ant-color-success)'} size={16} />
      </Center>
      <div className={styles.featureText}>{children}</div>
    </div>
  );
});

interface MCPTypeSelectProps {
  onChange?: (value: string) => void;
  value?: string;
}

const MCPTypeSelect = ({ value, onChange }: MCPTypeSelectProps) => {
  const { t } = useTranslation('plugin');

  const handleSelect = (type: string) => {
    onChange?.(type);
  };

  const data = [
    {
      description: t('dev.mcp.type.httpShortDesc'),
      features: [t('dev.mcp.type.httpFeature1'), t('dev.mcp.type.httpFeature2')],
      icon: RouterIcon,
      label: 'Streamable HTTP',
      value: 'http',
    },
    {
      description: t('dev.mcp.type.stdioShortDesc'),
      features: [t('dev.mcp.type.stdioFeature1'), t('dev.mcp.type.stdioFeature2')],
      icon: TerminalIcon,
      label: 'STDIO',
      value: 'stdio',
    },
  ];

  return (
    <Flexbox horizontal gap={16} width={'100%'}>
      {data.map(({ label, description, features, value: itemValue, icon }) => {
        const isActive = value === itemValue;
        const disabled = itemValue === 'stdio' && !isDesktop;
        return (
          <Flexbox
            className={cx(styles.container, isActive && styles.active, disabled && styles.disabled)}
            gap={12}
            key={itemValue}
            style={{ flex: 1 }} // Make cards take equal width
            onClick={disabled ? undefined : () => handleSelect(itemValue)}
          >
            <Center className={styles.checkIcon} style={{ opacity: isActive ? 1 : 0 }}>
              <CheckIcon size={14} />
            </Center>

            <Flexbox horizontal align={'flex-start'} gap={12}>
              <Center height={22}>
                <Icon icon={icon} style={{ fontSize: 16 }} />
              </Center>
              <Flexbox>
                <div className={styles.cardTitle}>{label}</div>
                <div className={styles.cardDescription}>{description}</div>
              </Flexbox>
            </Flexbox>
            <Flexbox gap={8}>
              {features.map((feature) => (
                <FeatureItem key={feature}>{feature}</FeatureItem>
              ))}
            </Flexbox>
            {disabled && (
              <Text style={{ fontSize: 12, marginTop: 8 }} type="warning">
                {t('dev.mcp.type.stdioNotAvailable')}
              </Text>
            )}
          </Flexbox>
        );
      })}
      {/* Streamable HTTP Card */}
    </Flexbox>
  );
};

export default MCPTypeSelect;
