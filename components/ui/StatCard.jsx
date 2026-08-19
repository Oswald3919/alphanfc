/**
 * StatCard — Summary metric card for the dashboard.
 * Server-renderable (no 'use client' needed).
 */
export default function StatCard({ icon, label, value, accent, small = false }) {
  return (
    <div className="stat-card animate-fade-up" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Glow background accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
        borderRadius: '50%',
        transform: 'translate(20px, -20px)',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: '42px', height: '42px',
        borderRadius: 'var(--radius-sm)',
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem',
        marginBottom: '1rem',
      }}>
        {icon}
      </div>

      {/* Label */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.375rem' }}>
        {label}
      </p>

      {/* Value */}
      <p style={{
        fontSize: small ? '1.1rem' : '2rem',
        fontWeight: 800,
        fontFamily: 'Outfit, sans-serif',
        color: 'var(--text-primary)',
        lineHeight: 1.1,
        wordBreak: 'break-word',
      }}>
        {value}
      </p>
    </div>
  );
}
