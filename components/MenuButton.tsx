'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import styles from './MenuButton.module.css';

interface MenuButtonProps {
  name: string;
  url: string;
  icon?: string | null;
}

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return url; }
}

/**
 * MenuButton — displays emoji icon if set, falls back to Google favicon.
 */
export const MenuButton: React.FC<MenuButtonProps> = ({ name, url, icon }) => {
  const domain = getDomain(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const [faviconError, setFaviconError] = useState(false);

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className={styles.menuButton}>
      <div className={styles.faviconWrapper}>
        {icon ? (
          // Custom emoji icon
          <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{icon}</span>
        ) : !faviconError ? (
          // Auto favicon from Google CDN
          <Image
            src={faviconUrl}
            alt={`${name} favicon`}
            width={48}
            height={48}
            className={styles.favicon}
            onError={() => setFaviconError(true)}
            unoptimized
          />
        ) : (
          <div className={styles.faviconFallback}>
            <Globe size={32} />
          </div>
        )}
      </div>
      <span className={styles.label}>{name}</span>
    </Link>
  );
};
