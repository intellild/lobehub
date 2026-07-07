import { Button, Center, Flexbox, Text } from '@lobehub/ui';
import { Copy } from 'lucide-react';
import { memo, useMemo } from 'react';

import { useMockCases } from '../hooks/useMockCases';
import { useAgentMockStore } from '../store/agentMockStore';
import styles from './FixtureView.module.css';

export const FixtureView = memo(() => {
  const { all } = useMockCases();
  const selectedCaseId = useAgentMockStore((s) => s.selectedCaseId);
  const c = all.find((x) => x.id === selectedCaseId);

  const json = useMemo(() => (c ? JSON.stringify(c, null, 2) : ''), [c]);

  if (!c) {
    return (
      <Center flex={1}>
        <Text type="secondary">Pick a case to begin.</Text>
      </Center>
    );
  }

  return (
    <div className={styles.wrap}>
      <Flexbox horizontal align="center" justify="space-between">
        <Text style={{ fontSize: 11 }} type="secondary">
          {c.id}
        </Text>
        <Button
          icon={<Copy size={14} />}
          size="small"
          onClick={() =>
            navigator.clipboard
              .writeText(json)
              .catch((err) => console.error('[AgentMock] Copy failed:', err))
          }
        >
          Copy
        </Button>
      </Flexbox>
      <pre className={styles.pre}>{json}</pre>
    </div>
  );
});

FixtureView.displayName = 'AgentMockFixtureView';
