'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Button, Flexbox } from '@lobehub/ui';
import { createModal } from '@lobehub/ui/base-ui';
import { Input, Spin } from 'antd';
import { ChevronLeft, ChevronRight, Expand, FileText } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsMobile } from '@/hooks/useIsMobile';
import { Document, Page } from '@/libs/pdfjs';

import { containerStyles } from '../style';
import styles from './PdfPreview.module.css';

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

interface FullscreenContentProps {
  initialPage: number;
  pdfDataUri: string;
}

const FullscreenContent = memo<FullscreenContentProps>(({ pdfDataUri, initialPage }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);

  const goToPrev = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const goToNext = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) setPageNumber(page);
  };

  return (
    <div className={styles.fullscreenModal}>
      <div className={styles.fullscreenContent}>
        <Document
          file={pdfDataUri}
          onLoadSuccess={({ numPages: total }: { numPages: number }) => setNumPages(total)}
        >
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={Math.min(window.innerWidth * 0.8, 1000)}
          />
        </Document>
      </div>

      {numPages > 1 && (
        <div className={styles.fullscreenNavigation}>
          <Flexbox horizontal align="center" gap={12}>
            <Button
              className={styles.fullscreenButton}
              disabled={pageNumber <= 1}
              icon={<ChevronLeft size={16} />}
              size="small"
              type="text"
              onClick={goToPrev}
            />
            <Flexbox horizontal align="center" gap={8}>
              <Input
                className={styles.fullscreenPageInput}
                max={numPages}
                min={1}
                size="small"
                type="number"
                value={pageNumber}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) goToPage(value);
                }}
              />
              <span className={styles.fullscreenPageText}>/ {numPages}</span>
            </Flexbox>
            <Button
              className={styles.fullscreenButton}
              disabled={pageNumber >= numPages}
              icon={<ChevronRight size={16} />}
              size="small"
              type="text"
              onClick={goToNext}
            />
          </Flexbox>
        </div>
      )}
    </div>
  );
});

FullscreenContent.displayName = 'PdfFullscreenContent';

const openPdfFullscreenModal = (pdfDataUri: string, initialPage: number) =>
  createModal({
    content: <FullscreenContent initialPage={initialPage} pdfDataUri={pdfDataUri} />,
    footer: null,
    maskClosable: true,
    styles: {
      content: { padding: 0 },
      header: { display: 'none' },
    },
    width: '95vw',
  });

interface PdfPreviewProps {
  loading: boolean;
  onGeneratePdf?: () => void;
  pdfData: string | null;
}

const PdfPreview = memo<PdfPreviewProps>(({ loading, pdfData, onGeneratePdf }) => {
  const localStyles = styles;
  const { t } = useTranslation('chat');
  const isMobile = useIsMobile();

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  if (loading) {
    return (
      <div
        className={cx(containerStyles.preview, containerStyles.previewWide)}
        style={{ padding: 12 }}
      >
        <div className={localStyles.loadingState}>
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} />
          <div className={localStyles.loadingText}>{t('shareModal.generatingPdf')}</div>
        </div>
      </div>
    );
  }

  if (!pdfData) {
    return (
      <div
        className={cx(containerStyles.preview, containerStyles.previewWide)}
        style={{ padding: 12 }}
      >
        <div className={localStyles.emptyState}>
          <Button icon={<FileText size={20} />} size="large" type="primary" onClick={onGeneratePdf}>
            {t('shareModal.generatePdf')}
          </Button>
        </div>
      </div>
    );
  }

  const pdfDataUri = `data:application/pdf;base64,${pdfData}`;

  const handleFullscreen = () => {
    if (pdfData) openPdfFullscreenModal(pdfDataUri, pageNumber);
  };

  return (
    <div className={localStyles.containerWrapper}>
      {pdfData && (
        <Button
          className={localStyles.expandButton}
          icon={<Expand size={16} />}
          size="small"
          type="text"
          onClick={handleFullscreen}
        />
      )}

      <div
        className={cx(
          containerStyles.preview,
          containerStyles.previewWide,
          localStyles.previewContainer,
        )}
      >
        <Document
          file={pdfDataUri}
          loading={
            <div className={localStyles.documentLoading}>
              <Spin />
              <div className={localStyles.loadingText}>{t('shareModal.loadingPdf')}</div>
            </div>
          }
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={isMobile ? 300 : 400}
          />
        </Document>
      </div>

      {pdfData && numPages > 1 && (
        <div className={localStyles.footerNavigation}>
          <Flexbox horizontal align="center" gap={8} justify="center">
            <Button
              disabled={pageNumber <= 1}
              icon={<ChevronLeft size={16} />}
              size="small"
              type="text"
              onClick={goToPrevPage}
            />
            <Flexbox horizontal align="center" gap={4}>
              <Input
                className={localStyles.pageInput}
                max={numPages}
                min={1}
                size="small"
                type="number"
                value={pageNumber}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) goToPage(value);
                }}
              />
              <span className={localStyles.pageNumberText}>/ {numPages}</span>
            </Flexbox>
            <Button
              disabled={pageNumber >= numPages}
              icon={<ChevronRight size={16} />}
              size="small"
              type="text"
              onClick={goToNextPage}
            />
          </Flexbox>
        </div>
      )}
    </div>
  );
});

export default PdfPreview;
