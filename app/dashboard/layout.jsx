/**
 * Dashboard Layout
 * Renders the persistent sidebar/topbar shell for all /dashboard/* pages.
 * Auth guard is handled by middleware; this layout can trust the user is authenticated.
 */
import { createClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/dashboard/DashboardShell';

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
    <DashboardShell businessName={business?.name}>
      {children}
    </DashboardShell>
  );
}

