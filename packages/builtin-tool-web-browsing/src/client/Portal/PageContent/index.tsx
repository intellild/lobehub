import type { CrawlResult } from '@lobechat/types';
import type { CrawlSuccessResult } from '@lobechat/web-crawler';
import {
  Alert,
  CopyButton,
  Flexbox,
  Highlighter,
  Icon,
  Markdown,
  stopPropagation,
  Text,
} from '@lobehub/ui';
import { Segmented } from '@lobehub/ui/base-ui';
import { Descriptions } from 'antd';
import { ExternalLink } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CRAWL_CONTENT_LIMITED_COUNT } from '../../../const';
import styles from './index.module.css';

enum DisplayType {
  Raw = 'raw',
  Render = 'render',
}

interface PageContentProps {
  messageId: string;
  result?: CrawlResult;
}

const PageContent = memo<PageContentProps>(({ result }) => {
  const { t } = useTranslation('plugin');
  const [display, setDisplay] = useState<DisplayType>(DisplayType.Render);

  if (!result || !result.data) return undefined;

  if ('errorType' in result.data) {
    return (
      <Flexbox className={styles.footer} gap={4}>
        <div>
          <Descriptions
            column={1}
            size="small"
            classNames={{
              content: styles.footerText,
            }}
            items={[
              {
                children: result.crawler,
                label: t('search.crawPages.meta.crawler'),
              },
            ]}
          />
        </div>
        <Alert
          type={'error'}
          extra={
            <div style={{ maxWidth: 500, overflowX: 'scroll' }}>
              <Highlighter language={'json'}>{JSON.stringify(result.data, null, 2)}</Highlighter>
            </div>
          }
          title={
            <div style={{ textAlign: 'start' }}>
              {result.data.errorMessage || result.data.content}
            </div>
          }
        />
      </Flexbox>
    );
  }

  const { url, title, description, content, siteName } = result.data as CrawlSuccessResult;
  return (
    <Flexbox gap={24}>
      <Flexbox gap={8}>
        <Flexbox
          horizontal
          align={'center'}
          className={styles.titleRow}
          gap={24}
          justify={'space-between'}
        >
          <Flexbox>
            <div className={styles.title}>{title || result.originalUrl}</div>
          </Flexbox>
        </Flexbox>
        {description && (
          <Text className={styles.description} ellipsis={{ rows: 4 }}>
            {description}
          </Text>
        )}
        <Flexbox horizontal align={'center'} className={styles.url} gap={4}>
          {siteName && <div>{siteName} · </div>}
          <a
            className={styles.url}
            href={url}
            rel={'nofollow'}
            style={{ display: 'flex', gap: 4 }}
            target={'_blank'}
            onClick={stopPropagation}
          >
            {result.originalUrl}
            <Icon icon={ExternalLink} />
          </a>
        </Flexbox>

        <div className={styles.footer}>
          <Descriptions
            column={2}
            size="small"
            classNames={{
              content: styles.footerText,
            }}
            items={[
              {
                children: result.data.content?.length,
                label: t('search.crawPages.meta.words'),
              },
              {
                children: result.crawler,
                label: t('search.crawPages.meta.crawler'),
              },
            ]}
          />
        </div>
      </Flexbox>
      {content && (
        <Flexbox gap={12} paddingBlock={'0 12px'}>
          <Flexbox horizontal justify={'space-between'}>
            <Segmented
              value={display}
              variant={'filled'}
              options={[
                { label: t('search.crawPages.detail.preview'), value: DisplayType.Render },
                { label: t('search.crawPages.detail.raw'), value: DisplayType.Raw },
              ]}
              onChange={(value) => setDisplay(value as DisplayType)}
            />
            <CopyButton content={content} />
          </Flexbox>
          {content.length > CRAWL_CONTENT_LIMITED_COUNT && (
            <Alert
              variant={'borderless'}
              title={t('search.crawPages.detail.tooLong', {
                characters: CRAWL_CONTENT_LIMITED_COUNT,
              })}
            />
          )}
          {display === DisplayType.Render ? (
            <Markdown variant={'chat'}>{content}</Markdown>
          ) : (
            <div style={{ paddingBlock: '0 12px' }}>
              {content.length < CRAWL_CONTENT_LIMITED_COUNT ? (
                content
              ) : (
                <>
                  <span>{content.slice(0, CRAWL_CONTENT_LIMITED_COUNT)}</span>
                  <span className={styles.sliced}>
                    {content.slice(CRAWL_CONTENT_LIMITED_COUNT, -1)}
                  </span>
                </>
              )}
            </div>
          )}
        </Flexbox>
      )}
    </Flexbox>
  );
});

export default PageContent;
