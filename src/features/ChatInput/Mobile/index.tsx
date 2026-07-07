'use client';

import { ChatInput, ChatInputActionBar } from '@lobehub/editor/react';
import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import ChatInputNotice from '@/features/ChatInput/ChatInputNotice';
import { useChatInputStore } from '@/features/ChatInput/store';
import dynamic from '@/libs/next/dynamic';

import ActionBar from '../ActionBar';
import InputEditor from '../InputEditor';
import SendArea from '../SendArea';
import stylesModule from './index.module.css';

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

const FilePreview = dynamic(() => import('./FilePreview'), { ssr: false });
const styles = stylesModule;

const DesktopChatInput = memo(() => {
  const [slashMenuRef, expand] = useChatInputStore((s) => [s.slashMenuRef, s.expand]);
  const leftActions = useChatInputStore((s) => s.leftActions);

  const fileNode = leftActions.flat().includes('fileUpload') && <FilePreview />;

  return (
    <>
      {!expand && fileNode}
      <Flexbox
        className={cx(styles.container, expand && styles.fullscreen)}
        gap={8}
        paddingBlock={'0 12px'}
        paddingInline={12}
      >
        <ChatInputNotice />
        <ChatInput
          fullscreen={expand}
          header={<ChatInputActionBar left={<ActionBar />} />}
          slashMenuRef={slashMenuRef}
          footer={
            <ChatInputActionBar
              left={<div />}
              right={<SendArea />}
              style={{
                paddingRight: 8,
              }}
            />
          }
        >
          {expand && fileNode}
          <InputEditor defaultRows={1} />
        </ChatInput>
      </Flexbox>
    </>
  );
});

DesktopChatInput.displayName = 'DesktopChatInput';

export default DesktopChatInput;
