'use client';

import { ActionIcon, Checkbox, Flexbox, Icon, SortableList } from '@lobehub/ui';
import type { InputRef } from 'antd';
import { Input } from 'antd';
import { CircleArrowRight, Trash2 } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useTodoListStore } from './store';
import styles from './TodoItemRow.module.css';

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

interface TodoItemRowProps {
  id: string;
  placeholder?: string;
}

const TodoItemRow = memo<TodoItemRowProps>(({ id, placeholder }) => {
  const { t } = useTranslation('tool');
  const inputRef = useRef<InputRef>(null);
  const defaultPlaceholder = placeholder || t('lobe-agent.todoItem.placeholder');

  // Find item by stable id
  const item = useTodoListStore((s) => s.items.find((item) => item.id === id));
  const text = item?.text ?? '';
  const status = item?.status ?? 'todo';
  const isCompleted = status === 'completed';
  const isProcessing = status === 'processing';

  const focusedId = useTodoListStore((s) => s.focusedId);
  const cursorPosition = useTodoListStore((s) => s.cursorPosition);
  const updateItem = useTodoListStore((s) => s.updateItem);
  const deleteItem = useTodoListStore((s) => s.deleteItem);
  const toggleItem = useTodoListStore((s) => s.toggleItem);
  const focusPrevItem = useTodoListStore((s) => s.focusPrevItem);
  const focusNextItem = useTodoListStore((s) => s.focusNextItem);
  const setFocusedId = useTodoListStore((s) => s.setFocusedId);

  // Focus input when focusedId changes to this item and restore cursor position
  const prevFocusedIdRef = useRef<string | null>(null);
  useEffect(() => {
    // Only restore cursor when focus changes TO this item (not on every cursorPosition change)
    if (focusedId === id && prevFocusedIdRef.current !== id) {
      const input = inputRef.current?.input;
      if (input) {
        input.focus();
        // Clamp cursor position to text length
        const pos = Math.min(cursorPosition, text.length);
        input.setSelectionRange(pos, pos);
      }
    }
    prevFocusedIdRef.current = focusedId;
  }, [focusedId, id, cursorPosition, text.length]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateItem(id, e.target.value);
    },
    [id, updateItem],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursorPos = input.selectionStart ?? 0;

      if (e.key === 'Backspace' && text === '') {
        e.preventDefault();
        focusPrevItem(id, cursorPos);
        deleteItem(id);
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        focusPrevItem(id, cursorPos);
      } else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        focusNextItem(id, cursorPos);
      }
    },
    [id, text, deleteItem, focusPrevItem, focusNextItem],
  );

  const handleFocus = useCallback(() => {
    setFocusedId(id);
  }, [id, setFocusedId]);

  const handleDelete = useCallback(() => {
    focusPrevItem(id, 0);
    deleteItem(id);
  }, [id, deleteItem, focusPrevItem]);

  const handleToggle = useCallback(() => {
    toggleItem(id);
  }, [id, toggleItem]);

  return (
    <Flexbox horizontal align="center" className={styles.itemRow} gap={4} width="100%">
      <SortableList.DragHandle className={cx(styles.dragHandle, 'drag-handle')} size="small" />
      {isProcessing ? (
        <Icon
          icon={CircleArrowRight}
          size={16}
          style={{ color: 'var(--ant-color-info)', cursor: 'pointer', flexShrink: 0 }}
          onClick={handleToggle}
        />
      ) : (
        <Checkbox
          backgroundColor={'var(--ant-color-success)'}
          checked={isCompleted}
          shape={'circle'}
          style={{ borderWidth: 1.5 }}
          onChange={handleToggle}
        />
      )}
      <Input
        className={cx(isCompleted && styles.textCompleted, isProcessing && styles.textProcessing)}
        placeholder={defaultPlaceholder}
        ref={inputRef}
        size="small"
        style={{ flex: 1 }}
        value={text}
        variant="borderless"
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />
      <ActionIcon
        className={cx(styles.deleteIcon, 'delete-icon')}
        icon={Trash2}
        size="small"
        tabIndex={-1}
        onClick={handleDelete}
      />
    </Flexbox>
  );
});

TodoItemRow.displayName = 'TodoItemRow';

export default TodoItemRow;
