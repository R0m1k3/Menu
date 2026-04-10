'use client';

import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { GlassCard } from './GlassCard';
import styles from './MenuButton.module.css';

interface MenuButtonProps {
  name: string;
  url: string;
  iconName?: keyof typeof Icons;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ name, url, iconName = 'ExternalLink' }) => {
  const Icon = (Icons[iconName] as React.ElementType) || Icons.ExternalLink;

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <GlassCard hoverable className={styles.menuButton}>
        <div className={styles.iconWrapper}>
          <Icon size={32} />
        </div>
        <span className={styles.label}>{name}</span>
      </GlassCard>
    </Link>
  );
};
