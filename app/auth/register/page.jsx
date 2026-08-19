'use client';

/**
 * Register page — Create account + first business in one flow.
 * Step 1: Supabase auth.signUp()
 * Step 2: Insert a row into `businesses` with the provided business name.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

/** Convert a business name to a URL-safe slug */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // remove accent marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    businessName: '',
    email:        '',
    password:     '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Instantiate inside the handler — safe for SSG (no module-level call)
    const supabase = getSupabaseBrowserClient();

    // 1. Create the Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message === 'User already registered'
        ? 'Este correo ya tiene una cuenta. Inicia sesión.'
        : 'Error al crear la cuenta. Inténtalo de nuevo.');
      setLoading(false);
      return;
    }

    // 2. Insert the business row linked to the new user
    const userId = authData.user?.id;
    if (userId) {
      const { error: bizError } = await supabase.from('businesses').insert({
        user_id: userId,
        name:    form.businessName,
        slug:    slugify(form.businessName) + '-' + userId.slice(0, 6),
      });

      if (bizError) {
        setError('Cuenta creada, pero hubo un problema registrando tu negocio. Contacta soporte.');
        setLoading(false);
        return;
      }
    }

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
            Crea tu cuenta y registra tu negocio
          </p>
        </div>

        {/* Card */}
        <div className="glass animate-fade-up" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label" htmlFor="businessName">Nombre de tu negocio</label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                className="input"
                placeholder="Ej. Café Luna, Restaurante El Patio…"
                value={form.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="tucorreo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" style={{ color: 'var(--brand-light)', fontWeight: 500 }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
