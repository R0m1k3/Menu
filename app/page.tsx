import { prisma } from '@/lib/db';
import { isConfigured } from '@/app/actions/setup';
import { redirect } from 'next/navigation';
import { MenuButton } from '@/components/MenuButton';
import { ThemeToggle } from '@/components/ThemeToggle';

export default async function Home() {
  const configured = await isConfigured();

  if (!configured) {
    redirect('/setup');
  }

  const buttons = await prisma.button.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <main className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <h1 style={{ marginBottom: 0 }}>Application Menu</h1>
        <ThemeToggle />
      </header>

      {buttons.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <p style={{ opacity: 0.6 }}>Aucune application configurée. Rendez-vous dans le panel admin.</p>
          <a href="/admin" style={{ color: 'var(--accent)', marginTop: '1rem', display: 'inline-block' }}>Accéder à l'administration</a>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {buttons.map((btn: any) => (
            <MenuButton 
              key={btn.id} 
              name={btn.name} 
              url={btn.url} 
              iconName="ExternalLink" 
            />
          ))}
        </div>
      )}
    </main>
  );
}
