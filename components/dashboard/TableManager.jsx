'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { createTableAction, updateTableAction, deleteTableAction } from '@/actions/tables';
import { formatDate, normalizeTableCode } from '@/lib/utils';

const defaultForm = { location_name: '', code: '' };

export default function TableManager({ initialTables, baseUrl }) {
  const router = useRouter();
  const [tables, setTables] = useState(initialTables);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [previewTable, setPreviewTable] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const sortedTables = useMemo(
    () => [...tables].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [tables]
  );

  function openCreateModal() {
    setEditingId(null);
    setForm(defaultForm);
    setError('');
    setIsOpen(true);
  }

  function openEditModal(table) {
    setEditingId(table.id);
    setForm({ location_name: table.location_name, code: table.code });
    setError('');
    setIsOpen(true);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsBusy(true);
    setError('');

    const payload = new FormData();
    payload.set('location_name', form.location_name);
    payload.set('code', form.code || form.location_name);

    if (editingId) {
      payload.set('table_id', editingId);
    }

    const result = editingId
      ? await updateTableAction(payload)
      : await createTableAction(payload);

    setIsBusy(false);

    if (!result?.ok) {
      setError(result?.message || 'No se pudo guardar la ubicación.');
      return;
    }

    setNotice(result.message);
    setIsOpen(false);
    setForm(defaultForm);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(tableId) {
    const confirmed = window.confirm('¿Seguro que quieres eliminar esta ubicación?');
    if (!confirmed) return;

    const payload = new FormData();
    payload.set('table_id', tableId);
    const result = await deleteTableAction(payload);

    if (!result?.ok) {
      alert(result?.message || 'No se pudo eliminar la ubicación.');
      return;
    }

    setTables((prev) => prev.filter((table) => table.id !== tableId));
    setNotice(result.message);
    router.refresh();
  }

  function handlePreview(table) {
    setPreviewTable(table);
  }

  function downloadQr(table) {
    const node = document.getElementById(`qr-${table.id}`);
    if (!node) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(node);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 4;
      const size = Math.max(node.getBoundingClientRect().width || 220, 220);

      canvas.width = size * scale;
      canvas.height = size * scale;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `QR-${normalizeTableCode(table.code)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert('No se pudo generar la imagen del QR. Inténtalo de nuevo.');
    };

    img.src = url;
  }

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        gap: '1rem',
        flexWrap: 'wrap',
        padding: isMobile ? '0.5rem 0.5rem 0' : '0',
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Tótems y ubicaciones</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: isMobile ? '0.82rem' : '1rem' }}>Gestiona los puntos de interacción del negocio.</p>
        </div>

        <button type="button" className="btn-primary" onClick={openCreateModal} style={{ width: isMobile ? '100%' : 'auto' }}>
          + Nuevo tótem
        </button>
      </div>

      {notice && (
        <div style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#bbf7d0', marginBottom: '1rem' }}>
          {notice}
        </div>
      )}

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', padding: '0 0.15rem 1rem' }}>
          {sortedTables.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '1.5rem 0.75rem', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              Aún no tienes tótems registrados.
            </div>
          ) : (
            sortedTables.map((table) => {
              const previewUrl = `${baseUrl}/t/${table.code}`;
              return (
                <div key={table.id} style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Ubicación</p>
                      <strong style={{ fontSize: '1rem' }}>{table.location_name}</strong>
                    </div>
                    <code style={{ background: 'var(--surface-3)', borderRadius: '6px', padding: '0.35rem 0.55rem', fontFamily: 'monospace', color: 'var(--brand-light)', fontSize: '0.8rem' }}>
                      {table.code}
                    </code>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <span>Creación</span>
                    <span>{formatDate(table.created_at)}</span>
                  </div>

                  <a href={previewUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-light)', fontWeight: 700, fontSize: '0.92rem' }}>
                    Ver enlace /t/{table.code}
                  </a>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.55rem' }}>
                    <button type="button" className="btn-ghost" onClick={() => handlePreview(table)} style={{ width: '100%', padding: '0.8rem 0.45rem', fontSize: '0.8rem' }}>
                      Ver QR
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => openEditModal(table)} style={{ width: '100%', padding: '0.8rem 0.45rem', fontSize: '0.8rem' }}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(table.id)} style={{ width: '100%', padding: '0.8rem 0.45rem', fontSize: '0.8rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#fca5a5', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ubicación</th>
                  <th>Código</th>
                  <th>Creación</th>
                  <th>Previsualización</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedTables.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--text-muted)', padding: '1.5rem' }}>
                      Aún no tienes tótems registrados.
                    </td>
                  </tr>
                ) : (
                  sortedTables.map((table) => {
                    const previewUrl = `${baseUrl}/t/${table.code}`;
                    return (
                      <tr key={table.id}>
                        <td style={{ fontWeight: 600 }}>{table.location_name}</td>
                        <td>
                          <code style={{ background: 'var(--surface-3)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontFamily: 'monospace', color: 'var(--brand-light)' }}>
                            {table.code}
                          </code>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{formatDate(table.created_at)}</td>
                        <td>
                          <a href={previewUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-light)', fontWeight: 600 }}>
                            /t/{table.code}
                          </a>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button type="button" className="btn-ghost" onClick={() => handlePreview(table)}>
                              Ver QR
                            </button>
                            <button type="button" className="btn-ghost" onClick={() => openEditModal(table)}>
                              Editar
                            </button>
                            <button type="button" onClick={() => handleDelete(table.id)} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#fca5a5', borderRadius: 'var(--radius-md)', padding: '0.55rem 0.9rem', fontWeight: 600 }}>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,23,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '520px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{editingId ? 'Editar ubicación' : 'Nuevo tótem'}</h2>
              <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem' }}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label" htmlFor="location_name">Nombre de la ubicación</label>
                <input
                  id="location_name"
                  name="location_name"
                  value={form.location_name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Mesa 1, Recepción, Caja…"
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="code">Código único</label>
                <input
                  id="code"
                  name="code"
                  value={form.code}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="MESA-01"
                  maxLength={24}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                  Si se deja vacío, se genera automáticamente desde la ubicación.
                </p>
              </div>

              {error && <p className="form-error">{error}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-ghost" onClick={() => setIsOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={isBusy} style={{ opacity: isBusy ? 0.7 : 1 }}>
                  {isBusy ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear tótem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewTable && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,23,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{previewTable.location_name}</h3>
              <button type="button" onClick={() => setPreviewTable(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem' }}>
                ×
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '12px' }}>
                <QRCodeSVG id={`qr-${previewTable.id}`} value={`${baseUrl}/t/${previewTable.code}`} size={220} level="H" includeMargin />
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Código:</p>
            <code style={{ display: 'inline-block', background: 'var(--surface-3)', padding: '0.35rem 0.7rem', borderRadius: '6px', color: 'var(--brand-light)', fontFamily: 'monospace', marginBottom: '1rem' }}>
              {previewTable.code}
            </code>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href={`${baseUrl}/t/${previewTable.code}`} target="_blank" rel="noreferrer" className="btn-ghost">
                Abrir vista
              </a>
              <button type="button" className="btn-primary" onClick={() => downloadQr(previewTable)}>
                Descargar QR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
