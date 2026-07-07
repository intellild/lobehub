'use client';

import { Block, Flexbox, Icon, Tag } from '@lobehub/ui';
import { Input, Space } from 'antd';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ApiVisualizer.module.css';

interface ApiItemProps {
  api: {
    description: string;
    name: string;
    parameters: {
      properties: Record<string, { description: string; type: string }>;
      required: string[];
    };
  };
}

const ApiItem = memo<ApiItemProps>(({ api }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation('plugin');

  const params = Object.entries(api.parameters.properties || {});
  return (
    <Block gap={8} padding={16}>
      <div className={styles.apiHeader} onClick={() => setExpanded(!expanded)}>
        <Flexbox gap={8}>
          <div className={styles.apiTitle}>{api.name}</div>
          <div className={styles.apiDesc}>{api.description}</div>
        </Flexbox>

        <Icon icon={expanded ? ChevronDown : ChevronRight} />
      </div>

      {expanded && (
        <Flexbox
          gap={12}
          padding={16}
          style={{ background: 'var(--ant-color-fill-quaternary)', borderRadius: 6 }}
        >
          {params.length === 0 ? (
            <div className={styles.params}>{t('dev.preview.api.noParams')}</div>
          ) : (
            <>
              <div className={styles.params}>{t('dev.preview.api.params')}</div>
              <Space direction="vertical" style={{ width: '100%' }}>
                {params.map(([name, param]) => {
                  const isRequired = api.parameters.required?.includes(name);
                  return (
                    <div className={styles.paramGrid} key={name}>
                      <div className={styles.paramName}>
                        <span>{name}</span>
                        {isRequired && <span className={styles.required}>*</span>}
                        <Tag className={styles.typeTag}>{param.type}</Tag>
                      </div>
                      <div className={styles.paramDesc}>{param.description}</div>
                    </div>
                  );
                })}
              </Space>
            </>
          )}
        </Flexbox>
      )}
    </Block>
  );
});

interface ApiVisualizerProps {
  apis: ApiItemProps['api'][];
}

const ApiVisualizer = memo<ApiVisualizerProps>(({ apis = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation('plugin');

  const filteredApis = apis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Flexbox gap={8} width={'100%'}>
      <div className={styles.searchWrapper}>
        <Input.Search
          placeholder={t('dev.preview.api.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Space direction="vertical" style={{ width: '100%' }}>
        {filteredApis.length > 0 ? (
          filteredApis.map((api, index) => <ApiItem api={api} key={index} />)
        ) : (
          <div className={styles.emptyState}>{t('dev.preview.api.noResults')}</div>
        )}
      </Space>
    </Flexbox>
  );
});

export default ApiVisualizer;
