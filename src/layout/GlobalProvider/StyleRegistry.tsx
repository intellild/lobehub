'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { type PropsWithChildren } from 'react';

const StyleRegistry = ({ children }: PropsWithChildren) => {
  useServerInsertedHTML(() => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
              html body {background: #f8f8f8;}
              html[data-theme="dark"] body { background-color: #000; }
            `,
        }}
      />
    );
  });

  return children;
};

export default StyleRegistry;
