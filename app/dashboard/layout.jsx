/**
 * Dashboard Layout
 * Renders the persistent sidebar/topbar shell for all /dashboard/* pages.
 * Auth guard is handled by middleware; this layout can trust the user is authenticated.
 */
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/ui/LogoutButton';

export const metadata = { title: 'Panel de Control | AlphaNFC' };

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  // Fetch the authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the business name for the sidebar header
  const { data: business } = await supabase
    .from('businesses')
    .select('name')
    .eq('user_id', user.id)
    .single();

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        position: 'sticky',
        top: 0,
        height: '100dvh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'block', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem' }}>
            Alpha<span style={{ color: 'var(--brand-light)' }}>NFC</span>
          </span>
        </Link>

        {/* Business badge */}
        {business && (
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
              {business.name}
            </p>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavItem href="/dashboard" label="📊 Analíticas" />
          <NavItem href="/dashboard/tables" label="📍 Mis placas" />
          <NavItem href="/dashboard/settings" label="⚙️ Configuración" />
        </nav>

        {/* Logout */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <div style={{ flex: 1, width: '100%', overflowY: 'auto', background: 'var(--surface-0)' }}>
        {children}
      </div>
    </div>
  );
}

function NavItem({ href, label }) {
  return (
    <Link href={href} style={{
      display: 'block',
      padding: '0.625rem 0.75rem',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'background 0.15s, color 0.15s',
    }}>
      {label}
    </Link>
  );
}

