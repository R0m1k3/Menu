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
        <Link href="/admin" aria-label="Administration" style={{
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Settings size={15} color="rgba(255,255,255,0.7)" />
        </Link>
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
            color: '#fff',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}>
            Menu Application
          </h1>
          {buttons.length > 0 && (
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginTop: '0.4rem', fontWeight: 400 }}>
              {buttons.length} application{buttons.length > 1 ? 's' : ''} disponible{buttons.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Grid */}
        {buttons.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <p style={{ fontWeight: 600, fontSize: '1.05rem', color: '#fff', marginBottom: '0.5rem' }}>
              Aucune application
            </p>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Ajoutez vos raccourcis depuis l'administration.
            </p>
            <Link href="/admin" style={{
              padding: '0.65rem 1.4rem',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: '50px',
              color: '#fff',
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
