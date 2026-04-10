'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { setupAdmin } from '@/app/actions/setup';
import { Lock } from 'lucide-react';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'var(--accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px var(--accent-glow)',
          }}>
            <Lock size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Configuration
          </h1>
          <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Définissez votre mot de passe administrateur
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
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg-secondary)', marginBottom: '0.5rem' }}>
                Confirmer
              </label>
              <input name="confirm" type="password" required placeholder="••••••••" />
            </div>

            {error && (
              <p style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(255,59,48,0.08)', padding: '0.6rem', borderRadius: '8px' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.4rem', width: '100%' }}>
              {loading ? 'Configuration...' : 'Créer le compte admin →'}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
