import { type ChatMessageError, type ChatPluginPayload } from '@lobechat/types';
import { Alert, Flexbox, Highlighter } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { getRuntimeErrorMessage } from '@/utils/locale/runtimeErrorMessage';

import styles from './ErrorResponse.module.css';
import PluginSettings from './PluginSettings';

interface ErrorResponseProps extends ChatMessageError {
  id: string;
  plugin?: ChatPluginPayload;
}

const ErrorResponse = memo<ErrorResponseProps>(({ id, type, body, message, plugin }) => {
  const { t } = useTranslation(['error', 'modelRuntime']);
  if (type === 'PluginSettingsInvalid') {
    return <PluginSettings id={id} plugin={plugin} />;
  }

  return (
    <Alert
      showIcon
      title={getRuntimeErrorMessage(t, type)}
      type={'secondary'}
      extra={
        <Flexbox className={styles.errorResponseExtra}>
          <Highlighter actionIconSize={'small'} language={'json'} variant={'borderless'}>
            {JSON.stringify(body || { message, type }, null, 2)}
          </Highlighter>
        </Flexbox>
      }
    />
  );
});
export default ErrorResponse;
