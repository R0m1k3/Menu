'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: '40px', height: '40px' }} />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Basculer le thème"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid var(--card-border)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        will: 'transform, background, border-color',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--card-hover-bg)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 212, 255, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--card-bg)';
        e.currentTarget.style.borderColor = 'var(--card-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
    >
      {theme === 'dark'
        ? <Sun size={16} color="var(--accent-primary)" strokeWidth={1.8} style={{ transition: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
        : <Moon size={16} color="var(--accent-primary)" strokeWidth={1.8} style={{ transition: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
      }
    </button>
  );
}
