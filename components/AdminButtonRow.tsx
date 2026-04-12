'use client';

import React, { useState } from 'react';
import { deleteButton, updateButton } from '@/app/actions/admin';
import { ICON_MAP, parseIcon, serializeIcon } from '@/lib/lucideIcons';
import { Globe, Trash2, Edit2, Check, X } from 'lucide-react';
import { IconPicker } from '@/components/IconPicker';

interface AdminButtonRowProps {
  button: {
    id: number;
    name: string;
    url: string;
    icon: string | null;
  };
}

export function AdminButtonRow({ button }: AdminButtonRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const parsed = parseIcon(button.icon);
  const [iconName, setIconName] = useState(parsed.name);
  const [iconColor, setIconColor] = useState(parsed.color);
  const [name, setName] = useState(button.name);
  const [url, setUrl] = useState(button.url);

  const IconComponent = ICON_MAP[parsed.name] || Globe;

  const handleSave = async () => {
    if (!name || !url) return;
    setLoading(true);
    const formData = new FormData();
    formData.set('id', button.id.toString());
    formData.set('name', name);
    formData.set('url', url);
    formData.set('icon', serializeIcon(iconName, iconColor));

    try {
      await updateButton(formData);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(button.name);
    setUrl(button.url);
    setIconName(parsed.name);
    setIconColor(parsed.color);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{
        position: 'relative',
        zIndex: 40,
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid var(--accent-primary)',
        borderRadius: '16px',
        padding: 'clamp(1rem, 2vw, 1.25rem)',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 2fr auto',
        gap: '0.8rem',
        alignItems: 'flex-end',
        boxShadow: '0 8px 30px rgba(0, 212, 255, 0.15)',
        animation: 'fadeInScale 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .edit-btn, .delete-edit-btn {
            padding: 0.6rem;
            background: var(--card-bg);
            border: 1.5px solid var(--card-border);
            color: var(--fg-secondary);
            border-radius: '10px';
            cursor: pointer;
            transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform, background, border-color;
          }
          .edit-btn:hover {
            background: var(--card-hover-bg);
            border-color: var(--fg-secondary);
            color: var(--fg);
            transform: translateY(-2px);
          }
          .delete-edit-btn {
            background: var(--success);
            border-color: var(--success);
            color: #fff;
          }
          .delete-edit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(50, 215, 75, 0.25);
          }
        `}</style>

        <IconPicker
          iconName={iconName}
          color={iconColor}
          onIconChange={setIconName}
          onColorChange={setIconColor}
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          required
        />

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          required
        />

        <div style={{ display: 'flex', gap: '0.5rem', justifySelf: 'end' }}>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="edit-btn"
            title="Annuler"
          >
            <X size={18} strokeWidth={2} />
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="delete-edit-btn"
            style={{ opacity: loading ? 0.6 : 1 }}
            title="Enregistrer"
          >
            <Check size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid var(--card-border)',
        borderRadius: '16px',
        padding: 'clamp(0.85rem, 2vw, 1.2rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(0.8rem, 2vw, 1.2rem)',
        transition: 'all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform, background, border-color',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--card-hover-bg)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--card-bg)';
        e.currentTarget.style.borderColor = 'var(--card-border)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.8rem, 2vw, 1rem)', minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--accent-btn-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <IconComponent size={22} color={parsed.color} strokeWidth={1.7} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              color: 'var(--fg)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {button.name}
          </div>
          <div
            style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
              color: 'var(--fg-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              marginTop: '0.2rem',
            }}
          >
            {button.url}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            background: 'transparent',
            color: 'var(--fg-muted)',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1.5px solid transparent',
            transition: 'all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'color, border-color, background',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--fg)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--fg-muted)';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.background = 'transparent';
          }}
          title="Éditer"
        >
          <Edit2 size={16} strokeWidth={1.8} />
        </button>

        <form action={async () => { await deleteButton(button.id); }}>
          <button
            type="submit"
            style={{
              background: 'transparent',
              color: 'var(--fg-muted)',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1.5px solid transparent',
              transition: 'all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'color, border-color, background',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--error)';
              e.currentTarget.style.borderColor = 'var(--error)';
              e.currentTarget.style.background = 'rgba(255, 69, 58, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--fg-muted)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.background = 'transparent';
            }}
            title="Supprimer"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </form>
      </div>
    </div>
  );
}
