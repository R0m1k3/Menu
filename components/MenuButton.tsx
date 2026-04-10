'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Globe } from 'lucide-react';
import { GlassCard } from './GlassCard';
import styles from './MenuButton.module.css';

interface MenuButtonProps {
  name: string;
  url: string;
}

/**
 * Extract base domain from URL for favicon fetch.
 */
function getDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return url;
  }
}

/**
 * MenuButton component displaying a favicon and app name.
 * Favicons are fetched from Google's favicon CDN.
 */
export const MenuButton: React.FC<MenuButtonProps> = ({ name, url }) => {
  const domain = getDomain(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const [faviconError, setFaviconError] = useState(false);

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className={styles.menuButton}>
      <GlassCard hoverable className={styles.menuButton}>
        <ArrowUpRight size={16} className={styles.arrowIcon} />

        <div className={styles.faviconWrapper}>
          {!faviconError ? (
            <Image
              src={faviconUrl}
              alt={`${name} icon`}
              width={40}
              height={40}
              className={styles.favicon}
              onError={() => setFaviconError(true)}
              unoptimized
            />
          ) : (
            <div className={styles.faviconFallback}>
              <Globe size={28} />
            </div>
          )}
        </div>

        <span className={styles.label}>{name}</span>
      </GlassCard>
    </Link>
  );
};
