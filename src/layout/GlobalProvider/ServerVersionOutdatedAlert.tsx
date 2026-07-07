'use client';

import { Button, Flexbox, Icon } from '@lobehub/ui';
import { TriangleAlert, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MANUAL_UPGRADE_URL } from '@/const/url';
import { CURRENT_VERSION } from '@/const/version';
import { useTheme } from '@/hooks/useTheme';
import { useElectronStore } from '@/store/electron';
import { electronSyncSelectors } from '@/store/electron/selectors';
import { useGlobalStore } from '@/store/global';

import styles from './ServerVersionOutdatedAlert.module.css';

const ServerVersionOutdatedAlert = () => {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const [dismissed, setDismissed] = useState(false);
  const isServerVersionOutdated = useGlobalStore((s) => s.isServerVersionOutdated);
  const storageMode = useElectronStore(electronSyncSelectors.storageMode);

  const cssVariables = useMemo<Record<string, string>>(
    () => ({
      '--content-yellow-border': theme.yellowBorder,
      '--warning-yellow-bg': theme.yellowBg,
    }),
    [theme.yellowBorder, theme.yellowBg],
  );

  // Only show alert when using self-hosted server, not cloud
  if (storageMode !== 'selfHost') return null;
  if (!isServerVersionOutdated || dismissed) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content} style={cssVariables}>
        <div className={styles.closeButton} onClick={() => setDismissed(true)}>
          <Icon icon={X} />
        </div>

        <Flexbox gap={16}>
          <Flexbox horizontal align="center" gap={8}>
            <Icon className={styles.titleIcon} icon={TriangleAlert} />
            <div className={styles.title}>{t('serverVersionOutdated.title')}</div>
          </Flexbox>

          <div className={styles.desc}>
            {t('serverVersionOutdated.desc', { version: CURRENT_VERSION })}
          </div>

          <div className={styles.warning}>{t('serverVersionOutdated.warning')}</div>

          <Flexbox horizontal gap={8} justify="flex-end" style={{ marginTop: 8 }}>
            <a href={MANUAL_UPGRADE_URL} rel="noreferrer" target="_blank">
              <Button size="small" type="primary">
                {t('serverVersionOutdated.upgrade')}
              </Button>
            </a>
            <Button size="small" onClick={() => setDismissed(true)}>
              {t('serverVersionOutdated.dismiss')}
            </Button>
          </Flexbox>
        </Flexbox>
      </div>
    </div>
  );
};

export default ServerVersionOutdatedAlert;
