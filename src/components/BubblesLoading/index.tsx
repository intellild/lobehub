import { Center } from '@lobehub/ui';
import { LoadingDots } from '@lobehub/ui/chat';
import { memo } from 'react';

const BubblesLoading = memo(() => {
  return (
    <Center style={{ height: 24, width: 32 }}>
      <LoadingDots color={'var(--ant-color-text-secondary)'} size={12} variant={'pulse'} />
    </Center>
  );
});

export default BubblesLoading;
