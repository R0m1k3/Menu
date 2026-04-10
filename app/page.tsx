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

  if (!configured) {
    redirect('/setup');
  }

  const buttons = await prisma.button.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="page-container">
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3.5rem',
        paddingTop: '0.5rem',
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
          }}>
            Applications
          </h1>
          {buttons.length > 0 && (
            <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', marginTop: '0.3rem', fontWeight: 400 }}>
              {buttons.length} {buttons.length > 1 ? 'liens configurés' : 'lien configuré'}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/admin" aria-label="Administration" style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Settings size={18} color="var(--fg-secondary)" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Button grid */}
      {buttons.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '8rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}>
            🔗
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Aucune application</p>
            <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem' }}>
              Ajoutez vos premiers liens depuis le panel d'administration.
            </p>
          </div>
          <Link href="/admin" style={{
            padding: '0.7rem 1.4rem',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}>
            Configurer →
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1.25rem',
        }}>
          {buttons.map((btn: any) => (
            <MenuButton key={btn.id} name={btn.name} url={btn.url} />
          ))}
        </div>
      )}
    </div>
  );
}
