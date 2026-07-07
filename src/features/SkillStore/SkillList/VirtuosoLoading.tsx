import { Center, Icon } from '@lobehub/ui';
import { Loader2Icon } from 'lucide-react';
import { memo } from 'react';

const VirtuosoLoading = memo(() => {
  return (
    <Center padding={16}>
      <Icon spin color={'var(--ant-color-text-description)'} icon={Loader2Icon} />
    </Center>
  );
});

export default VirtuosoLoading;
