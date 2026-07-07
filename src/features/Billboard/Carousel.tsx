'use client';

import { useAnalytics } from '@lobehub/analytics/react';
import { ActionIcon, Button, Flexbox, Tooltip } from '@lobehub/ui';
import { Carousel as AntCarousel } from 'antd';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  type ComponentRef,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import type { GlobalBillboard, GlobalBillboardItem } from '@/types/serverConfig';

import styles from './Carousel.module.css';
import { resolveBillboardItem } from './locale';

type BillboardItem = GlobalBillboardItem;

interface BillboardCarouselProps {
  cardAttr?: string;
  closing?: boolean;
  exitTarget?: { x: number; y: number };
  onAnimationFinish?: () => void;
  onClose: () => void;
  set: GlobalBillboard;
}

const ItemContent = memo<{ billboardSlug: string; item: BillboardItem; position: number }>(
  ({ item, billboardSlug, position }) => {
    const { t, i18n } = useTranslation('notification');
    const { analytics } = useAnalytics();
    const resolved = useMemo(
      () => resolveBillboardItem(item, i18n.language),
      [item, i18n.language],
    );

    const handleCtaClick = useCallback(() => {
      analytics?.track({
        name: 'billboard_cta_clicked',
        properties: {
          billboard_slug: billboardSlug,
          item_id: item.id,
          link_url: item.linkUrl,
          position,
          spm: 'billboard.cta.clicked',
        },
      });
    }, [analytics, billboardSlug, item.id, item.linkUrl, position]);

    const titleRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const [titleOverflow, setTitleOverflow] = useState(false);
    const [descOverflow, setDescOverflow] = useState(false);

    useLayoutEffect(() => {
      const el = titleRef.current;
      if (!el) return;
      setTitleOverflow(el.scrollHeight > el.clientHeight + 1);
    }, [resolved.title]);

    useLayoutEffect(() => {
      const el = descRef.current;
      if (!el) return;
      setDescOverflow(el.scrollHeight > el.clientHeight + 1);
    }, [resolved.description]);

    const titleNode = (
      <div className={styles.title} ref={titleRef}>
        {resolved.title}
      </div>
    );

    const descNode = resolved.description && (
      <div className={styles.description} ref={descRef}>
        {resolved.description}
      </div>
    );

    return (
      <Flexbox gap={0}>
        {item.cover && <img alt="" className={styles.image} src={item.cover} />}
        <Flexbox className={styles.itemBody} gap={4}>
          {titleOverflow ? (
            <Tooltip placement="top" title={resolved.title}>
              {titleNode}
            </Tooltip>
          ) : (
            titleNode
          )}
          {descNode &&
            (descOverflow ? (
              <Tooltip placement="top" title={resolved.description}>
                {descNode}
              </Tooltip>
            ) : (
              descNode
            ))}
          {item.linkUrl && (
            <a
              className={styles.action}
              href={item.linkUrl}
              rel="noopener noreferrer"
              target="_blank"
              onClick={handleCtaClick}
            >
              <Button block size="small" type="primary">
                {resolved.linkLabel ?? t('billboard.learnMore')}
              </Button>
            </a>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

ItemContent.displayName = 'BillboardItemContent';

const BILLBOARD_IMPRESSION_STORAGE_PREFIX = 'billboard:impression:';

const BillboardCarousel = memo<BillboardCarouselProps>(
  ({ set, onClose, closing, exitTarget, onAnimationFinish, cardAttr }) => {
    const [paused, setPaused] = useState(false);
    const [current, setCurrent] = useState(0);
    const carouselRef = useRef<ComponentRef<typeof AntCarousel>>(null);
    const { analytics } = useAnalytics();

    useEffect(() => {
      if (!analytics || set.items.length === 0) return;
      const key = `${BILLBOARD_IMPRESSION_STORAGE_PREFIX}${set.slug}`;
      try {
        if (globalThis.sessionStorage?.getItem(key) === '1') return;
        globalThis.sessionStorage?.setItem(key, '1');
      } catch {
        // ignore storage access errors (e.g. private mode) and still report
      }
      void analytics.track({
        name: 'billboard_served',
        properties: {
          billboard_slug: set.slug,
          item_count: set.items.length,
          spm: 'billboard.card.served',
        },
      });
    }, [analytics, set.slug, set.items.length]);

    if (set.items.length === 0) return null;

    const single = set.items.length === 1;

    const cardDataProps = cardAttr ? { [cardAttr]: '' } : {};

    return (
      <motion.div
        {...cardDataProps}
        className={styles.card}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        animate={
          closing
            ? { opacity: 0, scale: 0.15, x: exitTarget?.x ?? 0, y: exitTarget?.y ?? 40 }
            : { opacity: 1, scale: 1, x: 0, y: 0 }
        }
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onAnimationComplete={() => {
          if (closing) onAnimationFinish?.();
        }}
      >
        <ActionIcon className={styles.closeButton} icon={X} size={14} onClick={onClose} />
        {single ? (
          <ItemContent billboardSlug={set.slug} item={set.items[0]} position={0} />
        ) : (
          <>
            <AntCarousel
              adaptiveHeight
              autoplay={!paused}
              autoplaySpeed={6000}
              beforeChange={(_: number, next: number) => setCurrent(next)}
              dots={false}
              ref={carouselRef}
            >
              {set.items.map((item, idx) => (
                <div key={item.id}>
                  <ItemContent billboardSlug={set.slug} item={item} position={idx} />
                </div>
              ))}
            </AntCarousel>
            <Flexbox horizontal className={styles.dots} gap={6} justify="center">
              {set.items.map((item, idx) => (
                <div
                  className={`${styles.dot} ${current === idx ? styles.dotActive : ''}`}
                  key={item.id}
                  onClick={() => carouselRef.current?.goTo(idx)}
                />
              ))}
            </Flexbox>
          </>
        )}
      </motion.div>
    );
  },
);

BillboardCarousel.displayName = 'BillboardCarousel';

export default BillboardCarousel;
