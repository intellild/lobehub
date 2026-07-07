'use client';

import { Icon } from '@lobehub/ui';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { memo, type MouseEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';
import { useWaveform } from './useWaveform';

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface AudioPlayerProps {
  alt?: string;
  url: string;
}

const AudioPlayer = memo<AudioPlayerProps>(({ url, alt }) => {
  const { t } = useTranslation('chat');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Only fetch/decode the waveform once the user actually engages with the clip, so a conversation
  // full of audio attachments doesn't download every file just to draw decorative bars.
  const [waveformEnabled, setWaveformEnabled] = useState(false);

  const peaks = useWaveform(url, waveformEnabled);
  const progress = duration > 0 ? currentTime / duration : 0;

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setWaveformEnabled(true);
    if (audio.paused) void audio.play();
    else audio.pause();
  }, []);

  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      setWaveformEnabled(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    },
    [duration],
  );

  return (
    <div className={styles.container}>
      <audio
        preload={'metadata'}
        ref={audioRef}
        src={url}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <button
        aria-label={isPlaying ? t('audioPlayer.pause') : t('audioPlayer.play')}
        aria-pressed={isPlaying}
        className={styles.button}
        title={alt}
        type={'button'}
        onClick={togglePlay}
      >
        <Icon icon={isPlaying ? PauseIcon : PlayIcon} size={16} />
      </button>
      <div className={styles.waveform} onClick={handleSeek}>
        {peaks.map((peak, i) => {
          const played = peaks.length > 0 && i / peaks.length <= progress;
          return (
            <div
              className={played ? `${styles.bar} ${styles.barPlayed}` : styles.bar}
              key={i}
              style={{ height: `${Math.round(peak * 100)}%` }}
            />
          );
        })}
      </div>
      <span className={styles.time}>{formatTime(currentTime || duration)}</span>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
