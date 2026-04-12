'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { loginAdmin } from '@/app/actions/admin';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'max(2rem, 4vw)',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .login-container {
          animation: slideUp 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-box {
          animation: bounce 2s ease-in-out infinite;
        }
        .login-btn {
          padding: 0.9rem 1.6rem;
          background: var(--fg);
          color: var(--bg-color);
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(255, 255, 255, 0.2);
        }
        .login-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-alert {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          background: var(--error-bg);
          border: 1.5px solid var(--error);
          border-radius: 12px;
          color: var(--error);
          font-size: 0.85rem;
          animation: slideUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="login-container" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            className="logo-box"
            style={{
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              borderRadius: '20px',
              background: 'var(--card-bg)',
              border: '1.5px solid var(--card-border)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <Lock size={32} color="var(--accent-primary)" strokeWidth={1.5} />
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--fg)',
              marginBottom: '0.5rem',
            }}
          >
            Administration
          </h1>
          <p
            style={{
              color: 'var(--fg-secondary)',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            Accès restreint aux administrateurs
          </p>
        </div>

        <GlassCard
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--fg-muted)',
                  marginBottom: '0.6rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Entrez votre mot de passe"
                autoFocus
                style={{
                  fontSize: '0.95rem',
                }}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="error-alert">
                <AlertCircle size={18} strokeWidth={2} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="login-btn" style={{ marginTop: '0.5rem' }}>
              {loading ? (
                <>
                  <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>…</span> Connexion en cours
                </>
              ) : (
                <>
                  Se connecter <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Footer hint */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--fg-dim)', marginTop: '2rem' }}>
          Utilisez le mot de passe configuré lors de l'installation
        </p>
      </div>
    </div>
  );
}
