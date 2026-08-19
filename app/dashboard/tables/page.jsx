import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TableManager from '@/components/dashboard/TableManager';
import { getAppBaseUrl } from '@/lib/utils';

export const metadata = { title: 'Placas | AlphaNFC' };

export const revalidate = 60;

export default async function TablesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return (
      <div style={{ padding: '2.5rem', color: 'var(--text-muted)' }}>
        <p>No se encontró un negocio asociado a tu cuenta.</p>
      </div>
    );
  }

  const { data: tables } = await supabase
    .from('tables')
    .select('id, location_name, code, created_at')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  const headerStore = await headers();
  const baseUrl = getAppBaseUrl(headerStore);

  return (
    <div style={{ width: '100%', padding: '2rem 3rem' }}>
      <TableManager initialTables={tables ?? []} baseUrl={baseUrl} />
    </div>
  );
}
