'use client';

import type { IEditor } from '@lobehub/editor';
import { DiffAction, LITEXML_DIFFNODE_ALL_COMMAND } from '@lobehub/editor';
import { Block, Icon } from '@lobehub/ui';
import { Button, Space } from 'antd';
import { Check, X } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsDark } from '@/hooks/useIsDark';
import { useDocumentStore } from '@/store/document';

import styles from './DiffAllToolbar.module.css';

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

const useIsEditorInit = (editor?: IEditor) => {
  const [isEditInit, setEditInit] = useState<boolean>(!!editor?.getLexicalEditor());

  useEffect(() => {
    if (!editor) return;

    // The editor may have initialized between render and this effect
    // (the Editor canvas mounts earlier and emits 'initialized' synchronously),
    // so re-check before subscribing to avoid missing the event forever.
    if (editor.getLexicalEditor()) {
      setEditInit(true);
      return;
    }

    const onInit = () => {
      setEditInit(true);
    };
    editor.on('initialized', onInit);
    return () => {
      editor.off('initialized', onInit);
    };
  }, [editor]);

  return isEditInit;
};

const useEditorHasPendingDiffs = (editor?: IEditor) => {
  const [hasPendingDiffs, setHasPendingDiffs] = useState(false);
  const isEditInit = useIsEditorInit(editor);

  // Listen to editor state changes to detect diff nodes
  useEffect(() => {
    if (!editor) return;

    const lexicalEditor = editor.getLexicalEditor();

    if (!lexicalEditor || !isEditInit) return;

    const checkForDiffNodes = () => {
      const editorState = lexicalEditor.getEditorState();
      editorState.read(() => {
        // Get all nodes and check if any is a diff node
        const nodeMap = editorState._nodeMap;
        let hasDiffs = false;
        nodeMap.forEach((node) => {
          if (node.getType() === 'diff') {
            hasDiffs = true;
          }
        });
        setHasPendingDiffs(hasDiffs);
      });
    };

    // Check initially
    checkForDiffNodes();

    const unregister = lexicalEditor.registerUpdateListener(() => {
      checkForDiffNodes();
    });
    // Register update listener
    return () => {
      unregister();
    };
  }, [editor, isEditInit]);

  return hasPendingDiffs;
};

interface DiffAllToolbarProps {
  documentId: string;
  editor?: IEditor;
}
const DiffAllToolbar = memo<DiffAllToolbarProps>(({ documentId, editor }) => {
  const { t } = useTranslation('editor');
  const isDarkMode = useIsDark();
  const [performSave, markDirty] = useDocumentStore((s) => [s.performSave, s.markDirty]);

  const hasPendingDiffs = useEditorHasPendingDiffs(editor);

  if (!editor || !hasPendingDiffs) return null;

  const handleSave = async () => {
    markDirty(documentId);
    await performSave(documentId, undefined, { saveSource: 'manual' });
  };

  return (
    <div className={styles.container}>
      <Block
        horizontal
        shadow
        className={cx(styles.toolbar, isDarkMode ? styles.toolbarDark : styles.toolbarLight)}
        gap={8}
        padding={4}
        variant="outlined"
      >
        <Space>
          <Button
            size={'small'}
            type="text"
            onClick={async () => {
              editor.dispatchCommand(LITEXML_DIFFNODE_ALL_COMMAND, {
                action: DiffAction.Reject,
              });
              await handleSave();
            }}
          >
            <Icon icon={X} size={16} />
            {t('modifier.rejectAll')}
          </Button>
          <Button
            color={'default'}
            size={'small'}
            variant="filled"
            onClick={async () => {
              editor.dispatchCommand(LITEXML_DIFFNODE_ALL_COMMAND, {
                action: DiffAction.Accept,
              });
              await handleSave();
            }}
          >
            <Icon color={'green'} icon={Check} size={16} />
            {t('modifier.acceptAll')}
          </Button>
        </Space>
      </Block>
    </div>
  );
});

DiffAllToolbar.displayName = 'DiffAllToolbar';

export default DiffAllToolbar;
