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
        border: '1px solid var(--card-hover-border)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.8rem',
        alignItems: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      }}>
         <IconPicker iconName={iconName} color={iconColor} onIconChange={setIconName} onColorChange={setIconColor} />
         
         <div style={{ flex: '1 1 120px' }}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" required style={{ padding: '0.6rem 0.8rem' }} />
         </div>
         
         <div style={{ flex: '2 1 200px' }}>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required style={{ padding: '0.6rem 0.8rem' }} />
         </div>

         <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
            <button onClick={handleCancel} disabled={loading} style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--fg-secondary)', borderRadius: '10px', padding: '0.5rem', transition: 'background 200ms'
            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--card-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--card-bg)'}>
              <X size={18} />
            </button>
            <button onClick={handleSave} disabled={loading} style={{
              background: 'var(--success)', border: 'none', color: '#fff', borderRadius: '10px', padding: '0.5rem', cursor: 'pointer', transition: 'opacity 200ms', opacity: loading ? 0.6 : 1
            }}>
              <Check size={18} />
            </button>
         </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '0.85rem 1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      transition: 'all 200ms ease',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--card-hover-bg)'; e.currentTarget.style.borderColor = 'var(--card-hover-border)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card-bg)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <div style={{
          width: '42px', height: '42px',
          borderRadius: '12px',
          background: 'var(--accent-btn-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconComponent size={22} color={parsed.color} strokeWidth={1.7} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {button.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--fg-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '380px' }}>
            {button.url}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
        <button onClick={() => setIsEditing(true)} style={{
          background: 'transparent',
          color: 'var(--fg-muted)',
          padding: '0.45rem',
          borderRadius: '8px',
          transition: 'all 200ms',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
        >
          <Edit2 size={16} />
        </button>
        
        <form action={async () => { await deleteButton(button.id); }}>
          <button type="submit" style={{
            background: 'transparent',
            color: 'var(--fg-muted)',
            padding: '0.45rem',
            borderRadius: '8px',
            transition: 'all 200ms',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
          >
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
