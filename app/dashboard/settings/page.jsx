import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BusinessSettingsForm from '@/components/dashboard/BusinessSettingsForm';

export const metadata = { title: 'Configuración | AlphaNFC' };

export default async function BusinessSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, google_review_url, menu_url, whatsapp_url')
    .eq('user_id', user.id)
    .single();

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Configuración del negocio</h1>
        <p style={{ color: 'var(--text-muted)' }}>Actualiza la identidad del negocio y los enlaces que se abrirán desde tus tótems.</p>
      </div>

      <BusinessSettingsForm initialBusiness={business ?? {}} />
    </div>
  );
}
