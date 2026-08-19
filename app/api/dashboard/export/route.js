import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const { data: tables } = await supabase
    .from('tables')
    .select('id, location_name, code')
    .eq('business_id', business.id);

  const tableIds = (tables ?? []).map((table) => table.id);

  let scanRows = [];
  let eventRows = [];

  if (tableIds.length) {
    const [{ data: scans }, { data: events }] = await Promise.all([
      supabase
        .from('scans')
        .select('id, table_id, created_at')
        .in('table_id', tableIds),
      supabase
        .from('events')
        .select('id, table_id, action_type, created_at')
        .in('table_id', tableIds),
    ]);

    scanRows = scans ?? [];
    eventRows = events ?? [];
  }

  const lines = [
    ['type', 'table_code', 'location_name', 'action_type', 'created_at'],
    ...scanRows.map((scan) => {
      const table = tables?.find((item) => item.id === scan.table_id);
      return ['scan', table?.code ?? '', table?.location_name ?? '', '', scan.created_at];
    }),
    ...eventRows.map((event) => {
      const table = tables?.find((item) => item.id === event.table_id);
      return ['event', table?.code ?? '', table?.location_name ?? '', event.action_type, event.created_at];
    }),
  ];

  const csv = lines
    .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="alphanfc-metrics.csv"',
    },
  });
}
