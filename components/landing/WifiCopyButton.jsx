'use client';

import { useState } from 'react';
import { Check, Copy, Wifi } from 'lucide-react';

export default function WifiCopyButton({ wifiName, wifiPassword }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!wifiPassword) return;
    navigator.clipboard.writeText(wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      background: 'var(--surface-2, #111)',
      border: '1px solid var(--border-subtle, #222)',
      borderRadius: 'var(--radius-md, 8px)',
      padding: '1rem',
      marginBottom: '0.875rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Wifi size={20} color="#ff5500" />
        <span style={{ fontWeight: 600 }}>Wi‑Fi gratis: {wifiName}</span>
      </div>

      {wifiPassword && (
        <button
          type="button"
          onClick={handleCopy}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            background: '#222',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
          <span>{copied ? '¡Contraseña copiada!' : `Copiar clave: ${wifiPassword}`}</span>
        </button>
      )}
    </div>
  );
}
