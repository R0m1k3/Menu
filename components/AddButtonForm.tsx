'use client';

import React, { useState } from 'react';
import { addButton } from '@/app/actions/admin';
import { IconPicker } from '@/components/IconPicker';
import { serializeIcon } from '@/lib/lucideIcons';
import { PlusCircle, Check } from 'lucide-react';

export function AddButtonForm() {
  const [iconName, setIconName] = useState('Globe');
  const [iconColor, setIconColor] = useState('#22d3ee');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    formData.set('icon', serializeIcon(iconName, iconColor));
    try {
      await addButton(formData);
      (e.target as HTMLFormElement).reset();
      setIconName('Globe');
      setIconColor('#22d3ee');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
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
      border: '1.5px solid var(--card-border)',
      borderRadius: '20px',
      padding: 'clamp(1.5rem, 3vw, 2rem)',
      marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
      transition: 'all 300ms ease',
      animation: 'fadeInUp 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both',
    }}>
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
        .add-btn {
          padding: 0.8rem 1.4rem;
          background: var(--success);
          border: 1.5px solid var(--success);
          color: #fff;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          whiteSpace: nowrap;
          flex-shrink: 0;
          transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, box-shadow;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .add-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(50, 215, 75, 0.3);
          background: #38e55f;
        }
        .add-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .add-btn.success {
          animation: successPulse 400ms ease;
          background: var(--success);
        }
      `}</style>

      <h2 style={{
        fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)',
        fontWeight: 800,
        color: 'var(--fg-muted)',
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
        letterSpacing: '0.09em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        textTransform: 'uppercase',
      }}>
        <PlusCircle size={14} strokeWidth={2} /> Ajouter une application
      </h2>

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 2fr auto',
        gap: 'clamp(0.75rem, 2vw, 1rem)',
        alignItems: 'flex-end',
      }}>
        {/* Icon picker */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--fg-muted)',
            marginBottom: '0.6rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Icône
          </label>
          <IconPicker
            iconName={iconName}
            color={iconColor}
            onIconChange={setIconName}
            onColorChange={setIconColor}
          />
        </div>

        {/* Name */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--fg-muted)',
            marginBottom: '0.6rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Nom
          </label>
          <input
            name="name"
            type="text"
            placeholder="Ex: Slack, Notion, Figma…"
            required
            style={{ fontSize: '0.92rem' }}
          />
        </div>

        {/* URL */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--fg-muted)',
            marginBottom: '0.6rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            URL
          </label>
          <input
            name="url"
            type="url"
            placeholder="https://app.example.com"
            required
            style={{ fontSize: '0.92rem' }}
          />
        </div>

        {/* Submit Button */}
        <button
          className={`add-btn ${success ? 'success' : ''}`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span>…</span>
          ) : success ? (
            <>
              <Check size={16} strokeWidth={2} /> Ajouté
            </>
          ) : (
            <>
              <PlusCircle size={16} strokeWidth={2} /> Ajouter
            </>
          )}
        </button>
      </form>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          form {
            grid-template-columns: auto 1fr !important;
          }
          .add-btn {
            grid-column: 1 / -1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
