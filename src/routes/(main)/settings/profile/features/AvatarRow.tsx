'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Icon } from '@lobehub/ui';
import { Spin, Upload } from 'antd';
import { PencilIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchErrorNotification } from '@/components/Error/fetchErrorNotification';
import UserAvatar from '@/features/User/UserAvatar';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';
import { imageToBase64 } from '@/utils/imageToBase64';
import { createUploadImageHandler } from '@/utils/uploadFIle';

import styles from './AvatarRow.module.css';
import ProfileRow from './ProfileRow';

const AvatarRow = () => {
  const { t } = useTranslation('auth');
  const isLogin = useUserStore(authSelectors.isLogin);
  const updateAvatar = useUserStore((s) => s.updateAvatar);
  const [uploading, setUploading] = useState(false);

  const handleUploadAvatar = useMemo(
    () =>
      createUploadImageHandler(async (avatar) => {
        try {
          setUploading(true);
          const img = new Image();
          img.src = avatar;

          await new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', reject);
          });

          const webpBase64 = imageToBase64({ img, size: 256 });
          await updateAvatar(webpBase64);
          setUploading(false);
        } catch (error) {
          console.error('Failed to upload avatar:', error);
          setUploading(false);

          fetchErrorNotification.error({
            errorMessage: error instanceof Error ? error.message : String(error),
            status: 500,
          });
        }
      }),
    [updateAvatar],
  );

  const canUpload = isLogin;

  const avatarContent = canUpload ? (
    <Upload beforeUpload={handleUploadAvatar} itemRender={() => void 0} maxCount={1}>
      <Spin indicator={<LoadingOutlined spin />} spinning={uploading}>
        <div className={styles.wrapper}>
          <UserAvatar size={40} />
          <div className={`${styles.overlay} avatar-edit-overlay`}>
            <Icon color={'var(--ant-color-text-light-solid)'} icon={PencilIcon} size={16} />
          </div>
        </div>
      </Spin>
    </Upload>
  ) : (
    <UserAvatar size={40} />
  );

  return <ProfileRow action={avatarContent} label={t('profile.avatar')} />;
};

export default AvatarRow;
