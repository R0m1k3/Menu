'use client';

import React, { useState } from 'react';
import { addButton } from '@/app/actions/admin';
import { EmojiPicker } from '@/components/EmojiPicker';
import { PlusCircle } from 'lucide-react';

export function AddButtonForm() {
  const [icon, setIcon] = useState('🔗');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('icon', icon);
    try {
      await addButton(formData);
      (e.target as HTMLFormElement).reset();
      setIcon('🔗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '20px',
      padding: '1.75rem',
      marginBottom: '2rem',
    }}>
      <h2 style={{
        fontSize: '0.85rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '1.25rem',
        letterSpacing: '0.08em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <PlusCircle size={15} /> AJOUTER UNE APPLICATION
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Emoji picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '0.45rem' }}>
            ICÔNE
          </label>
          <EmojiPicker value={icon} onChange={setIcon} />
        </div>

        {/* Name */}
        <div style={{ flex: '1 1 140px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '0.45rem' }}>
            NOM
          </label>
          <input name="name" type="text" placeholder="Ex: Slack, Notion…" required />
        </div>

        {/* URL */}
        <div style={{ flex: '2 1 240px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '0.45rem' }}>
            URL
          </label>
          <input name="url" type="url" placeholder="https://…" required />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.16)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.22)',
            color: '#fff',
            padding: '0.75rem 1.25rem',
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
      </form>
    </div>
  );
}
