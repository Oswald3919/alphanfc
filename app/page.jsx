import Link from 'next/link';
import { ArrowRight, BarChart3, FileText, MessageCircle, Star } from 'lucide-react';

export const metadata = {
  title: 'AlphaNFC — Tótems NFC y QR con analíticas para tu negocio',
  description:
    'Conecta tus puntos físicos con analíticas en tiempo real. Sin apps. Sin fricción.',
};

export default function HomePage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0, 0, 0, 0.88)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--brand-light)' }}>
          Alpha<span style={{ color: 'var(--text-primary)' }}>NFC</span>
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/auth/login" className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Iniciar sesión
          </Link>
          <Link href="/auth/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            Registrarse gratis
          </Link>
        </div>
      </nav>

      <section style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '5rem 1.5rem 4rem',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 85, 0, 0.12) 0%, transparent 70%)',
      }}>
        <span className="badge badge-violet animate-fade-up" style={{ marginBottom: '1.5rem' }}>
          Ahora disponible para negocios mexicanos
        </span>

        <h1 className="animate-fade-up delay-100" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, maxWidth: '800px', marginBottom: '1.5rem' }}>
          Tu negocio físico,{' '}
          <span className="gradient-text">conectado digitalmente</span>
        </h1>

        <p className="animate-fade-up delay-200" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '560px', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Tótems interactivos con QR y NFC (NTAG213) que registran cada interacción.
          Reseñas en Google, menú digital, WhatsApp — todo desde un escaneo.
        </p>

        <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/auth/register" className="btn-primary" style={{ fontSize: '1.0625rem', padding: '0.875rem 2rem' }}>
            Comenzar ahora — Es gratis
          </Link>
          <Link href="#como-funciona" className="btn-ghost" style={{ fontSize: '1.0625rem', padding: '0.875rem 2rem' }}>
            Cómo funciona <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </section>

      <section id="como-funciona" style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Todo lo que necesitas en un solo tótem
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
          Sin descargar apps. Sin registros complicados. Solo escanear y listo.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: Star, title: 'Reseñas en Google', desc: 'Lleva a tus clientes directo a tu perfil de Google para dejar una reseña con un solo toque.' },
            { icon: FileText, title: 'Menú Digital', desc: 'Comparte tu menú actualizado sin costos de impresión. Cambia precios al instante.' },
            { icon: MessageCircle, title: 'WhatsApp Directo', desc: 'Un botón que abre una conversación en WhatsApp preconfigurada con tu número.' },
            { icon: BarChart3, title: 'Analíticas en tiempo real', desc: 'Sabe cuántas personas escanearon, desde qué mesa y qué acción tomaron.' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem', width: '44px', height: '44px', border: '1px solid rgba(255, 85, 0, 0.3)', background: 'rgba(255, 85, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-light)' }}>
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}>
        © {new Date().getFullYear()} AlphaNFC. Hecho con pasión en México.
      </footer>
    </main>
  );
}
