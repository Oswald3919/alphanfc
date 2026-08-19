import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TableManager from '@/components/dashboard/TableManager';

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

  const protocol = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const baseUrl = protocol.replace(/\/$/, '');

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1200px' }}>
      <TableManager initialTables={tables ?? []} baseUrl={baseUrl} />
    </div>
  );
}
