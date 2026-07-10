'use client';

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import styles from './ui.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  actions?: React.ReactNode;
}

const ChevronIcon: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Card: React.FC<CardProps> = ({
  children,
  title,
  className,
  collapsible = false,
  defaultCollapsed = false,
  actions,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);

  const isOpen = !collapsed;

  // Measure content height for smooth animation
  useEffect(() => {
    if (!collapsible) return;
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      // Temporarily set maxHeight to scrollHeight for animation, then auto
      setMaxHeight(`${el.scrollHeight}px`);
      const timeout = setTimeout(() => {
        setMaxHeight(undefined); // allow dynamic growth once opened
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      // First set explicit maxHeight so the transition fires from a real value
      setMaxHeight(`${el.scrollHeight}px`);
      // Force reflow, then collapse
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMaxHeight('0px');
        });
      });
    }
  }, [isOpen, collapsible]);

  const handleToggle = useCallback(() => {
    if (!collapsible) return;
    setCollapsed((prev) => !prev);
  }, [collapsible]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!collapsible) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    },
    [collapsible]
  );

  const hasHeader = Boolean(title) || Boolean(actions);

  return (
    <div className={`${styles.card} ${className || ''}`}>
      {hasHeader && (
        <div
          className={`${styles.cardHeader} ${
            collapsible ? styles.cardHeaderCollapsible : ''
          } ${styles.cardHasHeader}`}
          onClick={collapsible ? handleToggle : undefined}
          onKeyDown={collapsible ? handleKeyDown : undefined}
          role={collapsible ? 'button' : undefined}
          tabIndex={collapsible ? 0 : undefined}
          aria-expanded={collapsible ? isOpen : undefined}
        >
          <div className={styles.cardHeaderLeft}>
            {collapsible && (
              <span
                className={`${styles.cardChevron} ${
                  isOpen ? styles.cardChevronOpen : ''
                }`}
              >
                <ChevronIcon />
              </span>
            )}
            {title && <span className={styles.cardTitle}>{title}</span>}
          </div>
          {actions && (
            <div
              className={styles.cardActions}
              onClick={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </div>
      )}

      {collapsible ? (
        <div
          ref={contentRef}
          className={`${styles.cardBody} ${
            isOpen ? styles.cardBodyOpen : styles.cardBodyClosed
          }`}
          style={
            maxHeight !== undefined ? { maxHeight, overflow: 'hidden' } : undefined
          }
          aria-hidden={!isOpen}
        >
          <div
            className={`${styles.cardContent} ${
              !hasHeader ? styles.cardContentNoTitle : ''
            }`}
          >
            {children}
          </div>
        </div>
      ) : (
        <div
          className={`${styles.cardContent} ${
            !hasHeader ? styles.cardContentNoTitle : ''
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default memo(Card);
