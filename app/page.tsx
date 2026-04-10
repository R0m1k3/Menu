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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        gap: '0.75rem',
      }}>
        <Link href="/admin" aria-label="Administration" style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 260ms ease',
        }}>
          <Settings size={16} color="rgba(255,255,255,0.8)" />
        </Link>
        <ThemeToggle />
      </header>

      {/* Center content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        {buttons.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>
              Aucune application configurée
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
              Ajoutez vos premiers raccourcis depuis l'administration.
            </p>
            <Link href="/admin" style={{
              padding: '0.7rem 1.5rem',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '50px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
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
            maxWidth: '900px',
          }}>
            {buttons.map((btn: any) => (
              <MenuButton key={btn.id} name={btn.name} url={btn.url} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
