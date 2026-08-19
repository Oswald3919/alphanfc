'use client';

/**
 * Login page — Sign in with email + password via Supabase Auth.
 * Uses the browser client so the session cookie is set client-side,
 * then refreshes to /dashboard (middleware will validate it server-side).
 */
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Instantiate inside the handler — safe for SSG (no module-level call)
    const supabase = getSupabaseBrowserClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Correo o contraseña incorrectos. Inténtalo de nuevo.');
      setLoading(false);
      return;
    }

    // Refresh so middleware re-evaluates the session cookie
    router.refresh();
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.2) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem' }}>
            Alpha<span style={{ color: 'var(--brand-light)' }}>NFC</span>
          </Link>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Card */}
        <div className="glass animate-fade-up" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ¿Aún no tienes cuenta?{' '}
          <Link href="/auth/register" style={{ color: 'var(--brand-light)', fontWeight: 500 }}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
