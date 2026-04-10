import { prisma } from '@/lib/db';
import { isAuthenticated, logoutAdmin, deleteButton } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, ArrowLeft, Trash2, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AddButtonForm } from '@/components/AddButtonForm';

export const dynamic = 'force-dynamic';

function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return url; }
}

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
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem' }}>
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
              color: 'rgba(255,255,255,0.7)',
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
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          Aucun bouton configuré.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(buttons as any[]).map((btn) => {
            const domain = getDomain(btn.url);
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

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
                  {/* Icon: emoji or favicon */}
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '1.3rem',
                  }}>
                    {btn.icon ? btn.icon : (
                      <Image src={faviconUrl} alt={btn.name} width={20} height={20} unoptimized />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {btn.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '360px' }}>
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
                    color: 'rgba(255,255,255,0.3)',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b7a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
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
