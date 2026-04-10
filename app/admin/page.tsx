import { prisma } from '@/lib/db';
import { isAuthenticated, logoutAdmin, addButton, deleteButton } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { GlassCard } from '@/components/GlassCard';
import { Trash2, LogOut, PlusCircle, Globe } from 'lucide-react';

export default async function AdminPage() {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect('/admin/login');
  }

  const buttons = await prisma.button.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <main className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: 0, fontSize: '2rem' }}>Panel d'Administration</h1>
        <form action={logoutAdmin}>
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--foreground)', opacity: 0.7 }}>
            <LogOut size={20} /> Déconnexion
          </button>
        </form>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '3rem', alignItems: 'start' }}>
        {/* Form to add button */}
        <GlassCard>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} color="var(--accent)" /> Ajouter un bouton
          </h2>
          <form action={addButton} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Nom de l'application</label>
              <input name="name" type="text" placeholder="Ex: Slack, Jira..." required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Lien (URL)</label>
              <input name="url" type="url" placeholder="https://..." required />
            </div>
            <button 
              type="submit" 
              style={{ background: 'var(--accent)', color: 'white', padding: '0.8rem', borderRadius: '10px', fontWeight: 600, marginTop: '0.5rem' }}
            >
              Ajouter au menu
            </button>
          </form>
        </GlassCard>

        {/* List of buttons */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Boutons configurés</h2>
          {buttons.length === 0 ? (
            <p style={{ opacity: 0.5 }}>Aucun bouton configuré pour le moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {buttons.map((btn: any) => (
                <GlassCard key={btn.id} style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
                      <Globe size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{btn.name}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{btn.url}</div>
                    </div>
                  </div>
                  
                  <form action={async () => {
                    'use server';
                    await deleteButton(btn.id);
                  }}>
                    <button 
                      type="submit"
                      style={{ background: 'transparent', color: 'var(--error)', padding: '0.5rem', borderRadius: '8px' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </form>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
