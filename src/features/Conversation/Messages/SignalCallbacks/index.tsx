'use client';

import { type UISignalCallbacksBlock } from '@lobechat/types';
import { Accordion, AccordionItem, Block, Flexbox, Icon, Markdown, Text } from '@lobehub/ui';
import { Radio } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';

const SignalCallbacks = memo<{ block: UISignalCallbacksBlock }>(({ block }) => {
  const { t } = useTranslation('chat');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  return (
    <Accordion
      expandedKeys={expandedKeys}
      gap={4}
      onExpandedChange={(keys) => setExpandedKeys(keys as string[])}
    >
      <AccordionItem
        itemKey="signal-callbacks"
        paddingBlock={4}
        paddingInline={4}
        title={
          <Flexbox horizontal align="center" gap={8}>
            <Block
              horizontal
              align="center"
              flex="none"
              gap={4}
              height={24}
              justify="center"
              style={{ fontSize: 12 }}
              variant="outlined"
              width={24}
            >
              <Icon color={'var(--ant-color-text-secondary)'} icon={Radio} />
            </Block>
            <Text as="span" type="secondary">
              {t('signalCallbacks.title', {
                count: block.callbacks.length,
                tool: block.sourceToolName,
              })}
            </Text>
          </Flexbox>
        }
      >
        <Block
          className={styles.callbackBody}
          padding={12}
          style={{ marginBlock: 8 }}
          variant={'outlined'}
        >
          {block.callbacks.length === 0 ? (
            <Text type="secondary">{t('signalCallbacks.empty')}</Text>
          ) : (
            <Flexbox gap={4}>
              {block.callbacks.map((cb) => (
                <Flexbox
                  horizontal
                  align="flex-start"
                  className={styles.callbackItem}
                  gap={8}
                  key={cb.id}
                >
                  {typeof cb.sequence === 'number' && (
                    <span className={styles.sequence}>#{cb.sequence}</span>
                  )}
                  <Flexbox flex={1}>
                    <Markdown variant="chat">{cb.content}</Markdown>
                  </Flexbox>
                </Flexbox>
              ))}
            </Flexbox>
          )}
        </Block>
      </AccordionItem>
    </Accordion>
  );
});

SignalCallbacks.displayName = 'SignalCallbacks';

export default SignalCallbacks;
