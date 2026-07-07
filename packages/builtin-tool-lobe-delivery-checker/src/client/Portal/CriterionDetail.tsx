'use client';

import {
  ReactCodeblockPlugin,
  ReactCodePlugin,
  ReactHRPlugin,
  ReactLinkPlugin,
  ReactListPlugin,
  ReactMathPlugin,
  ReactTablePlugin,
} from '@lobehub/editor';
import { Editor, useEditor } from '@lobehub/editor/react';
import { Flexbox, Icon, TextArea } from '@lobehub/ui';
import { Switch } from '@lobehub/ui/base-ui';
import type { LucideIcon } from 'lucide-react';
import { Bot, Hand, ListChecks, RefreshCw, RotateCcw, Scale, ShieldCheck } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useVerifyStore, verifySelectors } from '@/store/verify';

import type { VerifyOnFailStrategy, VerifyVerifierType } from '../../types';
import styles from './CriterionDetail.module.css';

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

/** The shape this panel needs — assembled from the tool args / state. */
export interface CriterionView {
  /** `verify_criteria.id`; absent on legacy plans → edits can't persist. */
  criterionId?: string;
  description?: string;
  /** Instruction document id; absent → the rubric can't persist. */
  documentId?: string;
  instruction?: string;
  onFail: VerifyOnFailStrategy;
  required: boolean;
  title: string;
  verifierType: VerifyVerifierType;
}

// `program` checks aren't executed in v1, so the picker only offers agent / llm.
const VERIFIERS: { icon: LucideIcon; type: VerifyVerifierType }[] = [
  { icon: Bot, type: 'agent' },
  { icon: Scale, type: 'llm' },
];

const ON_FAILS: { icon: LucideIcon; type: VerifyOnFailStrategy }[] = [
  { icon: RefreshCw, type: 'auto_repair' },
  { icon: Hand, type: 'manual' },
];

const EDITOR_PLUGINS = [
  ReactListPlugin,
  ReactCodePlugin,
  ReactCodeblockPlugin,
  ReactHRPlugin,
  ReactLinkPlugin,
  ReactTablePlugin,
  ReactMathPlugin,
];

interface FieldProps {
  children: React.ReactNode;
  icon: LucideIcon;
  label: string;
}

const Field = memo<FieldProps>(({ icon, label, children }) => (
  <Flexbox gap={8}>
    <Flexbox horizontal align="center" gap={6}>
      <Icon className={styles.fieldIcon} icon={icon} size={14} />
      <span className={styles.fieldLabel}>{label}</span>
    </Flexbox>
    {children}
  </Flexbox>
));

interface CriterionDetailProps {
  criterion: CriterionView;
}

/**
 * The right-side config panel for a single delivery check. Every control writes
 * through the verify store, which optimistically overlays the edit and
 * debounce-persists it to the criterion row / instruction document.
 */
