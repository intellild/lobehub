'use client';

import { Center, Flexbox, Icon, Input, Text, TextArea } from '@lobehub/ui';
import { Select, useModalContext } from '@lobehub/ui/base-ui';
import { App, Form } from 'antd';
import { CheckIcon } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { agentEvalService } from '@/services/agentEval';

import { DATASET_PRESETS, getPresetsByCategory } from '../../config/datasetPresets';
import styles from './Content.module.css';

const toIdentifier = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^\da-z-]/g, '');

const CATEGORY_LABELS: Record<string, string> = {
  'custom': 'Custom',
  'memory': 'Memory',
  'reference': 'Reference Formats',
  'research': 'Deep Research / QA',
  'tool-use': 'Tool Use',
};

export interface DatasetCreateContentProps {
  benchmarkId: string;
  formId: string;
  onLoadingChange?: (loading: boolean) => void;
  onSuccess?: (dataset: { id: string; name: string; preset: string }) => void;
}

const DatasetCreateContent: FC<DatasetCreateContentProps> = ({
  benchmarkId,
  formId,
  onLoadingChange,
  onSuccess,
}) => {
  const { t } = useTranslation('eval');
  const { close } = useModalContext();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [identifierTouched, setIdentifierTouched] = useState(false);

  const nameValue = Form.useWatch('name', form);
  const evalModeValue = Form.useWatch('evalMode', form);

  useEffect(() => {
    if (!identifierTouched && nameValue) {
      form.setFieldValue('identifier', toIdentifier(nameValue));
    }
  }, [nameValue, identifierTouched, form]);

  const handleFinish = async (values: any) => {
    onLoadingChange?.(true);
    try {
      const result = await agentEvalService.createDataset({
        benchmarkId,
        description: values.description,
        evalConfig: values.evalConfig?.judgePrompt ? values.evalConfig : undefined,
        evalMode: values.evalMode || undefined,
        identifier: values.identifier.trim(),
        metadata: {
          preset: selectedPreset,
        },
        name: values.name,
      });
      close();
      onSuccess?.({
        id: result.id,
        name: result.name,
        preset: selectedPreset,
      });
    } catch (error: any) {
      message.error(error?.message || t('dataset.create.error'));
    } finally {
      onLoadingChange?.(false);
    }
  };

  const presetsByCategory = getPresetsByCategory();
  const orderedCategories = Object.entries(presetsByCategory).filter(
    ([, presets]) => presets.length > 0,
  );

  return (
    <Form form={form} layout="vertical" name={formId} onFinish={handleFinish}>
      <Form.Item
        label={t('dataset.create.name.label')}
        name="name"
        rules={[{ message: t('dataset.create.nameRequired'), required: true }]}
      >
        <Input placeholder={t('dataset.create.name.placeholder')} />
      </Form.Item>

      <Form.Item
        label={t('dataset.create.identifier.label')}
        name="identifier"
        rules={[{ message: t('dataset.create.identifierRequired'), required: true }]}
      >
        <Input
          placeholder={t('dataset.create.identifier.placeholder')}
          style={{ fontFamily: 'var(--ant-font-family-code)' }}
          onChange={() => setIdentifierTouched(true)}
        />
      </Form.Item>

      <Form.Item label={t('dataset.create.description.label')} name="description">
        <TextArea placeholder={t('dataset.create.description.placeholder')} rows={3} />
      </Form.Item>

      <Form.Item extra={t('dataset.evalMode.hint')} label={t('evalMode.label')} name="evalMode">
        <Select
          allowClear
          placeholder={t('evalMode.placeholder')}
          optionRender={(option) => (
            <Flexbox gap={4} style={{ paddingBlock: 4 }}>
              <div>{option.label}</div>
              <Text fontSize={12} type="secondary">
                {t(`evalMode.${option.value}.desc` as any)}
              </Text>
            </Flexbox>
          )}
          options={[
            { label: t('evalMode.equals'), value: 'equals' },
            { label: t('evalMode.contains'), value: 'contains' },
            { label: t('evalMode.llm-rubric'), value: 'llm-rubric' },
            { label: t('evalMode.external'), value: 'external' },
          ]}
        />
      </Form.Item>

      {evalModeValue === 'llm-rubric' && (
        <Form.Item label={t('evalMode.prompt.label')} name={['evalConfig', 'judgePrompt']}>
          <TextArea placeholder={t('evalMode.prompt.placeholder')} rows={3} />
        </Form.Item>
      )}

      {/* Preset picker — selectable cards grouped by category, the bold upgrade
          over the previous single dropdown. */}
      <Flexbox gap={12} style={{ marginBlockStart: 4 }}>
        <span className={styles.sectionLabel}>{t('dataset.create.preset.label')}</span>
        {orderedCategories.map(([category, presets]) => (
          <Flexbox gap={8} key={category}>
            <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
              {CATEGORY_LABELS[category] || category}
            </Text>
            <div className={styles.presetGrid}>
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <div
                    aria-pressed={isSelected}
                    className={`${styles.presetCard} ${isSelected ? styles.presetCardSelected : ''}`}
                    key={preset.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPreset(preset.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPreset(preset.id);
                      }
                    }}
                  >
                    <Flexbox horizontal align="flex-start" gap={12}>
                      <Center className={styles.presetIcon} flex="none" height={36} width={36}>
                        <Icon icon={preset.icon} size={18} />
                      </Center>
                      <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
                        <Text ellipsis weight={500}>
                          {preset.name}
                        </Text>
                        <Text ellipsis color={'var(--ant-color-text-tertiary)'} fontSize={12}>
                          {preset.description}
                        </Text>
                      </Flexbox>
                      {isSelected && (
                        <span className={styles.selectedMark}>
                          <Icon icon={CheckIcon} size={12} />
                        </span>
                      )}
                    </Flexbox>
                  </div>
                );
              })}
            </div>
          </Flexbox>
        ))}

        {DATASET_PRESETS[selectedPreset] && (
          <Flexbox gap={4} style={{ marginBlockStart: 4 }}>
            <Text fontSize={12} type="secondary">
              {DATASET_PRESETS[selectedPreset].formatDescription}
            </Text>
            <Text className={styles.presetMeta}>
              <strong>Required:</strong> {DATASET_PRESETS[selectedPreset].requiredFields.join(', ')}
              {DATASET_PRESETS[selectedPreset].optionalFields.length > 0 && (
                <>
                  {' · '}
                  <strong>Optional:</strong>{' '}
                  {DATASET_PRESETS[selectedPreset].optionalFields.join(', ')}
                </>
              )}
            </Text>
          </Flexbox>
        )}
      </Flexbox>
    </Form>
  );
};

export default DatasetCreateContent;
