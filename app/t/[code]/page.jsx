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

  const primaryActions = [];
  if (business.menu_url) {
    primaryActions.push({
      tableId,
      actionType: 'menu',
      redirectUrl: business.menu_url,
      icon: 'fileText',
      label: 'Ver menú digital',
      color: '#ff8a3d',
      variant: 'menu',
    });
  }
  if (business.google_review_url) {
    primaryActions.push({
      tableId,
      actionType: 'google_review',
      redirectUrl: business.google_review_url,
      icon: 'star',
      label: 'Dejar reseña en Google',
      color: '#ff6b00',
    });
  }
  if (business.whatsapp_url) {
    primaryActions.push({
      tableId,
      actionType: 'whatsapp',
      redirectUrl: whatsappHref,
      icon: 'messageCircle',
      label: 'WhatsApp',
      color: '#25d366',
    });
  }

  const secondaryActions = [];
  if (business.instagram_url) secondaryActions.push({ tableId, actionType: 'instagram', redirectUrl: business.instagram_url, icon: 'instagram', label: 'Instagram', color: '#ff5500' });
  if (business.facebook_url) secondaryActions.push({ tableId, actionType: 'facebook', redirectUrl: business.facebook_url, icon: 'facebook', label: 'Facebook', color: '#1877f2' });
  if (business.tiktok_url) secondaryActions.push({ tableId, actionType: 'tiktok', redirectUrl: business.tiktok_url, icon: 'tiktok', label: 'TikTok', color: '#ff0050' });
  if (business.website_url) secondaryActions.push({ tableId, actionType: 'website', redirectUrl: business.website_url, icon: 'globe', label: 'Web', color: '#8b5cf6' });
  if (business.phone_number) secondaryActions.push({ tableId, actionType: 'phone', redirectUrl: phoneHref, icon: 'phone', label: 'Llamar', color: '#22c55e' });

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem 1rem 2rem',
      background: 'radial-gradient(ellipse at top, rgba(255, 120, 35, 0.14), transparent 40%), #0a0a0a',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '0.6rem' }}>
            {location_name}
          </p>
          <h1 style={{ fontSize: 'clamp(1.7rem, 6vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.04em', margin: 0 }}>
            {business.name}
          </h1>
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>En línea ahora</span>
          </div>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {primaryActions.map((action) => (
            <ActionButton
              key={action.actionType}
              tableId={action.tableId}
              actionType={action.actionType}
              redirectUrl={action.redirectUrl}
              icon={action.icon}
              label={action.label}
              color={action.color}
              variant={action.variant || 'primary'}
              trackAction={trackAndRedirect}
            />
          ))}

          {secondaryActions.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap',
              paddingTop: '0.1rem',
            }}>
              {secondaryActions.map((action) => (
                <ActionButton
                  key={action.actionType}
                  tableId={action.tableId}
                  actionType={action.actionType}
                  redirectUrl={action.redirectUrl}
                  icon={action.icon}
                  label={action.label}
                  color={action.color}
                  trackAction={trackAndRedirect}
                  variant="social"
                  compact
                  showLabel={false}
                />
              ))}
            </div>
          )}

          {business.wifi_name && business.wifi_password && (
            <WifiCopyButton
              wifiName={business.wifi_name}
              wifiPassword={business.wifi_password}
            />
          )}
        </div>

        <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Tecnología por{' '}
          <span style={{ color: 'var(--brand-light)', fontWeight: 700 }}>AlphaNFC</span>
        </p>
      </div>
    </main>
  );
}
