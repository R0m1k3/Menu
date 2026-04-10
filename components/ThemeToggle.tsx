'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: '38px', height: '38px' }} />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Basculer le thème"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: '50%',
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 260ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--card-hover-bg)'; e.currentTarget.style.borderColor = 'var(--card-hover-border)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card-bg)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
    >
      {theme === 'dark'
        ? <Sun size={15} color="var(--fg-secondary)" />
        : <Moon size={15} color="var(--fg-secondary)" />
      }
    </button>
  );
}
