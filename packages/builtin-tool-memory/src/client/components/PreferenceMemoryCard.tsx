'use client';

import { Accordion, AccordionItem, Avatar, Flexbox, Tag, Text } from '@lobehub/ui';
import { Steps } from 'antd';
import { memo } from 'react';

import BubblesLoading from '@/components/BubblesLoading';
import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';
import StreamingMarkdown from '@/components/StreamingMarkdown';
import { highlightTextStyles } from '@/styles';

import type { AddPreferenceMemoryParams } from '../../types';
import styles from './PreferenceMemoryCard.module.css';

export interface PreferenceMemoryCardProps {
  data?: AddPreferenceMemoryParams;
  loading?: boolean;
}

export const PreferenceMemoryCard = memo<PreferenceMemoryCardProps>(({ data, loading }) => {
  const { summary, details, tags, title, withPreference } = data || {};
  const { conclusionDirectives, originContext, appContext, suggestions, type } =
    withPreference || {};

  // `tags`/`suggestions` come from raw model tool-call args without zod coercion,
  // so a model may emit a scalar where `string[]` is expected. Normalize to arrays
  // to keep this card from crashing on dirty input (`.map` on a non-array).
  const safeTags = Array.isArray(tags) ? tags : [];
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  const hasContextContent =
    originContext?.actor ||
    originContext?.scenario ||
    originContext?.trigger ||
    originContext?.applicableWhen ||
    originContext?.notApplicableWhen;

  const hasAppContext = appContext?.app || appContext?.feature || appContext?.surface;

  const hasSuggestions = safeSuggestions.length > 0;

  if (
    !summary &&
    !details &&
    !safeTags.length &&
    !title &&
    !conclusionDirectives &&
    !hasContextContent &&
    !hasSuggestions
  )
    return null;

  const contextItems = [
    { avatar: '👤', content: originContext?.actor, title: 'Actor' },
    { avatar: '🎯', content: originContext?.scenario, title: 'Scenario' },
    { avatar: '⚡', content: originContext?.trigger, title: 'Trigger' },
    { avatar: '✅', content: originContext?.applicableWhen, title: 'Applicable When' },
    { avatar: '❌', content: originContext?.notApplicableWhen, title: 'Not Applicable When' },
  ].filter((item) => item.content);

  const appContextItems = [
    { avatar: '📱', content: appContext?.app, title: 'App' },
    { avatar: '🔧', content: appContext?.feature, title: 'Feature' },
    { avatar: '📍', content: appContext?.surface, title: 'Surface' },
  ].filter((item) => item.content);

  return (
    <Flexbox className={styles.container}>
      {/* Header */}
      <Flexbox horizontal align={'center'} className={styles.header} gap={8}>
        <Flexbox flex={1}>
          <div className={styles.title}>{title || 'Preference Memory'}</div>
        </Flexbox>
        {type && <Tag>{type}</Tag>}
        {loading && <NeuralNetworkLoading size={20} />}
      </Flexbox>

      {/* When has context content: collapse summary */}
      {hasContextContent || hasAppContext ? (
        <>
          {/* Collapsed Summary */}
          {(summary || safeTags.length > 0) && (
            <Accordion gap={0}>
              <AccordionItem
                itemKey="summary"
                paddingBlock={8}
                paddingInline={8}
                styles={{
                  base: { marginBlock: 4, marginInline: 4 },
                }}
                title={
                  <Text fontSize={12} type={'secondary'} weight={500}>
                    Summary
                  </Text>
                }
              >
                <Flexbox gap={8} paddingBlock={'8px 12px'} paddingInline={8}>
                  {summary && <div className={styles.summary}>{summary}</div>}
                  {details && <div className={styles.detail}>{details}</div>}
                  {safeTags.length > 0 && (
                    <Flexbox horizontal className={styles.tags} gap={8} wrap={'wrap'}>
                      {safeTags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </Flexbox>
                  )}
                </Flexbox>
              </AccordionItem>
            </Accordion>
          )}

          {/* Origin Context Steps */}
          {hasContextContent && (
            <Accordion className={styles.section} defaultExpandedKeys={['context']} gap={0}>
              <AccordionItem
                itemKey="context"
                paddingBlock={8}
                paddingInline={8}
                title={
                  <Text fontSize={12} type={'secondary'} weight={500}>
                    Origin Context
                  </Text>
                }
              >
                <Flexbox paddingBlock={'8px 12px'} paddingInline={8}>
                  <Steps
                    className={styles.stepsContainer}
                    current={null as any}
                    direction="vertical"
                    size="small"
                    items={contextItems.map((item) => ({
                      description: <div className={styles.stepContent}>{item.content}</div>,
                      icon: (
                        <Avatar
                          shadow
                          avatar={item.avatar}
                          shape={'square'}
                          size={20}
                          style={{
                            border: `1px solid ${'var(--ant-color-border-secondary)'}`,
                            fontSize: 11,
                          }}
                        />
                      ),
                      title: (
                        <Text as={'span'} fontSize={12} type={'secondary'} weight={500}>
                          {item.title}
                        </Text>
                      ),
                    }))}
                  />
                </Flexbox>
              </AccordionItem>
            </Accordion>
          )}

          {/* App Context */}
          {hasAppContext && (
            <Accordion className={styles.section} gap={0}>
              <AccordionItem
                itemKey="appContext"
                paddingBlock={8}
                paddingInline={8}
                title={
                  <Text fontSize={12} type={'secondary'} weight={500}>
                    App Context
                  </Text>
                }
              >
                <Flexbox paddingBlock={'8px 12px'} paddingInline={8}>
                  <Steps
                    className={styles.stepsContainer}
                    current={null as any}
                    direction="vertical"
                    size="small"
                    items={appContextItems.map((item) => ({
                      description: <div className={styles.stepContent}>{item.content}</div>,
                      icon: (
                        <Avatar
                          shadow
                          avatar={item.avatar}
                          shape={'square'}
                          size={20}
                          style={{
                            border: `1px solid ${'var(--ant-color-border-secondary)'}`,
                            fontSize: 11,
                          }}
                        />
                      ),
                      title: (
                        <Text as={'span'} fontSize={12} type={'secondary'} weight={500}>
                          {item.title}
                        </Text>
                      ),
                    }))}
                  />
                </Flexbox>
              </AccordionItem>
            </Accordion>
          )}

          {/* Conclusion Directive */}
          {conclusionDirectives && (
            <Flexbox
              className={styles.section}
              gap={8}
              style={{ paddingBlock: 16, paddingInline: 12 }}
            >
              <Text fontSize={12} weight={500}>
                <span className={highlightTextStyles.primary}>Directive</span>
              </Text>
              <div className={styles.directive}>{conclusionDirectives}</div>
            </Flexbox>
          )}

          {/* Suggestions */}
          {hasSuggestions && (
            <Flexbox
              className={styles.section}
              gap={8}
              style={{ paddingBlock: 16, paddingInline: 12 }}
            >
              <Text fontSize={12} weight={500}>
                <span className={highlightTextStyles.info}>Suggestions</span>
              </Text>
              <Flexbox gap={8}>
                {safeSuggestions.map((suggestion, index) => (
                  <div className={styles.suggestion} key={index}>
                    {suggestion}
                  </div>
                ))}
              </Flexbox>
            </Flexbox>
          )}
        </>
      ) : (
        /* When no context content: show summary and details */
        <Flexbox className={styles.content} gap={8}>
          {!summary && loading ? (
            <BubblesLoading />
          ) : (
            <>
              {summary && <div className={styles.summary}>{summary}</div>}
              {details && <StreamingMarkdown>{details}</StreamingMarkdown>}
              {conclusionDirectives && (
                <Flexbox gap={4} paddingBlock={8}>
                  <Text fontSize={12} weight={500}>
                    <span className={highlightTextStyles.primary}>Directive</span>
                  </Text>
                  <div className={styles.directive}>{conclusionDirectives}</div>
                </Flexbox>
              )}
              {hasSuggestions && (
                <Flexbox gap={8} paddingBlock={8}>
                  <Text fontSize={12} weight={500}>
                    <span className={highlightTextStyles.info}>Suggestions</span>
                  </Text>
                  <Flexbox gap={8}>
                    {safeSuggestions.map((suggestion, index) => (
                      <div className={styles.suggestion} key={index}>
                        {suggestion}
                      </div>
                    ))}
                  </Flexbox>
                </Flexbox>
              )}
              {safeTags.length > 0 && (
                <Flexbox horizontal className={styles.tags} gap={8} wrap={'wrap'}>
                  {safeTags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </Flexbox>
              )}
            </>
          )}
        </Flexbox>
      )}
    </Flexbox>
  );
});

PreferenceMemoryCard.displayName = 'PreferenceMemoryCard';

export default PreferenceMemoryCard;
