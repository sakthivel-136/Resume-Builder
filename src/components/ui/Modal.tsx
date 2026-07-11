'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import styles from './ui.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const CloseIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4L12 12M12 4L4 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CLOSE_DURATION = 180; // ms — matches CSS animation

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Open/Close: sync visibility state with isOpen prop
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else {
      if (visible && !closing) {
        setClosing(true);
        const timer = setTimeout(() => {
          setVisible(false);
          setClosing(false);
        }, CLOSE_DURATION);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, visible, closing]);

  // Close: play exit animation, then unmount
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      onClose();
    }, CLOSE_DURATION);
  }, [onClose]);

  // ESC key
  useEffect(() => {
    if (!visible) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible]);

  // Focus trap: focus the card on open
  useEffect(() => {
    if (visible && cardRef.current) {
      cardRef.current.focus();
    }
  }, [visible]);

  // Overlay click handler — only fires when clicking the overlay itself
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.modalOverlay} ${
          closing ? styles.modalOverlayClosing : ''
        }`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        ref={cardRef}
        className={`${styles.modalCard} ${
          closing ? styles.modalCardClosing : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.modalClose}
            onClick={handleClose}
            aria-label="Close dialog"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>{children}</div>

        {/* Footer actions */}
        {actions && <div className={styles.modalFooter}>{actions}</div>}
      </div>
    </>
  );
};

export default memo(Modal);
