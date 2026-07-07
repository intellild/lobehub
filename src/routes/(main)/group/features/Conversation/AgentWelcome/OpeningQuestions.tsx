'use client';

import { Block, Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useConversationStore } from '@/features/Conversation';

import styles from './OpeningQuestions.module.css';

interface OpeningQuestionsProps {
  mobile?: boolean;
  questions: string[];
}

const OpeningQuestions = memo<OpeningQuestionsProps>(({ mobile, questions }) => {
  const { t } = useTranslation('welcome');
  const [sendMessage] = useConversationStore((s) => [s.sendMessage]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>{t('guide.questions.title')}</p>
      <Flexbox horizontal gap={8} wrap={'wrap'}>
        {questions.slice(0, mobile ? 2 : 5).map((question) => {
          return (
            <Block
              clickable
              className={styles.card}
              key={question}
              paddingBlock={8}
              paddingInline={12}
              variant={'filled'}
              onClick={() => {
                sendMessage({ message: question });
              }}
            >
              {question}
            </Block>
          );
        })}
      </Flexbox>
    </div>
  );
});

export default OpeningQuestions;
