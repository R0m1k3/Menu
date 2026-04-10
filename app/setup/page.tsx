'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { setupAdmin } from '@/app/actions/setup';

export default function SetupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await setupAdmin(formData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <GlassCard style={{ width: '100%', maxWidth: '450px' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Configuration Initiale</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--foreground)', opacity: 0.8 }}>
          Définissez le mot de passe maître pour accéder au panel d'administration.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Mot de passe Admin</label>
            <input name="password" type="password" required placeholder="••••••••" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Confirmer le mot de passe</label>
            <input name="confirm" type="password" required placeholder="••••••••" />
          </div>

          {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'var(--accent)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              fontWeight: 600,
              marginTop: '1rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Configuration...' : 'Finaliser la configuration'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
