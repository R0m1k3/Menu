/* ──────────────────────────────────────────────────────────────
   EmojiPicker — composant client pour sélectionner un emoji
   utilisé dans le formulaire admin
────────────────────────────────────────────────────────────── */
'use client';

import React, { useState } from 'react';

const QUICK_EMOJIS = [
  '🚀','📊','💼','🔗','📁','📧','📅','🧠',
  '💻','🖥️','📱','🔑','⚙️','🛠️','📈','🌐',
  '💬','🤝','📝','🔒','☁️','🗂️','🎯','📌',
  '🏠','🏢','👥','🔔','✅','❌','💡','🎨',
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          fontSize: '1.6rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 200ms ease',
        }}
        title="Choisir une icône"
      >
        {value || '🔗'}
      </button>

      {/* Dropdown picker */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          zIndex: 100,
          background: 'rgba(30, 10, 35, 0.92)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '1rem',
          width: '268px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            SÉLECTIONNER UNE ICÔNE
          </p>

          {/* Quick emoji grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px', marginBottom: '0.75rem' }}>
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onChange(emoji); setOpen(false); }}
                style={{
                  background: value === emoji ? 'rgba(255,255,255,0.18)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  padding: '4px',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = value === emoji ? 'rgba(255,255,255,0.18)' : 'transparent')}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Manual input */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
            <input
              type="text"
              placeholder="Coller un emoji…"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '0.4rem 0.6rem',
                color: '#fff',
                fontSize: '1rem',
              }}
              maxLength={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}
