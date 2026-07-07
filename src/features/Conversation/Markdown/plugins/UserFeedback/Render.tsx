import { Flexbox, Text } from '@lobehub/ui';
import { MessageSquareText } from 'lucide-react';
import { memo, useMemo } from 'react';

import { type MarkdownElementProps } from '../type';
import { type ParsedUserFeedbackComment, parseUserFeedback } from './parseUserFeedback';
import styles from './Render.module.css';

const Comment = memo<{ comment: ParsedUserFeedbackComment }>(({ comment }) => (
  <Flexbox gap={2}>
    {comment.time && <span className={styles.time}>{comment.time}</span>}
    <div className={styles.comment}>{comment.content}</div>
  </Flexbox>
));

Comment.displayName = 'UserFeedbackComment';

const Render = memo<MarkdownElementProps>(({ children }) => {
  const text = typeof children === 'string' ? children : String(children ?? '');
  const comments = useMemo(() => parseUserFeedback(text), [text]);

  if (comments.length === 0) return null;

  const countLabel = comments.length === 1 ? '1 comment' : `${comments.length} comments`;

  return (
    <details className={styles.root}>
      <summary className={styles.summary}>
        <Flexbox horizontal align={'center'} gap={12}>
          <span className={styles.headerIcon}>
            <MessageSquareText size={16} />
          </span>
          <Flexbox horizontal align={'center'} flex={1} gap={8} style={{ minWidth: 0 }}>
            <Text ellipsis weight={500}>
              User feedback
            </Text>
            <span className={styles.countBadge}>{countLabel}</span>
          </Flexbox>
        </Flexbox>
      </summary>
      <Flexbox className={styles.body} gap={12}>
        {comments.map((comment, idx) => (
          <Comment comment={comment} key={comment.id ?? idx} />
        ))}
      </Flexbox>
    </details>
  );
});

Render.displayName = 'UserFeedbackRender';

export default Render;
