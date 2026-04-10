'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { loginAdmin } from '@/app/actions/admin';
import { Lock } from 'lucide-react';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'var(--accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px var(--accent-glow)',
          }}>
            <Lock size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Administration
          </h1>
          <p style={{ color: 'var(--fg-secondary)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            Accès restreint aux administrateurs
          </p>
        </div>

        <GlassCard style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg-secondary)', marginBottom: '0.5rem' }}>
                Mot de passe
              </label>
              <input name="password" type="password" required placeholder="••••••••" />
            </div>

            {error && (
              <p style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(255,59,48,0.08)', padding: '0.6rem', borderRadius: '8px' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.4rem', width: '100%' }}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
