import { prisma } from '@/lib/db';
import { isAuthenticated, logoutAdmin, addButton, deleteButton } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { GlassCard } from '@/components/GlassCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Trash2, LogOut, PlusCircle, Globe, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default async function AdminPage() {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect('/admin/login');
  }

  const buttons = await prisma.button.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>

      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" aria-label="Retour" style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ArrowLeft size={16} color="var(--fg-secondary)" />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              Administration
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--fg-secondary)', marginTop: '0.1rem' }}>
              Gérez vos raccourcis d'applications
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />
          <form action={logoutAdmin}>
            <button type="submit" style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '50px',
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--fg-secondary)',
            }}>
              <LogOut size={15} /> Déconnexion
            </button>
          </form>
        </div>
      </header>

      {/* Add form */}
      <GlassCard style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <PlusCircle size={18} color="var(--accent)" />
          Ajouter une application
        </h2>

        <form action={addButton} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-secondary)', marginBottom: '0.4rem' }}>Nom</label>
            <input name="name" type="text" placeholder="Ex: Slack, Notion..." required />
          </div>
          <div style={{ flex: '2 1 280px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg-secondary)', marginBottom: '0.4rem' }}>URL</label>
            <input name="url" type="url" placeholder="https://..." required />
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Ajouter →
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Button list */}
      {buttons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--fg-secondary)', fontSize: '0.9rem' }}>
          Aucun bouton configuré. Ajoutez-en un ci-dessus.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {buttons.map((btn: any) => {
            const domain = getDomainFromUrl(btn.url);
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

            return (
              <GlassCard key={btn.id} style={{
                padding: '0.9rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderRadius: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    <Image src={faviconUrl} alt={btn.name} width={20} height={20} unoptimized />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {btn.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--fg-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                    color: 'var(--fg-secondary)',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    transition: 'color 200ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-secondary)')}
                  >
                    <Trash2 size={17} />
                  </button>
                </form>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
