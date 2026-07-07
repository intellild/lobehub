'use client';

import { Flexbox } from '@lobehub/ui';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useAgentStore } from '@/store/agent';
import { useAgentGroupStore } from '@/store/agentGroup';

import {
  DEVTOOLS_AGENT_ID,
  DEVTOOLS_AGENT_META,
  DEVTOOLS_GROUP_DETAIL,
  DEVTOOLS_GROUP_ID,
} from './fixtures';
import styles from './index.module.css';
import Sidebar from './Sidebar';
import { toToolsetPath, useDevtoolsEntries } from './useDevtoolsEntries';

const DevtoolsLayout = () => {
  const { menuItems } = useDevtoolsEntries();
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useWorkspaceAwareNavigate();

  useEffect(() => {
    const previousGroupState = useAgentGroupStore.getState();

    useAgentGroupStore.setState({
      activeGroupId: DEVTOOLS_GROUP_ID,
      groupMap: {
        ...previousGroupState.groupMap,
        [DEVTOOLS_GROUP_ID]: DEVTOOLS_GROUP_DETAIL as any,
      },
    });

    // Seed the Aggregate-preview agent meta so its turns read as "Lobe AI"
    // (avatar + name) instead of the unresolved-agent fallback.
    const previousAgentMap = useAgentStore.getState().agentMap;
    useAgentStore.setState({
      agentMap: { ...previousAgentMap, [DEVTOOLS_AGENT_ID]: DEVTOOLS_AGENT_META as any },
    });

    return () => {
      useAgentGroupStore.setState({
        activeGroupId: previousGroupState.activeGroupId,
        groupMap: previousGroupState.groupMap,
      });
      useAgentStore.setState({ agentMap: previousAgentMap });
    };
  }, []);

  return (
    <Flexbox horizontal className={styles.page}>
      <Sidebar
        items={menuItems}
        selectedKey={identifier}
        onSelect={(key) => navigate(toToolsetPath(key))}
      />
      <Flexbox className={styles.main}>
        <Outlet />
      </Flexbox>
    </Flexbox>
  );
};

export default DevtoolsLayout;
