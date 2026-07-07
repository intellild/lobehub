import { Block, Center, Flexbox, Popover } from '@lobehub/ui';
import { Progress } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { type ScoreResult } from '../../MCP/calculateScore';
import { sortItemsByPriority } from '../../MCP/calculateScore';
import styles from './TotalScore.module.css';

// Version of getGradeColor using Ant Design CSS variables.
const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'a': {
      return 'var(--ant-color-success)';
    }
    case 'b': {
      return 'var(--ant-color-warning)';
    }
    case 'f': {
      return 'var(--ant-color-error)';
    }
    default: {
      return 'var(--ant-color-text-secondary)';
    }
  }
};

interface ScoreItem {
  check: boolean;
  required?: boolean;
  title: string;
  weight?: number;
}

interface TotalScoreProps {
  isValidated?: boolean;
  scoreItems?: ScoreItem[];
  scoreResult: ScoreResult;
}

const TotalScore = memo<TotalScoreProps>(({ scoreResult, scoreItems = [], isValidated }) => {
  const { t } = useTranslation('discover');

  const { totalScore, maxScore, percentage, grade } = scoreResult;

  // Segment-level color configuration using theme colors
  const SEGMENT_COLORS = {
    // Green (80-100%)
    A_COLOR: 'var(--ant-color-success)',

    // Yellow (60-85%)
    B_COLOR: 'var(--ant-color-warning)',

    // Red (0-60%)
    F_COLOR: 'var(--ant-color-error)',
  };

  const allItems = sortItemsByPriority([...scoreItems]);
  const completedRequired = allItems.filter((item) => item.required && item.check);
  const incompleteRequired = allItems.filter((item) => item.required && !item.check);
  const completedOptional = allItems.filter((item) => !item.required && item.check);
  const incompleteOptional = allItems.filter((item) => !item.required && !item.check);

  // Count the number of required items
  const totalRequiredItems = completedRequired.length + incompleteRequired.length;
  const completedRequiredItems = completedRequired.length;

  // Generate tooltip content
  const renderTooltipContent = () => (
    <div className={styles.tooltipContent}>
      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
        <strong>
          {totalScore}/{maxScore} {t('mcp.details.totalScore.scoreInfo.points')} (
          {Math.round(percentage)}%)
        </strong>
      </div>

      {completedRequired.length > 0 && (
        <>
          <div className={styles.sectionTitle} style={{ color: getGradeColor(grade) }}>
            {t('mcp.details.totalScore.popover.completedRequired', {
              count: completedRequired.length,
            })}
            :
          </div>
          <ul className={styles.itemList}>
            {completedRequired.map((item, index) => (
              <li key={index}>{item.title}</li>
            ))}
          </ul>
        </>
      )}

      {incompleteRequired.length > 0 && (
        <>
          <div className={styles.sectionTitle} style={{ color: 'var(--ant-color-error)' }}>
            {t('mcp.details.totalScore.popover.incompleteRequired', {
              count: incompleteRequired.length,
            })}
            :
          </div>
          <ul className={styles.itemList}>
            {incompleteRequired.map((item, index) => (
              <li key={index}>{item.title}</li>
            ))}
          </ul>
        </>
      )}

      {completedOptional.length > 0 && (
        <>
          <div className={styles.sectionTitle} style={{ color: getGradeColor(grade) }}>
            {t('mcp.details.totalScore.popover.completedOptional', {
              count: completedOptional.length,
            })}
            :
          </div>
          <ul className={styles.itemList}>
            {completedOptional.map((item, index) => (
              <li key={index}>{item.title}</li>
            ))}
          </ul>
        </>
      )}

      {incompleteOptional.length > 0 && (
        <>
          <div className={styles.sectionTitle} style={{ color: 'var(--ant-color-text-secondary)' }}>
            {t('mcp.details.totalScore.popover.incompleteOptional', {
              count: incompleteOptional.length,
            })}
            :
          </div>
          <ul className={styles.itemList}>
            {incompleteOptional.map((item, index) => (
              <li key={index}>{item.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <Block gap={12} padding={16} variant={'outlined'}>
      <Flexbox horizontal align="flex-start" justify="space-between">
        <Flexbox>
          <h2 style={{ fontWeight: 'bold', margin: 0 }}>
            {t(`mcp.details.scoreLevel.${grade}.fullTitle`)}
          </h2>
          <div className={styles.description}>{t(`mcp.details.scoreLevel.${grade}.desc`)}</div>
        </Flexbox>
        {isValidated && (
          <Center
            className={styles.gradeBadge}
            style={{
              borderColor: getGradeColor(grade),
              color: getGradeColor(grade),
            }}
          >
            {grade.toUpperCase()}
          </Center>
        )}
      </Flexbox>

      <div className={styles.progressContainer}>
        <Popover
          placement="bottom"
          trigger={['hover', 'click']}
          content={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                {t('mcp.details.totalScore.popover.title')}
              </div>
              {renderTooltipContent()}
            </div>
          }
        >
          <Progress
            percent={Math.round(percentage)}
            showInfo={false}
            size={{
              height: 8,
            }}
            strokeColor={{
              '0%': SEGMENT_COLORS.F_COLOR,
              '60%': SEGMENT_COLORS.B_COLOR,
              '80%': SEGMENT_COLORS.A_COLOR,
            }}
          />
        </Popover>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.colorDot} style={{ backgroundColor: SEGMENT_COLORS.F_COLOR }} />
            <span>{t('mcp.details.totalScore.legend.fGrade', { maxPercent: 60 })}</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.colorDot} style={{ backgroundColor: SEGMENT_COLORS.B_COLOR }} />
            <span>
              {t('mcp.details.totalScore.legend.bGrade', { maxPercent: 80, minPercent: 60 })}
            </span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.colorDot} style={{ backgroundColor: SEGMENT_COLORS.A_COLOR }} />
            <span>{t('mcp.details.totalScore.legend.aGrade', { minPercent: 80 })}</span>
          </div>
        </div>
      </div>

      <div className={styles.gradeInfo}>
        <span style={{ fontSize: '16px', fontWeight: 600 }}>
          {totalScore}/{maxScore} {t('mcp.details.totalScore.scoreInfo.points')}
        </span>
        <span style={{ color: getGradeColor(grade), fontWeight: 600 }}>
          {Math.round(percentage)}%
        </span>
        <span style={{ color: getGradeColor(grade), fontSize: '14px' }}>
          {t('mcp.details.totalScore.scoreInfo.requiredItems')}: {completedRequiredItems}/
          {totalRequiredItems} {t('mcp.details.totalScore.scoreInfo.items')}
        </span>
      </div>
    </Block>
  );
});

export default TotalScore;
