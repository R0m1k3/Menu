'use client';

import React, { useState } from 'react';
import { updateAppTitle } from '@/app/actions/admin';
import { Type, Check } from 'lucide-react';

interface EditTitleFormProps {
  currentTitle: string;
}

export function EditTitleForm({ currentTitle }: EditTitleFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    try {
      await updateAppTitle(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 45,
        background: 'var(--card-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid var(--card-border)',
        borderRadius: '20px',
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        transition: 'all 300ms ease',
        animation: 'fadeInUp 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms both',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .save-title-btn {
          padding: 0.8rem 1.4rem;
          background: var(--success);
          border: 1.5px solid var(--success);
          color: #fff;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .save-title-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(50, 215, 75, 0.3);
          background: #38e55f;
        }
        .save-title-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .save-title-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .save-title-btn.success {
          animation: successPulse 400ms ease;
          background: var(--success);
        }
      `}</style>

      <h2
        style={{
          fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)',
          fontWeight: 800,
          color: 'var(--fg-muted)',
          marginBottom: 'clamp(1rem, 2vw, 1.25rem)',
          letterSpacing: '0.09em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textTransform: 'uppercase',
        }}
      >
        <Type size={14} strokeWidth={2} /> Titre de l'application
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'clamp(0.75rem, 2vw, 1rem)',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--fg-muted)',
              marginBottom: '0.6rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Titre affiché
          </label>
          <input name="title" type="text" defaultValue={currentTitle} required style={{ fontSize: '0.95rem' }} />
        </div>

        <button className={`save-title-btn ${success ? 'success' : ''}`} type="submit" disabled={loading}>
          {loading ? (
            <span>…</span>
          ) : success ? (
            <>
              <Check size={16} strokeWidth={2} /> Enregistré
            </>
          ) : (
            <>
              <Check size={16} strokeWidth={2} /> Enregistrer
            </>
          )}
        </button>
      </form>
    </div>
  );
}
