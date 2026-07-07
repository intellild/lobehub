import { Flexbox, Hotkey } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { HOTKEYS_REGISTRATION } from '@/const/hotkeys';
import hotkeyMeta from '@/locales/default/hotkey';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/slices/settings/selectors';
import { type HotkeyGroupId } from '@/types/hotkey';

import styles from './HotkeyContent.module.css';

interface HotkeyContentProps {
  groupId: HotkeyGroupId;
}

const HotkeyContent = memo<HotkeyContentProps>(({ groupId }) => {
  const settings = useUserStore(settingsSelectors.currentSettings, isEqual);
  const { t } = useTranslation('hotkey');
  return (
    <>
      {HOTKEYS_REGISTRATION.filter((item) => item.group === groupId).map((item) => (
        <Flexbox horizontal align={'flex-start'} gap={16} key={item.id} width={'100%'}>
          <Flexbox flex={1} gap={4} justify={'space-between'}>
            <span>{t(`${item.id}.title`)}</span>
            {hotkeyMeta[`${item.id}.desc`] ? (
              <span className={styles.desc}>{t(`${item.id}.desc`)}</span>
            ) : null}
          </Flexbox>
          <Hotkey
            className={styles.hotkey}
            keys={settings.hotkey[item.id]}
            style={{
              zoom: 1.1,
            }}
          />
        </Flexbox>
      ))}
    </>
  );
});

export default HotkeyContent;
