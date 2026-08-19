/**
 * Dynamic Tracking Route — /t/[code]
 *
 * Server Component that:
 * 1. Resolves the totem `code` → table + business data from Supabase.
 * 2. Inserts a scan row (tracks every visit, anonymous or not).
 * 3. Renders a mobile-first landing page with CTA buttons.
 *
 * Click tracking is handled by a Server Action (actions/track.js)
 * so no client-side JS is needed for analytics.
 */
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { resolveWhatsAppUrl } from '@/lib/utils';
import { trackAndRedirect } from '@/actions/track';
import ActionButton from '@/components/landing/ActionButton';
import WifiCopyButton from '@/components/landing/WifiCopyButton';

export async function generateMetadata({ params }) {
  const { code } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('tables')
    .select('location_name, businesses(name)')
    .eq('code', code)
    .single();

  if (!data) return { title: 'Tótem no encontrado | AlphaNFC' };

  return {
    title: `${data.businesses.name} — ${data.location_name}`,
    description: `Accede al menú, deja una reseña o contacta por WhatsApp a ${data.businesses.name}.`,
  };
}

export default async function TrackingPage({ params }) {
  const { code } = await params;
  const supabase = await createClient();

  // ── 1. Resolve totem code → table + business ──────────────
  const { data: table, error } = await supabase
    .from('tables')
    .select(`
      id,
      location_name,
      businesses (
        name,
        google_review_url,
        menu_url,
        whatsapp_url,
        instagram_url,
        facebook_url,
        tiktok_url,
        website_url,
        phone_number,
        wifi_name,
        wifi_password
      )
    `)
    .eq('code', code.toUpperCase())
    .single();

  // Gracefully handle not-found or DB errors
  if (error || !table) {
    notFound();
  }

  const { id: tableId, location_name, businesses: business } = table;

  await supabase.from('scans').insert({ table_id: tableId });

  const whatsappHref = resolveWhatsAppUrl(business.whatsapp_url);
  const phoneHref = business.phone_number ? `tel:${business.phone_number.replace(/\D/g, '')}` : null;

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '1rem 1rem 2rem',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 85, 0, 0.12) 0%, transparent 65%)',
    }}>
      {/* Brand header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {location_name}
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 800, lineHeight: 1.1 }}>
          {business.name}
        </h1>
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>En línea ahora</span>
        </div>
      </div>

      {/* CTA Buttons — each submits a form to the Server Action */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {business.google_review_url && (
          <ActionButton
            tableId={tableId}
            actionType="google_review"
            redirectUrl={business.google_review_url}
            icon="star"
            label="Dejar reseña en Google"
            color="#ff6b00"
            trackAction={trackAndRedirect}
          />
        )}

        {business.menu_url && (
          <ActionButton
            tableId={tableId}
            actionType="menu"
            redirectUrl={business.menu_url}
            icon="fileText"
            label="Ver menú digital"
            color="#ff8a3d"
            trackAction={trackAndRedirect}
          />
        )}

        {business.instagram_url && (
          <ActionButton
            tableId={tableId}
            actionType="instagram"
            redirectUrl={business.instagram_url}
            icon="instagram"
            label="Ver Instagram"
            color="#ff5500"
            trackAction={trackAndRedirect}
          />
        )}

        {business.facebook_url && (
          <ActionButton
            tableId={tableId}
            actionType="facebook"
            redirectUrl={business.facebook_url}
            icon="facebook"
            label="Ver Facebook"
            color="#1877f2"
            trackAction={trackAndRedirect}
          />
        )}

        {business.tiktok_url && (
          <ActionButton
            tableId={tableId}
            actionType="tiktok"
            redirectUrl={business.tiktok_url}
            icon="tiktok"
            label="Ver TikTok"
            color="#ff0050"
            trackAction={trackAndRedirect}
          />
        )}

        {business.website_url && (
          <ActionButton
            tableId={tableId}
            actionType="website"
            redirectUrl={business.website_url}
            icon="globe"
            label="Visitar sitio web"
            color="#8b5cf6"
            trackAction={trackAndRedirect}
          />
        )}

        {business.phone_number && (
          <ActionButton
            tableId={tableId}
            actionType="phone"
            redirectUrl={phoneHref}
            icon="phone"
            label="Llamar al negocio"
            color="#22c55e"
            trackAction={trackAndRedirect}
          />
        )}

        {business.whatsapp_url && (
          <ActionButton
            tableId={tableId}
            actionType="whatsapp"
            redirectUrl={whatsappHref}
            icon="messageCircle"
            label="Contactar por WhatsApp"
            color="#ff5500"
            trackAction={trackAndRedirect}
          />
        )}

        {business.wifi_name && business.wifi_password && (
          <WifiCopyButton
            wifiName={business.wifi_name}
            wifiPassword={business.wifi_password}
          />
        )}
      </div>

      {/* Powered-by footer */}
      <p style={{ marginTop: '3rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Tecnología por{' '}
        <span style={{ color: 'var(--brand-light)', fontWeight: 600 }}>AlphaNFC</span>
      </p>
    </main>
  );
}
