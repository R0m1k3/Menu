'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { GlassCard } from './GlassCard';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <GlassCard className="glass" style={{ padding: '0.6rem', border: 'none' }}>
        <div style={{ width: '24px', height: '24px' }}></div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      as="button"
      className="glass" 
      style={{ padding: '0.6rem', cursor: 'pointer' }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </GlassCard>
  );
}
