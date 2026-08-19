/**
 * ScanTable — Data table showing scans per table/location.
 * Includes a visual progress bar for each row relative to the total.
 */
import { formatNumber } from '@/lib/utils';

export default function ScanTable({ rows, total }) {
  if (!rows || rows.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
        No hay tótems registrados aún. Crea tu primer tótem en "Mis tótems".
      </p>
    );
  }

  return (
    <>
      <div className="desktop-table" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Código</th>
              <th style={{ textAlign: 'right' }}>Escaneos</th>
              <th style={{ minWidth: '140px' }}>Proporción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
              return (
                <tr key={row.code}>
                  <td style={{ fontWeight: 500 }}>{row.location_name}</td>
                  <td>
                    <code style={{
                      background: 'var(--surface-3)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8125rem',
                      color: 'var(--brand-light)',
                      fontFamily: 'monospace',
                    }}>
                      {row.code}
                    </code>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    {formatNumber(row.count)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          borderRadius: '999px',
                          background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-light))',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '32px', textAlign: 'right' }}>
                        {pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mobile-table-list" style={{ display: 'none' }}>
        {rows.map((row) => {
          const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
          return (
            <div key={row.code} style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.96rem' }}>{row.location_name}</strong>
                <code style={{
                  background: 'var(--surface-3)',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  color: 'var(--brand-light)',
                  fontFamily: 'monospace',
                }}>
                  {row.code}
                </code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>Escaneos</span>
                <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(row.count)}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, height: '6px', borderRadius: '999px', background: 'var(--surface-3)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-light))',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '26px', textAlign: 'right' }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
