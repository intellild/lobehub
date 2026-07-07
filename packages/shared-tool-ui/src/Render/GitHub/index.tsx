'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { fromNow } from '@lobechat/utils/time';
import { Block, Flexbox, Highlighter, Icon, Markdown, Tag, Text } from '@lobehub/ui';
import { ExternalLink, Link2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';
import {
  buildGitHubRenderModel,
  formatIsoDate,
  type GitHubEntity,
  type GitHubField,
  type GitHubLink,
} from './utils';

const hasItems = <T,>(items: T[]) => items.length > 0;

const Section = memo<{ children: ReactNode; title: string }>(({ children, title }) => (
  <Flexbox gap={6}>
    <Text className={styles.sectionLabel}>{title}</Text>
    {children}
  </Flexbox>
));
Section.displayName = 'GitHubRenderSection';

const MetaRow = memo<{ fields: GitHubField[] }>(({ fields }) => {
  if (!hasItems(fields)) return null;

  return (
    <div className={styles.metaRow}>
      {fields.map((field) => (
        <span className={styles.metaItem} key={`${field.key}:${field.value}`}>
          <span className={styles.metaLabel}>{field.label}</span>
          <span className={styles.metaValue} title={field.value}>
            {field.value}
          </span>
        </span>
      ))}
    </div>
  );
});
MetaRow.displayName = 'GitHubRenderMetaRow';

const LinkList = memo<{ links: GitHubLink[] }>(({ links }) => {
  if (!hasItems(links)) return null;

  return (
    <Flexbox gap={4}>
      {links.map((link) => (
        <a
          className={styles.linkRow}
          href={link.url}
          key={`${link.title}:${link.url}`}
          rel={'noreferrer'}
          target={'_blank'}
        >
          <Icon icon={Link2} size={13} />
          <Text ellipsis className={styles.linkText} title={link.title}>
            {link.title}
          </Text>
          <Icon icon={ExternalLink} size={12} />
        </a>
      ))}
    </Flexbox>
  );
});
LinkList.displayName = 'GitHubRenderLinkList';

const EntityCard = memo<{ entity: GitHubEntity }>(({ entity }) => {
  const { t } = useTranslation('plugin');
  const { title, id, url, state, updatedAt, kind } = entity;

  return (
    <Block gap={8} padding={10} variant={'outlined'} width={'100%'}>
      <div className={styles.entityHeader}>
        <div className={styles.headLeft}>
          <Tag size={'small'}>{kind}</Tag>
          {title &&
            (url ? (
              <a className={styles.titleLink} href={url} rel={'noreferrer'} target={'_blank'}>
                <Text ellipsis weight={600}>
                  {title}
                </Text>
                <Icon icon={ExternalLink} size={12} />
              </a>
            ) : (
              <Text ellipsis weight={600}>
                {title}
              </Text>
            ))}
          {id && <Tag size={'small'}>{id}</Tag>}
          {state && (
            <Tag size={'small'} variant={'outlined'}>
              {state}
            </Tag>
          )}
        </div>
        {updatedAt && (
          <span className={styles.timeItem} title={formatIsoDate(updatedAt)}>
            {t('builtins.github.render.updatedAt', { time: fromNow(updatedAt) })}
          </span>
        )}
      </div>
      <MetaRow fields={entity.fields} />
      {entity.description && (
        <div className={styles.description}>
          <Markdown fontSize={13} variant={'chat'}>
            {entity.description}
          </Markdown>
        </div>
      )}
      <LinkList links={entity.links} />
    </Block>
  );
});
EntityCard.displayName = 'GitHubRenderEntityCard';

const GitHubRender = memo<BuiltinRenderProps<Record<string, unknown>, unknown, unknown>>(
  ({ apiName, args, content, pluginError }) => {
    const { t } = useTranslation('plugin');
    const model = useMemo(
      () => buildGitHubRenderModel({ apiName, args, content, pluginError }),
      [apiName, args, content, pluginError],
    );
    const hasResult =
      hasItems(model.resultEntities) || Boolean(model.resultText) || Boolean(model.rawResultJson);

    if (!hasResult && !model.errorText) return null;

    return (
      <Flexbox className={styles.container} gap={12}>
        {hasItems(model.resultEntities) && (
          <Flexbox gap={8}>
            {model.resultEntities.map((entity, index) => (
              <EntityCard
                entity={entity}
                key={`${entity.id || entity.title || 'entity'}:${index}`}
              />
            ))}
          </Flexbox>
        )}
        {model.resultText && (
          <Highlighter
            wrap
            language={'text'}
            showLanguage={false}
            style={{ maxHeight: 220, overflow: 'auto', paddingInline: 8 }}
            variant={'filled'}
          >
            {model.resultText}
          </Highlighter>
        )}
        {model.rawResultJson && (
          <details className={styles.rawDetails}>
            <summary>{t('builtins.github.render.rawResult')}</summary>
            <Highlighter
              wrap
              language={'json'}
              style={{ maxHeight: 260, overflow: 'auto', paddingInline: 8 }}
              variant={'filled'}
            >
              {model.rawResultJson}
            </Highlighter>
          </details>
        )}
        {model.errorText && (
          <Section title={t('builtins.github.render.error')}>
            <Highlighter
              wrap
              language={'text'}
              showLanguage={false}
              style={{ maxHeight: 220, overflow: 'auto', paddingInline: 8 }}
              variant={'filled'}
            >
              {model.errorText}
            </Highlighter>
          </Section>
        )}
      </Flexbox>
    );
  },
);

GitHubRender.displayName = 'GitHubRender';

export default GitHubRender;
