'use client';

import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { ICON_MAP, parseIcon } from '@/lib/lucideIcons';
import styles from './MenuButton.module.css';

interface MenuButtonProps {
  name: string;
  url: string;
  icon?: string | null;
}

/**
 * MenuButton — renders a Lucide icon (with color) if set,
 * otherwise falls back to the Globe icon.
 */
export const MenuButton: React.FC<MenuButtonProps> = ({ name, url, icon }) => {
  const { name: iconName, color } = parseIcon(icon);
  const IconComponent = ICON_MAP[iconName] || Globe;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className={styles.menuButton}>
      <div className={styles.faviconWrapper}>
        <IconComponent size={44} color={color} strokeWidth={1.6} />
      </div>
      <span className={styles.label}>{name}</span>
    </Link>
  );
};
