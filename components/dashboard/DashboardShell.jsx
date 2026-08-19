'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogoutButton from '@/components/ui/LogoutButton';

const navItems = [
  { href: '/dashboard', label: '📊 Analíticas' },
  { href: '/dashboard/tables', label: '📍 Mis placas' },
  { href: '/dashboard/settings', label: '⚙️ Configuración' },
];

export default function DashboardShell({ businessName, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--surface-0)' }}>
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: 'var(--surface-1)',
          borderRight: '1px solid var(--border-subtle)',
          display: isMobile ? 'none' : 'flex',
          flexDirection: 'column',
          padding: '1.5rem 1rem',
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflowY: 'auto',
        }}
      >
        <Link href="/" style={{ display: 'block', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem' }}>
            Alpha<span style={{ color: 'var(--brand-light)' }}>NFC</span>
          </span>
        </Link>

        {businessName && (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '0.8125rem',
          }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Mi negocio</p>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              {businessName}
            </p>
          </div>
        )}

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} active={pathname === item.href} onNavigate={() => setMobileOpen(false)} />
          ))}
        </nav>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <LogoutButton />
        </div>
      </aside>

      {isMobile && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.9rem 1rem',
            background: 'rgba(15, 14, 23, 0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <Link href="/" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>
              Alpha<span style={{ color: 'var(--brand-light)' }}>NFC</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '55%' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {businessName || 'Mi negocio'}
              </span>
              <button
                type="button"
                aria-label="Abrir menú"
                onClick={() => setMobileOpen((prev) => !prev)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '1.35rem',
                  lineHeight: 1,
                }}
              >
                ☰
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(9, 9, 12, 0.56)',
                zIndex: 45,
              }}
            />
          )}

          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '82%',
              maxWidth: '300px',
              background: 'var(--surface-1)',
              borderRight: '1px solid var(--border-subtle)',
              zIndex: 50,
              padding: '5.5rem 1rem 1rem',
              transform: mobileOpen ? 'translateX(0)' : 'translateX(-105%)',
              transition: 'transform 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {navItems.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} active={pathname === item.href} onNavigate={() => setMobileOpen(false)} mobile />
            ))}

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <LogoutButton />
            </div>
          </aside>
        </>
      )}

      <div style={{
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        background: 'var(--surface-0)',
        paddingTop: isMobile ? '72px' : 0,
      }}>
        {children}
      </div>
    </div>
  );
}

function NavItem({ href, label, active = false, onNavigate, mobile = false }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      style={{
        display: 'block',
        padding: mobile ? '0.8rem 0.75rem' : '0.625rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
        border: active ? '1px solid rgba(167, 139, 250, 0.25)' : '1px solid transparent',
        fontSize: mobile ? '0.95rem' : '0.9rem',
        fontWeight: 500,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {label}
    </Link>
  );
}
