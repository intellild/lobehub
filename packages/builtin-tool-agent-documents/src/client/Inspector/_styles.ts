
import inspectorChipStyles from './_styles.module.css';

export { inspectorChipStyles };

const UUID_LIKE = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

/**
 * Render a friendly short label for a document id. Full UUIDs are noisy in a
 * one-line header; their first 8 chars are unique enough for cross-referencing
 * within a single conversation. Prefixed ids (e.g. `agd_…`) are left intact —
 * they're already short and meaningful.
 */
export const formatDocumentId = (id?: string): string | undefined => {
  if (!id) return undefined;
  return UUID_LIKE.test(id) ? id.slice(0, 8) : id;
};
