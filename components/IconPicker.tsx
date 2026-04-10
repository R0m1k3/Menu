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
        className="icon-picker-trigger"
        type="button"
        onClick={() => setOpen(!open)}
        title="Choisir une icône"
        style={{
          width: '56px', height: '56px',
          borderRadius: '14px',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 200ms ease',
        }}
      >
        <SelectedIcon size={28} color={color} strokeWidth={1.8} />
      </button>
      <style>{`
        .icon-picker-trigger:hover { background: var(--card-hover-bg) !important; border-color: var(--card-hover-border) !important; transform: scale(1.05); }
      `}</style>

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
            background: 'var(--bg-color)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid var(--card-border)',
            borderRadius: '18px',
            padding: '1.1rem',
            boxShadow: 'var(--card-shadow)',
          }}>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
              <Search size={14} color="var(--fg-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
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
            <div className="icon-grid" style={{
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
                    className={`icon-btn ${isSelected ? 'selected' : ''}`}
                    type="button"
                    title={name}
                    onClick={() => { onIconChange(name); }}
                    style={{
                      background: isSelected ? 'var(--accent-btn-hover)' : 'transparent',
                      border: isSelected ? '1px solid var(--card-border)' : '1px solid transparent',
                      borderRadius: '8px',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 120ms',
                    }}
                  >
                    <Icon size={18} color={isSelected ? color : 'var(--fg-secondary)'} strokeWidth={1.7} />
                  </button>
                );
              })}
              <style>{`
                .icon-btn:hover:not(.selected) { background: var(--accent-btn-bg) !important; }
              `}</style>
            </div>

            {/* Color palette */}
            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.85rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                COULEUR
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ICON_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className="color-btn"
                    type="button"
                    title={c.label}
                    onClick={() => onColorChange(c.value)}
                    style={{
                      width: '26px', height: '26px',
                      borderRadius: '50%',
                      background: c.value,
                      border: color === c.value
                        ? `2px solid var(--fg)`
                        : '2px solid transparent',
                      boxShadow: color === c.value ? `0 0 0 2px var(--card-border)` : 'none',
                      cursor: 'pointer',
                      transition: 'transform 150ms',
                    }}
                  />
                ))}
                <style>{`
                  .color-btn:hover { transform: scale(1.15) !important; }
                `}</style>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
