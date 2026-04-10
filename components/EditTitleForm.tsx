'use client';

import React, { useState } from 'react';
import { updateAppTitle } from '@/app/actions/admin';
import { Type } from 'lucide-react';

interface EditTitleFormProps {
  currentTitle: string;
}

export function EditTitleForm({ currentTitle }: EditTitleFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateAppTitle(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 45,
      background: 'var(--card-bg)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '1.75rem',
      marginBottom: '2rem',
    }}>
      <h2 style={{
        fontSize: '0.78rem',
        fontWeight: 700,
        color: 'var(--fg-muted)',
        marginBottom: '1.25rem',
        letterSpacing: '0.08em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <Type size={14} /> TITRE DE L'APPLICATION
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.45rem', letterSpacing: '0.06em' }}>
            TITRE AFFICHÉ
          </label>
          <input name="title" type="text" defaultValue={currentTitle} required />
        </div>

        <button
          className="save-title-btn"
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--accent-btn-hover)',
            border: '1px solid var(--card-border)',
            color: 'var(--fg)',
            padding: '0.78rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 200ms ease',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '…' : 'Enregistrer'}
        </button>
        <style>{`
          .save-title-btn:hover { background: var(--success) !important; border-color: transparent !important; color: #fff !important; }
        `}</style>
      </form>
    </div>
  );
}
