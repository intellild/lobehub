import { Flexbox, Skeleton } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useFolderPath } from '@/routes/(main)/resource/features/hooks/useFolderPath';
import { useResourceManagerStore } from '@/routes/(main)/resource/features/store';
import { useFileStore } from '@/store/file';
import { knowledgeBaseSelectors, useKnowledgeBaseStore } from '@/store/library';
import { FilesTabs } from '@/types/files';

import styles from './Breadcrumb.module.css';

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

interface BreadcrumbProps {
  category?: string;
  fileName?: string;
  knowledgeBaseId?: string;
}

interface FolderCrumb {
  id: string;
  name: string;
  slug: string;
}

const Breadcrumb = memo<BreadcrumbProps>(({ category, fileName }) => {
  const { t } = useTranslation('file');
  const navigate = useWorkspaceAwareNavigate();
  const [searchParams] = useSearchParams();
  const { currentFolderSlug, knowledgeBaseId: currentKnowledgeBaseId } = useFolderPath();

  const setMode = useResourceManagerStore((s) => s.setMode);
  const setCurrentViewItemId = useResourceManagerStore((s) => s.setCurrentViewItemId);

  const baseKnowledgeBaseId = currentKnowledgeBaseId;
  const knowledgeBaseName = useKnowledgeBaseStore(
    knowledgeBaseSelectors.getKnowledgeBaseNameById(baseKnowledgeBaseId || ''),
  );

  // Fetch folder breadcrumb chain from backend
  const useFetchFolderBreadcrumb = useFileStore((s) => s.useFetchFolderBreadcrumb);
  const { data: folderChain = [] } = useFetchFolderBreadcrumb(currentFolderSlug);

  // When in inbox mode (no knowledgeBaseId), show category in breadcrumb
  if (!baseKnowledgeBaseId) {
    if (!category || category === FilesTabs.All) {
      return null;
    }

    const categoryLabel = t(`tab.${category as FilesTabs}` as any);

    return (
      <Flexbox horizontal align={'center'} className={styles.breadcrumb} gap={0}>
        <span
          className={cx(styles.breadcrumbItem, styles.currentItem)}
          style={{ cursor: 'default' }}
        >
          {categoryLabel}
        </span>
      </Flexbox>
    );
  }

  const handleNavigate = (slug: string | null) => {
    // If navigating while viewing a file, reset the file view mode
    if (fileName) {
      setMode('explorer');
      setCurrentViewItemId(undefined);
    }

    // Preserve existing query parameters (view and sort preferences)
    const newParams = new URLSearchParams(searchParams);
    // Remove 'file' parameter when navigating away
    newParams.delete('file');

    const queryString = newParams.toString();
    const basePath = slug
      ? `/resource/library/${baseKnowledgeBaseId}/${slug}`
      : `/resource/library/${baseKnowledgeBaseId}`;

    navigate(queryString ? `${basePath}?${queryString}` : basePath);
  };

  const isAtRoot = folderChain.length === 0 && !fileName;
  const isRootClickable = folderChain.length > 0 || fileName;

  return (
    <Flexbox horizontal align={'center'} className={styles.breadcrumb} gap={0}>
      <span
        className={cx(styles.breadcrumbItem, isAtRoot && styles.currentItem)}
        style={{ cursor: isRootClickable ? 'pointer' : 'default' }}
        onClick={() => isRootClickable && handleNavigate(null)}
      >
        {knowledgeBaseName ? (
          knowledgeBaseName
        ) : (
          <Skeleton.Button active size="small" style={{ height: 14, minWidth: 80, width: 80 }} />
        )}
      </span>

      {folderChain.map((folder: FolderCrumb, index: number) => {
        const isLast = index === folderChain.length - 1 && !fileName;
        return (
          <Flexbox horizontal align={'center'} gap={0} key={folder.id}>
            <span className={styles.separator}>/</span>
            <span
              className={cx(styles.breadcrumbItem, isLast && styles.currentItem)}
              style={{ cursor: isLast ? 'default' : 'pointer' }}
              onClick={() => !isLast && handleNavigate(folder.slug)}
            >
              {folder.name}
            </span>
          </Flexbox>
        );
      })}

      {fileName && (
        <Flexbox horizontal align={'center'} gap={0}>
          <span className={styles.separator}>/</span>
          <span
            className={cx(styles.breadcrumbItem, styles.currentItem)}
            style={{ cursor: 'default' }}
          >
            {fileName}
          </span>
        </Flexbox>
      )}
    </Flexbox>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
