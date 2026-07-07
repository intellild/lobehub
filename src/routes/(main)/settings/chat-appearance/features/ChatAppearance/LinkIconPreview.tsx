'use client';
import { memo } from 'react';
import { Trans } from 'react-i18next';

import { type LobeLinkKind } from '@/features/Conversation/Markdown/plugins/Link/parse';
import LinkRender from '@/features/Conversation/Markdown/plugins/Link/Render';

import styles from './LinkIconPreview.module.css';

interface SampleLinkProps {
  domain?: string;
  href: string;
  kind: LobeLinkKind;
  label: string;
}

// Reuse the real message link renderer so the preview reflects the live
// `enableMessageLinkIcon` setting exactly as chat messages do.
const SampleLink = memo<SampleLinkProps>(({ kind, href, label, domain }) => (
  <LinkRender
    id={`link-icon-preview-${kind}`}
    node={{ properties: { linkDomain: domain, linkHref: href, linkKind: kind, linkLabel: label } }}
    tagName="lobeLink"
    type="element"
  >
    {null}
  </LinkRender>
));

const LinkIconPreview = memo(() => (
  <div className={styles.bubble}>
    <Trans
      i18nKey="settingChatAppearance.linkIcon.previewMessage"
      ns="setting"
      components={{
        repo: (
          <SampleLink
            href="https://github.com/lobehub/lobehub"
            kind="github"
            label="lobehub/lobehub"
          />
        ),
        site: (
          <SampleLink
            domain="lobehub.com"
            href="https://lobehub.com"
            kind="generic"
            label="lobehub.com"
          />
        ),
      }}
    />
  </div>
));

LinkIconPreview.displayName = 'LinkIconPreview';

export default LinkIconPreview;
