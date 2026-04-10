'use client';

import React from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
  as?: any;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  style,
  as: Component = 'div',
  onClick
}) => {
  return (
    <Component 
      className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
