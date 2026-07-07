'use client';

import { Center, Flexbox, Icon, stopPropagation, Tooltip } from '@lobehub/ui';
import { CircleDashedIcon, HammerIcon, LayersIcon, MessageSquareQuoteIcon } from 'lucide-react';
import qs from 'query-string';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import urlJoin from 'url-join';

import { Link } from '@/libs/router';
import { McpNavKey } from '@/types/discover';

import {
  calculateScore,
  calculateScoreFlags,
  createScoreItems,
  getGradeStyleClass,
} from './calculateScore';
import styles from './Scores.module.css';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

interface ScoresProps {
  deploymentOptions?: Array<{
    installationMethod?: string;
  }>;
  github?: {
    license?: string;
  };
  identifier: string;
  // List page support
  installationMethods?: string;
  isClaimed?: boolean;
  isValidated?: boolean;
  // Raw data properties
  overview?: {
    readme?: string;
  };
  promptsCount?: number;
  resourcesCount?: number;
  toolsCount?: number;
}

const Scores = memo<ScoresProps>(
  ({
    identifier,
    promptsCount,
    toolsCount,
    resourcesCount,
    isValidated,
    overview,
    github,
    deploymentOptions,
    isClaimed = false,
    installationMethods,
  }) => {
    const { t } = useTranslation('discover');

    // Use utility function to calculate all has* values, but need to handle type conversion
    const scoreFlags = calculateScoreFlags({
      // Only pass compatible properties, or perform type conversion
      deploymentOptions: deploymentOptions?.map((item) => ({
        // Ensure not undefined
        connection: { type: 'stdio' as const },
        installationMethod: item.installationMethod || 'manual', // Provide default connection
      })),
      github: github?.license
        ? {
            license: github.license,
            url: '', // Provide default url
          }
        : undefined,
      installationMethods,
      isClaimed,
      isValidated,
      overview: overview?.readme
        ? {
            readme: overview.readme,
          }
        : undefined,
      promptsCount,
      resourcesCount,
      toolsCount,
    });

    // Calculate score
    const scoreItems = createScoreItems(scoreFlags);
    const scoreResult = calculateScore(scoreItems);
    const { grade, percentage } = scoreResult;

    const showToolts = Boolean(toolsCount && toolsCount > 0);
    const showResources = Boolean(resourcesCount && resourcesCount > 0);
    const showPrompts = Boolean(promptsCount && promptsCount > 0);

    const showExtra = showToolts || showResources || showPrompts;

    const scoreTag = (
      <Tooltip title={`${t(`mcp.details.scoreLevel.${grade}.desc`)} (${Math.round(percentage)}%)`}>
        <Flexbox
          horizontal
          align={'center'}
          className={cx(styles.tag, getGradeStyleClass(grade, styles))}
          gap={8}
          style={{
            paddingLeft: 4,
          }}
        >
          <Center
            className={styles.gradeIcon}
            style={{
              borderColor:
                grade === 'a'
                  ? 'var(--ant-color-success)'
                  : grade === 'b'
                    ? 'var(--ant-color-warning)'
                    : grade === 'f'
                      ? 'var(--ant-color-error)'
                      : 'var(--ant-color-text-secondary)',
            }}
          >
            {grade.toUpperCase()}
          </Center>
          <span style={{ fontWeight: 500 }}>
            {t(`mcp.details.scoreLevel.${grade}.title`).toUpperCase()}
          </span>
        </Flexbox>
      </Tooltip>
    );

    const unvalidatedTag = (
      <Tooltip title={t('mcp.unvalidated.desc')}>
        <Flexbox
          horizontal
          align={'center'}
          className={styles.tag}
          gap={8}
          style={{
            color: 'var(--ant-color-text-description)',
            paddingLeft: 4,
          }}
        >
          <Icon color={'var(--ant-color-text-quaternary)'} icon={CircleDashedIcon} size={22} />
          {t('mcp.unvalidated.title')}
        </Flexbox>
      </Tooltip>
    );

    return (
      <Flexbox horizontal align={'center'} flex={'none'} gap={8} onClick={stopPropagation}>
        {identifier && (
          <Link
            href={qs.stringifyUrl({
              query: {
                activeTab: McpNavKey.Score,
              },
              url: urlJoin('/community/mcp', identifier),
            })}
          >
            {isValidated ? scoreTag : unvalidatedTag}
          </Link>
        )}
        {showExtra && (
          <Link
            href={qs.stringifyUrl({
              query: {
                activeTab: McpNavKey.Schema,
              },
              url: urlJoin('/community/mcp', identifier),
            })}
          >
            <Flexbox horizontal align={'center'} className={styles.extraTag} gap={16}>
              {showToolts && (
                <Tooltip
                  title={[
                    t('mcp.details.schema.tools.title'),
                    t('mcp.details.schema.tools.desc'),
                  ].join(': ')}
                >
                  <Flexbox horizontal align={'center'} className={styles.extraTagActive} gap={8}>
                    <Icon icon={HammerIcon} size={14} />
                    {toolsCount}
                  </Flexbox>
                </Tooltip>
              )}
              {showPrompts && (
                <Tooltip
                  title={[
                    t('mcp.details.schema.prompts.title'),
                    t('mcp.details.schema.prompts.desc'),
                  ].join(': ')}
                >
                  <Flexbox horizontal align={'center'} className={styles.extraTagActive} gap={8}>
                    <Icon icon={MessageSquareQuoteIcon} size={14} />
                    {promptsCount}
                  </Flexbox>
                </Tooltip>
              )}
              {showResources && (
                <Tooltip
                  title={[
                    t('mcp.details.schema.resources.title'),
                    t('mcp.details.schema.resources.desc'),
                  ].join(': ')}
                >
                  <Flexbox horizontal align={'center'} className={styles.extraTagActive} gap={8}>
                    <Icon icon={LayersIcon} size={14} />
                    {resourcesCount}
                  </Flexbox>
                </Tooltip>
              )}
            </Flexbox>
          </Link>
        )}
      </Flexbox>
    );
  },
);

export default Scores;
