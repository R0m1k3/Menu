'use client';

import React, { useState, useMemo } from 'react';
import { ICON_MAP, ICON_NAMES, ICON_COLORS } from '@/lib/lucideIcons';
import { Search } from 'lucide-react';

interface IconPickerProps {
  iconName: string;
  color: string;
  onIconChange: (name: string) => void;
  onColorChange: (color: string) => void;
}

export function IconPicker({ iconName, color, onIconChange, onColorChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredIcons = useMemo(
    () => ICON_NAMES.filter((n) => n.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const SelectedIcon = ICON_MAP[iconName] || ICON_MAP['Globe'];

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Choisir une icône"
        style={{
          width: '56px', height: '56px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 200ms ease',
        }}
      >
        <SelectedIcon size={28} color={color} strokeWidth={1.8} />
      </button>

      {/* Picker panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            zIndex: 100,
            width: '320px',
            background: 'rgba(25, 5, 35, 0.95)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '18px',
            padding: '1.1rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
              <Search size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Rechercher…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: '30px', fontSize: '0.85rem' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Icon grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              maxHeight: '220px',
              overflowY: 'auto',
              marginBottom: '0.85rem',
            }}>
              {filteredIcons.map((name) => {
                const Icon = ICON_MAP[name];
                const isSelected = name === iconName;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => { onIconChange(name); }}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.18)' : 'transparent',
                      border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                      borderRadius: '8px',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 120ms',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Icon size={18} color={isSelected ? color : 'rgba(255,255,255,0.65)'} strokeWidth={1.7} />
                  </button>
                );
              })}
            </div>

            {/* Color palette */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                COULEUR
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ICON_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => onColorChange(c.value)}
                    style={{
                      width: '26px', height: '26px',
                      borderRadius: '50%',
                      background: c.value,
                      border: color === c.value
                        ? '2px solid white'
                        : '2px solid transparent',
                      boxShadow: color === c.value ? '0 0 0 2px rgba(255,255,255,0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'transform 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
