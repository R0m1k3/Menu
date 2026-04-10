'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { loginAdmin } from '@/app/actions/admin';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await loginAdmin(formData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <GlassCard style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Accès Admin</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Mot de passe</label>
            <input name="password" type="password" required placeholder="••••••••" />
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
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
