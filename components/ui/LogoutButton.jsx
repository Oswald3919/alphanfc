'use client';

/**
 * LogoutButton — Signs out via Supabase browser client then redirects.
 * Must be a Client Component because it uses onClick and browser state.
 */
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router  = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/auth/login');
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        width: '100%',
        padding: '0.625rem 0.75rem',
        background: 'transparent',
        border: 'none',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        fontWeight: 600,
        textAlign: 'left',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'color 0.15s, background 0.15s',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255, 85, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-muted)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <LogOut size={16} strokeWidth={1.8} />
      <span>Cerrar sesión</span>
    </button>
  );
}
