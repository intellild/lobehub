'use client';

import { ActionIcon, Flexbox, Image } from '@lobehub/ui';
import { QuoteIcon } from 'lucide-react';
import { memo } from 'react';

import styles from './VideoReferenceFrames.module.css';

interface VideoReferenceFramesProps {
  endImageUrl?: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
}

const VideoReferenceFrames = memo<VideoReferenceFramesProps>(
  ({ imageUrl, imageUrls, endImageUrl }) => {
    const allImages: string[] = [];
    if (imageUrl) allImages.push(imageUrl);
    if (imageUrls && imageUrls.length > 0) allImages.push(...imageUrls);
    if (endImageUrl) allImages.push(endImageUrl);

    if (allImages.length === 0) return null;

    return (
      <Image.PreviewGroup>
        <Flexbox horizontal align={'flex-end'} flex={'none'} wrap="wrap">
          <ActionIcon
            glass
            className={styles.icon}
            icon={QuoteIcon}
            size={'small'}
            variant={'filled'}
          />
          {allImages.map((url, index) => (
            <div className={styles.container} key={`${url}-${index}`}>
              <Image
                alt={index === 0 ? 'Start frame' : 'End frame'}
                className={styles.image}
                height={'100%'}
                src={url}
                style={{ height: '100%', width: '100%' }}
                variant={'outlined'}
                width={'100%'}
              />
            </div>
          ))}
        </Flexbox>
      </Image.PreviewGroup>
    );
  },
);

VideoReferenceFrames.displayName = 'VideoReferenceFrames';

export default VideoReferenceFrames;
