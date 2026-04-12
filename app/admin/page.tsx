import { prisma } from '@/lib/db';
import { isAuthenticated, logoutAdmin, deleteButton } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AddButtonForm } from '@/components/AddButtonForm';
import { AdminButtonRow } from '@/components/AdminButtonRow';
import { EditTitleForm } from '@/components/EditTitleForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');

  const buttons = await prisma.button.findMany({
    orderBy: { order: 'asc' },
  });

  const titleConfig = await prisma.config.findUnique({ where: { id: 'app_title' } });
  const appTitle = titleConfig?.value || 'Menu Application';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-color)',
      padding: 'max(1.5rem, 2vw) max(2rem, 3vw)',
    }}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-header {
          animation: slideDown 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .admin-content {
          animation: fadeInUp 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms both;
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
        .logout-btn {
          padding: 0.6rem 1.2rem;
          background: var(--accent-btn-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid var(--card-border);
          border-radius: 10px;
          color: var(--fg-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: '0.5rem';
          cursor: pointer;
          transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, background, border-color;
        }
        .logout-btn:hover {
          background: var(--error);
          border-color: var(--error);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 69, 58, 0.25);
        }
        .logout-btn:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* Header */}
      <header className="admin-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        maxWidth: '900px',
        margin: '0 auto 3rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <Link href="/" className="header-btn">
            <ArrowLeft size={16} color="var(--fg-secondary)" strokeWidth={1.8} />
          </Link>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--fg)',
              marginBottom: '0.3rem',
            }}>
              Administration
            </h1>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--fg-secondary)',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}>
              {buttons.length} application{buttons.length !== 1 ? 's' : ''} configurée{buttons.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <ThemeToggle />
          <form action={logoutAdmin}>
            <button type="submit" className="logout-btn">
              <LogOut size={14} strokeWidth={2} /> Déconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="admin-content" style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Edit Title Form */}
        <EditTitleForm currentTitle={appTitle} />

        {/* Add form */}
        <AddButtonForm />

        {/* Button list section */}
        {buttons.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: 'var(--fg-muted)',
            fontSize: '0.95rem',
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              opacity: 0.6,
            }}>∅</div>
            <p style={{
              fontWeight: 600,
              color: 'var(--fg-secondary)',
              marginBottom: '0.5rem',
            }}>
              Aucune application configurée
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Commencez par ajouter une application ci-dessus.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--fg-muted)',
              letterSpacing: '0.08em',
              padding: '0 1.2rem 0.5rem',
              textTransform: 'uppercase',
            }}>
              Applications
            </div>
            {(buttons as any[]).map((btn) => (
              <AdminButtonRow key={btn.id} button={btn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
