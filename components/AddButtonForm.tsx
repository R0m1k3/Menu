'use client';

import React, { useState } from 'react';
import { addButton } from '@/app/actions/admin';
import { IconPicker } from '@/components/IconPicker';
import { serializeIcon } from '@/lib/lucideIcons';
import { PlusCircle } from 'lucide-react';

export function AddButtonForm() {
  const [iconName, setIconName] = useState('Globe');
  const [iconColor, setIconColor] = useState('#22d3ee');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('icon', serializeIcon(iconName, iconColor));
    try {
      await addButton(formData);
      (e.target as HTMLFormElement).reset();
      setIconName('Globe');
      setIconColor('#22d3ee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 50,
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
        <PlusCircle size={14} /> AJOUTER UNE APPLICATION
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Icon picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.45rem', letterSpacing: '0.06em' }}>
            ICÔNE
          </label>
          <IconPicker
            iconName={iconName}
            color={iconColor}
            onIconChange={setIconName}
            onColorChange={setIconColor}
          />
        </div>

        {/* Name */}
        <div style={{ flex: '1 1 140px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.45rem', letterSpacing: '0.06em' }}>
            NOM
          </label>
          <input name="name" type="text" placeholder="Ex: Slack, Notion…" required />
        </div>

        {/* URL */}
        <div style={{ flex: '2 1 240px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.45rem', letterSpacing: '0.06em' }}>
            URL
          </label>
          <input name="url" type="url" placeholder="https://…" required />
        </div>

        <button
          className="add-btn"
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
          {loading ? '…' : 'Ajouter →'}
        </button>
        <style>{`
          .add-btn:hover { background: var(--success) !important; border-color: transparent !important; color: #fff !important; }
        `}</style>
      </form>
    </div>
  );
}
