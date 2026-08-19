/**
 * Dashboard Analytics Page — /dashboard
 *
 * All data fetching is server-side via Supabase queries.
 * Aggregations are done in SQL (efficient) rather than in JS.
 *
 * Metrics computed:
 *  - Total scans (all time)
 *  - Scans per table/location
 *  - Events breakdown by action_type
 *  - Daily scan trend for the last 30 days
 */
import { BarChart3, Eye, MapPinned, Trophy } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatNumber, actionLabel } from '@/lib/utils';
import StatCard from '@/components/ui/StatCard';
import ScanTable from '@/components/ui/ScanTable';
import ActivityChart from '@/components/ui/ActivityChart';
import ExportCsvButton from '@/components/dashboard/ExportCsvButton';

export const metadata = { title: 'Analíticas | AlphaNFC' };

// Revalidate every 60 seconds so data stays fresh without SSG staleness
export const revalidate = 60;

export default async function DashboardPage() {
  const supabase = await createClient();

  // ── Auth: get current user's business ─────────────────────
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.25rem' }}>No se encontró un negocio asociado a tu cuenta.</p>
      </div>
    );
  }

  // ── 1. Fetch all totems for this business ─────────────────
  const { data: businessTables } = await supabase
    .from('tables')
    .select('id, location_name, code')
    .eq('business_id', business.id);

  const tableIds = (businessTables ?? []).map((t) => t.id);

  // ── 2. Total scans ────────────────────────────────────────
  const { count: totalScans } = await supabase
    .from('scans')
    .select('id', { count: 'exact', head: true })
    .in('table_id', tableIds.length ? tableIds : ['00000000-0000-0000-0000-000000000000']);

  // ── 3. Scans per table ────────────────────────────────────
  // Fetches all scans and groups in JS (acceptable at MVP scale)
  const { data: allScans } = await supabase
    .from('scans')
    .select('table_id, created_at')
    .in('table_id', tableIds.length ? tableIds : ['00000000-0000-0000-0000-000000000000']);

  const scansByTable = (businessTables ?? []).map((t) => ({
    location_name: t.location_name,
    code:          t.code,
    count:         (allScans ?? []).filter((s) => s.table_id === t.id).length,
  })).sort((a, b) => b.count - a.count);

  // ── 4. Events breakdown by action_type ───────────────────
  const { data: allEvents } = await supabase
    .from('events')
    .select('action_type, created_at')
    .in('table_id', tableIds.length ? tableIds : ['00000000-0000-0000-0000-000000000000']);

  const eventsByType = ['google_review', 'menu', 'whatsapp'].map((type) => ({
    type,
    label: actionLabel(type),
    count: (allEvents ?? []).filter((e) => e.action_type === type).length,
  }));

  // ── 5. Daily scan trend — last 30 days ───────────────────
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const recentScans = (allScans ?? []).filter(
    (s) => new Date(s.created_at) >= thirtyDaysAgo
  );

  // Build a map of date → count for the last 30 days
  const trendMap = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    trendMap[key] = 0;
  }
  recentScans.forEach((s) => {
    const key = s.created_at.slice(0, 10);
    if (key in trendMap) trendMap[key]++;
  });

  const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

  // ── Top action ────────────────────────────────────────────
  const topEvent = [...eventsByType].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="dashboard-container" style={{ width: '100%', padding: '2rem 3rem' }}>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Analíticas de {business.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Datos actualizados cada 60 segundos · Últimos 30 días en el gráfico
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <ExportCsvButton />
      </div>

      {/* ── Stat cards ────────────────────────────────────── */}
      <div className="stat-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatCard
          icon={Eye}
          label="Escaneos totales"
          value={formatNumber(totalScans ?? 0)}
          accent="#ff5500"
        />
        <StatCard
          icon={MapPinned}
          label="Tótems activos"
          value={formatNumber(businessTables?.length ?? 0)}
          accent="#ff7a33"
        />
        <StatCard
          icon={BarChart3}
          label="Interacciones totales"
          value={formatNumber(allEvents?.length ?? 0)}
          accent="#ff9c5c"
        />
        <StatCard
          icon={Trophy}
          label="Acción más popular"
          value={topEvent?.count ? topEvent.label : '—'}
          accent="#ffd1b1"
          small
        />
      </div>

      {/* ── Trend chart + Events breakdown ────────────────── */}
      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Activity chart */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Escaneos por día — últimos 30 días
          </h2>
          <ActivityChart data={trendData} />
        </div>

        {/* Events breakdown */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Clics por tipo de acción
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {eventsByType.map((ev) => {
              const totalEv = allEvents?.length || 1;
              const pct = Math.round((ev.count / totalEv) * 100);
              return (
                <div key={ev.type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{ev.label}</span>
                    <span style={{ fontWeight: 600 }}>{formatNumber(ev.count)}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: '999px',
                      background: ev.type === 'google_review' ? '#f59e0b'
                        : ev.type === 'menu' ? '#6366f1'
                        : '#22c55e',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Scans per table ───────────────────────────────── */}
      <div style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Escaneos por ubicación
        </h2>
        <ScanTable rows={scansByTable} total={totalScans ?? 0} />
      </div>
    </div>
  );
}
