'use client';

import { isDesktop } from '@lobechat/const';
import { type BinaryStatus, type ClaudeAuthStatus } from '@lobechat/electron-client-ipc';
import {
  getHeterogeneousAgentClientConfig,
  isRemoteHeterogeneousType,
} from '@lobechat/heterogeneous-agents/client';
import type { HeterogeneousProviderConfig } from '@lobechat/types';
import { ActionIcon, CopyButton, Flexbox, Icon, Input, Tag, Text, Tooltip } from '@lobehub/ui';
import { Loader2Icon, PencilLine, RefreshCw, XCircle } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import HeterogeneousAgentStatusGuide from '@/features/Electron/HeterogeneousAgent/StatusGuide';
import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { usePermission } from '@/hooks/usePermission';
import { binaryService } from '@/services/electron/binary';

import stylesModule from './HeterogeneousAgentStatusCard.module.css';

const COMMAND_LINE_HEIGHT = 28;
const styles = stylesModule;

interface HeterogeneousAgentStatusCardProps {
  onCommandChange?: (command: string) => Promise<void> | void;
  provider: HeterogeneousProviderConfig;
}

const HeterogeneousAgentStatusCard = memo<HeterogeneousAgentStatusCardProps>(
  ({ provider, onCommandChange }) => {
    const { t } = useTranslation('setting');
    const navigate = useWorkspaceAwareNavigate();
    const { allowed: canEdit } = usePermission('edit_own_content');
    const providerConfig = getHeterogeneousAgentClientConfig(provider.type);
    const defaultCommand = providerConfig?.command || '';
    const resolvedCommand = provider.command?.trim() || defaultCommand;
    const isUsingCustomCommand = resolvedCommand !== defaultCommand;
    const [status, setStatus] = useState<BinaryStatus | undefined>();
    const [auth, setAuth] = useState<ClaudeAuthStatus | null>(null);
    const [commandInput, setCommandInput] = useState(resolvedCommand);
    const [detecting, setDetecting] = useState(true);
    const [isEditingCommand, setIsEditingCommand] = useState(false);
    const [savingCommand, setSavingCommand] = useState(false);
    const commandInputRef = useRef<HTMLInputElement | null>(null);

    const displayName = providerConfig?.title || provider.type;
    const AgentIcon = providerConfig?.icon;
    const showCliInstallGuide =
      (provider.type === 'claude-code' || provider.type === 'codex') &&
      !detecting &&
      !status?.available &&
      !isUsingCustomCommand;

    const fetchAuth = useCallback(async () => {
      if (provider.type !== 'claude-code') {
        setAuth(null);
        return;
      }

      try {
        const result = await binaryService.getClaudeAuthStatus(resolvedCommand);
        setAuth(result);
      } catch (error) {
        console.warn('[HeterogeneousAgentStatusCard] Failed to get Claude auth status:', error);
        setAuth(null);
      }
    }, [provider.type, resolvedCommand]);

    const detect = useCallback(async () => {
      // Remote platform agents (openclaw, hermes, amp, opencode, …) have no local CLI to detect.
      if (isRemoteHeterogeneousType(provider.type) || !isDesktop || !resolvedCommand) {
        setDetecting(false);
        return;
      }

      setDetecting(true);
      try {
        const result = await binaryService.detectHeterogeneousAgentCommand({
          agentType: provider.type,
          command: resolvedCommand,
        });
        setStatus(result);
        if (result.available) {
          void fetchAuth();
        } else {
          setAuth(null);
        }
      } catch (error) {
        console.error('[HeterogeneousAgentStatusCard] Failed to detect CLI:', error);
        setStatus({ available: false, error: (error as Error).message });
        setAuth(null);
      } finally {
        setDetecting(false);
      }
    }, [fetchAuth, provider.type, resolvedCommand]);

    useEffect(() => {
      void detect();
    }, [detect]);

    useEffect(() => {
      setCommandInput(resolvedCommand);
    }, [resolvedCommand]);

    useEffect(() => {
      if (!isEditingCommand) return;

      const focusCommandInput = () => {
        commandInputRef.current?.focus();
        commandInputRef.current?.select();
      };

      const timer = window.setTimeout(focusCommandInput, 0);

      return () => {
        window.clearTimeout(timer);
      };
    }, [isEditingCommand]);

    const startEditingCommand = useCallback(() => {
      if (!canEdit) return;
      if (savingCommand) return;

      setCommandInput(resolvedCommand);
      setIsEditingCommand(true);
    }, [canEdit, resolvedCommand, savingCommand]);

    const cancelEditingCommand = useCallback(() => {
      setCommandInput(resolvedCommand);
      setIsEditingCommand(false);
    }, [resolvedCommand]);

    const commitCommand = useCallback(async () => {
      if (!canEdit) return;

      const normalizedCommand = commandInput.trim() || defaultCommand;
      setCommandInput(normalizedCommand);

      if (!normalizedCommand || normalizedCommand === resolvedCommand || savingCommand) {
        setIsEditingCommand(false);
        return;
      }

      try {
        setSavingCommand(true);
        await onCommandChange?.(normalizedCommand);
        setIsEditingCommand(false);
      } finally {
        setSavingCommand(false);
      }
    }, [canEdit, commandInput, defaultCommand, onCommandChange, resolvedCommand, savingCommand]);

    const renderStatusTag = () => {
      if (detecting) {
        return (
          <Tag color="default" style={{ marginInlineEnd: 0 }}>
            {t('settingSystemTools.detecting')}
          </Tag>
        );
      }

      if (!status || !status.available) {
        return (
          <Tag color="error" style={{ marginInlineEnd: 0 }}>
            {t('settingSystemTools.status.unavailable')}
          </Tag>
        );
      }

      return (
        <Tag color="success" style={{ marginInlineEnd: 0 }}>
          {t('settingSystemTools.status.available')}
        </Tag>
      );
    };

    const renderStatusMeta = () => {
      if (detecting) {
        return (
          <Flexbox horizontal align="center" gap={8}>
            <Icon spin icon={Loader2Icon} size={16} style={{ opacity: 0.6 }} />
            <Text className={styles.metaText}>
              {t('heterogeneousStatus.detecting', { name: displayName })}
            </Text>
          </Flexbox>
        );
      }

      if (!status || !status.available) {
        return (
          <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
            <Icon color="var(--ant-color-error)" icon={XCircle} size={16} />
            <Text className={styles.unavailableText}>
              {t('heterogeneousStatus.unavailable', { name: displayName })}
            </Text>
          </Flexbox>
        );
      }

      return (
        <Flexbox horizontal align="center" className={styles.metaRow} gap={8}>
          {status.version && (
            <Tag color="processing" style={{ marginInlineEnd: 0 }}>
              {status.version}
            </Tag>
          )}
          {status.path && (
            <Tooltip title={status.path}>
              <Flexbox horizontal align="center" className={styles.pathWrap} gap={4}>
                <Text ellipsis className={styles.path}>
                  {status.path}
                </Text>
                <CopyButton content={status.path} size="small" />
              </Flexbox>
            </Tooltip>
          )}
        </Flexbox>
      );
    };

    const renderCommandEditor = () => {
      return (
        <div className={`${styles.detailRow} ${styles.commandField}`}>
          <Text className={styles.detailLabel}>{t('heterogeneousStatus.command.label')}</Text>
          <div className={styles.detailContent}>
            {isEditingCommand ? (
              <div className={styles.commandInputWrap}>
                <Input
                  className={styles.commandInput}
                  disabled={!canEdit || savingCommand}
                  placeholder={t('heterogeneousStatus.command.placeholder')}
                  ref={commandInputRef as never}
                  value={commandInput}
                  onBlur={() => {
                    void commitCommand();
                  }}
                  onChange={(event) => {
                    setCommandInput(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      cancelEditingCommand();
                      return;
                    }

                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void commitCommand();
                    }
                  }}
                />
              </div>
            ) : (
              <div className={styles.commandDisplay}>
                <Text ellipsis className={styles.commandText}>
                  {resolvedCommand}
                </Text>
              </div>
            )}
            {!isEditingCommand && !savingCommand && (
              <Tooltip title={t('heterogeneousStatus.command.edit')}>
                <ActionIcon
                  aria-label={t('heterogeneousStatus.command.edit')}
                  className={`command-edit-button ${styles.commandEditButton}`}
                  disabled={!canEdit}
                  icon={PencilLine}
                  size="small"
                  onClick={startEditingCommand}
                />
              </Tooltip>
            )}
          </div>
        </div>
      );
    };

    const renderAuth = () => {
      if (provider.type !== 'claude-code' || detecting || !status?.available || !auth?.loggedIn)
        return null;

      const authMode =
        auth.authMethod === 'claude.ai' || auth.apiProvider === 'firstParty'
          ? t('heterogeneousStatus.auth.subscription')
          : t('heterogeneousStatus.auth.api');

      return (
        <>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>{t('heterogeneousStatus.auth.label')}</Text>
            <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
              <Text className={styles.accountValue}>{authMode}</Text>
            </Flexbox>
          </div>
          <div className={styles.detailRow}>
            <Text className={styles.detailLabel}>{t('heterogeneousStatus.account.label')}</Text>
            <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
              {auth.email && (
                <Text ellipsis className={styles.accountValue}>
                  {auth.email}
                </Text>
              )}
            </Flexbox>
          </div>
          {auth.subscriptionType && (
            <div className={styles.detailRow}>
              <Text className={styles.detailLabel}>{t('heterogeneousStatus.plan.label')}</Text>
              <Flexbox horizontal align="center" gap={8} style={{ flexWrap: 'wrap' }}>
                <Text className={styles.accountValue}>{auth.subscriptionType.toUpperCase()}</Text>
              </Flexbox>
            </div>
          )}
        </>
      );
    };

    return (
      <Flexbox className={styles.card} gap={12}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleWrap}>
            <div className={styles.cardTitle}>
              {AgentIcon && <AgentIcon size={16} />}
              <Text strong>{`${displayName} CLI`}</Text>
            </div>
            <div className={styles.metaRow}>
              {renderStatusTag()}
              {renderStatusMeta()}
            </div>
          </div>
          <Tooltip title={t('heterogeneousStatus.redetect')}>
            <ActionIcon
              aria-label={t('heterogeneousStatus.redetect')}
              disabled={detecting}
              icon={RefreshCw}
              loading={detecting}
              size="small"
              onClick={detect}
            />
          </Tooltip>
        </div>
        <div className={styles.detailList}>
          {renderCommandEditor()}
          {renderAuth()}
        </div>
        {showCliInstallGuide && (
          <HeterogeneousAgentStatusGuide
            agentType={provider.type}
            variant={'embedded'}
            onOpenSystemTools={() => navigate('/settings/system-tools')}
          />
        )}
      </Flexbox>
    );
  },
);

HeterogeneousAgentStatusCard.displayName = 'HeterogeneousAgentStatusCard';

export default HeterogeneousAgentStatusCard;
