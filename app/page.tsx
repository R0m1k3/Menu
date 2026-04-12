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

  const titleConfig = await prisma.config.findUnique({ where: { id: 'app_title' } });
  const appTitle = titleConfig?.value || 'Menu Application';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .header-btn {
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1.5px solid var(--card-border);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, background, border-color;
        }
        .header-btn:hover {
          background: var(--card-hover-bg);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 212, 255, 0.15);
        }
        .header-btn:active {
          transform: scale(0.95);
        }
        .page-header {
          animation: slideDown 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .page-title {
          animation: fadeInScale 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms both;
        }
        .page-subtitle {
          animation: fadeInScale 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms both;
        }
        .empty-state {
          animation: fadeInScale 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms both;
        }
        .config-btn {
          padding: 0.75rem 1.6rem;
          background: var(--accent-primary);
          border: 1.5px solid var(--accent-primary);
          border-radius: 12px;
          color: #000;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
        }
        .config-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 212, 255, 0.3);
          background: #00e5ff;
        }
        .config-btn:active {
          transform: scale(0.98);
        }
        .buttons-grid {
          animation: fadeInScale 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms both;
        }
      `}</style>

      {/* Top controls */}
      <header className="page-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'max(1.5rem, 2vw) max(2rem, 4vw)',
        gap: '0.8rem',
      }}>
        <div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Link href="/admin" aria-label="Administration" className="header-btn">
            <Settings size={16} color="var(--fg-secondary)" strokeWidth={1.8} />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Center content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'max(2rem, 4vw)',
        gap: '2.5rem',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 className="page-title" style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--fg)',
            lineHeight: 1.2,
            marginBottom: '0.8rem',
          }}>
            {appTitle}
          </h1>
          {buttons.length > 0 && (
            <p className="page-subtitle" style={{
              color: 'var(--fg-secondary)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}>
              {buttons.length} application{buttons.length > 1 ? 's' : ''} disponible{buttons.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Grid or Empty State */}
        {buttons.length === 0 ? (
          <div className="empty-state" style={{
            textAlign: 'center',
            color: 'var(--fg-muted)',
            padding: '2rem',
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              marginBottom: '1.5rem',
              opacity: 0.7,
            }}>🔗</div>
            <p style={{
              fontWeight: 700,
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--fg)',
              marginBottom: '0.8rem',
            }}>
              Aucune application
            </p>
            <p style={{
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
              marginBottom: '2rem',
              color: 'var(--fg-muted)',
            }}>
              Ajoutez vos raccourcis depuis l'administration.
            </p>
            <Link href="/admin" className="config-btn">
              Configurer →
            </Link>
          </div>
        ) : (
          <div className="buttons-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(1rem, 3vw, 1.5rem)',
            justifyContent: 'center',
            maxWidth: '1000px',
            width: '100%',
            padding: '0 1rem',
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
