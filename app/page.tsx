import { prisma } from '@/lib/db';
import { isConfigured } from '@/app/actions/setup';
import { redirect } from 'next/navigation';
import { MenuButton } from '@/components/MenuButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const configured = await isConfigured();
  if (!configured) redirect('/setup');

  const buttons = await prisma.button.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top controls */}
      <header style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        gap: '0.6rem',
      }}>
        <Link href="/admin" aria-label="Administration" className="settings-btn" style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--card-border)',
          borderRadius: '50%',
          width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 200ms ease'
        }}>
          <Settings size={15} color="var(--fg-secondary)" />
        </Link>
        <style>{`
          .settings-btn:hover {
            background: var(--card-hover-bg) !important;
            border-color: var(--card-hover-border) !important;
          }
        `}</style>
        <ThemeToggle />
      </header>

      {/* Center content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '3rem',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--fg)',
          }}>
            Menu Application
          </h1>
          {buttons.length > 0 && (
            <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', marginTop: '0.4rem', fontWeight: 500 }}>
              {buttons.length} application{buttons.length > 1 ? 's' : ''} disponible{buttons.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Grid */}
        {buttons.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--fg-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <p style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--fg)', marginBottom: '0.5rem' }}>
              Aucune application
            </p>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Ajoutez vos raccourcis depuis l'administration.
            </p>
            <Link href="/admin" style={{
              padding: '0.65rem 1.4rem',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '50px',
              color: 'var(--fg)',
              fontWeight: 600,
              fontSize: '0.88rem',
              backdropFilter: 'blur(12px)',
            }}>
              Configurer →
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            justifyContent: 'center',
            maxWidth: '960px',
          }}>
            {(buttons as any[]).map((btn) => (
              <MenuButton key={btn.id} name={btn.name} url={btn.url} icon={btn.icon} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