const CriterionDetail = memo<CriterionDetailProps>(({ criterion }) => {
  const { t } = useTranslation('plugin');
  const { criterionId, documentId } = criterion;

  const updateCriterion = useVerifyStore((s) => s.updateCriterion);
  const updateInstruction = useVerifyStore((s) => s.updateInstruction);
  const edit = useVerifyStore(verifySelectors.criterionEdit(criterionId));

  const editor = useEditor();

  // The panel updates in place (no remount) when switching criteria, so push the
  // new rubric into the editor imperatively — keeps the title/description from
  // re-measuring and jittering on nav.
  useEffect(() => {
    if (editor) editor.setDocument('text', criterion.instruction ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, criterionId, documentId]);

  const editable = !!criterionId;
  const title = edit.title ?? criterion.title;
  const description = edit.description ?? criterion.description ?? '';
  const required = edit.required ?? criterion.required;
  const verifierType = edit.verifierType ?? criterion.verifierType;
  const onFail = edit.onFail ?? criterion.onFail;

  const patch = (value: Parameters<typeof updateCriterion>[1]) => {
    if (criterionId) updateCriterion(criterionId, value);
  };

  const handleInstructionChange = () => {
    if (!documentId || !editor) return;
    const content = (editor.getDocument('text') as unknown as string) || '';
    updateInstruction(documentId, content);
  };

  return (
    <Flexbox gap={16} paddingBlock={16} style={{ height: '100%' }}>
      {/* Lightweight title + description at the top */}
      <Flexbox gap={4}>
        <TextArea
          autoSize={{ minRows: 1 }}
          className={styles.title}
          placeholder={t('builtins.lobe-delivery-checker.verifyPlan.portal.fields.title')}
          readOnly={!editable}
          value={title}
          variant="borderless"
          onChange={(e) => patch({ title: e.target.value })}
        />
        <TextArea
          autoSize={{ minRows: 1 }}
          className={styles.description}
          placeholder={t('builtins.lobe-delivery-checker.verifyPlan.portal.fields.description')}
          readOnly={!editable}
          value={description}
          variant="borderless"
          onChange={(e) => patch({ description: e.target.value })}
        />
      </Flexbox>

      {/* Judging rubric — rich editor */}
      <Field
        icon={ListChecks}
        label={t('builtins.lobe-delivery-checker.verifyPlan.portal.fields.instruction')}
      >
        <div className={styles.editorBlock}>
          <Editor
            content={criterion.instruction}
            editable={!!documentId}
            editor={editor}
            plugins={EDITOR_PLUGINS}
            type={'text'}
            onTextChange={handleInstructionChange}
          />
        </div>
      </Field>

      <div className={styles.divider} />

      {/* Required */}
      <Flexbox
        horizontal
        align="center"
        className={styles.switchCard}
        gap={12}
        justify="space-between"
      >
        <Flexbox gap={2} style={{ minWidth: 0 }}>
          <span className={styles.switchTitle}>
            {t('builtins.lobe-delivery-checker.verifyPlan.portal.required.title')}
          </span>
          <span className={styles.switchDesc}>
            {t('builtins.lobe-delivery-checker.verifyPlan.portal.required.desc')}
          </span>
        </Flexbox>
        <Switch checked={required} disabled={!editable} onChange={(c) => patch({ required: c })} />
      </Flexbox>

      {/* Verifier type */}
      <Field
        icon={ShieldCheck}
        label={t('builtins.lobe-delivery-checker.verifyPlan.portal.verifier.title')}
      >
        <Flexbox horizontal gap={8}>
          {VERIFIERS.map(({ type, icon }) => (
            <Flexbox
              className={cx(styles.verifierCard, verifierType === type && styles.cardActive)}
              gap={6}
              key={type}
              onClick={() => patch({ verifierType: type })}
            >
              <Flexbox horizontal align="center" gap={6}>
                <Icon className={styles.verifierIcon} icon={icon} size={15} />
                <span className={styles.cardTitle}>
                  {t(
                    `builtins.lobe-delivery-checker.verifyPlan.portal.verifier.${type}.title` as any,
                  )}
                </span>
              </Flexbox>
              <span className={styles.cardDesc}>
                {t(`builtins.lobe-delivery-checker.verifyPlan.portal.verifier.${type}.desc` as any)}
              </span>
            </Flexbox>
          ))}
        </Flexbox>
      </Field>

      {/* On failure */}
      <Field
        icon={RotateCcw}
        label={t('builtins.lobe-delivery-checker.verifyPlan.portal.onFail.title')}
      >
        <Flexbox horizontal gap={8}>
          {ON_FAILS.map(({ type, icon }) => (
            <Flexbox
              className={cx(styles.verifierCard, onFail === type && styles.cardActive)}
              gap={6}
              key={type}
              onClick={() => patch({ onFail: type })}
            >
              <Flexbox horizontal align="center" gap={6}>
                <Icon className={styles.verifierIcon} icon={icon} size={15} />
                <span className={styles.cardTitle}>
                  {t(`builtins.lobe-delivery-checker.verifyPlan.portal.onFail.${type}` as any)}
                </span>
              </Flexbox>
              <span className={styles.cardDesc}>
                {t(`builtins.lobe-delivery-checker.verifyPlan.portal.onFail.${type}Desc` as any)}
              </span>
            </Flexbox>
          ))}
        </Flexbox>
      </Field>
    </Flexbox>
  );
});

CriterionDetail.displayName = 'CriterionDetail';

export default CriterionDetail;
