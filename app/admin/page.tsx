import { prisma } from '@/lib/db';
import { isAuthenticated, logoutAdmin, deleteButton } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AddButtonForm } from '@/components/AddButtonForm';
import { ICON_MAP, parseIcon } from '@/lib/lucideIcons';
import { Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');

  const buttons = await prisma.button.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 2rem', maxWidth: '860px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={15} color="rgba(255,255,255,0.8)" />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
              Administration
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
              {buttons.length} application{buttons.length !== 1 ? 's' : ''} configurée{buttons.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ThemeToggle />
          <form action={logoutAdmin}>
            <button type="submit" style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50px',
              padding: '0.45rem 0.9rem',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.82rem',
              fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <LogOut size={13} /> Déconnexion
            </button>
          </form>
        </div>
      </header>

      {/* Add form */}
      <AddButtonForm />

      {/* Button list */}
      {buttons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
          Aucun bouton configuré.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(buttons as any[]).map((btn) => {
            const { name: iconName, color } = parseIcon(btn.icon);
            const IconComponent = ICON_MAP[iconName] || Globe;

            return (
              <div key={btn.id} style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '14px',
                padding: '0.85rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <IconComponent size={22} color={color} strokeWidth={1.7} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {btn.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.38)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '380px' }}>
                      {btn.url}
                    </div>
                  </div>
                </div>

                <form action={async () => {
                  'use server';
                  await deleteButton(btn.id);
                }}>
                  <button type="submit" style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.25)',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    flexShrink: 0,
                    transition: 'color 200ms',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b7a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
