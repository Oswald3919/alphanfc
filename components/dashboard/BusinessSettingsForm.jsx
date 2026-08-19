'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBusinessSettings } from '@/actions/business';

export default function BusinessSettingsForm({ initialBusiness }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialBusiness?.name ?? '',
    google_review_url: initialBusiness?.google_review_url ?? '',
    menu_url: initialBusiness?.menu_url ?? '',
    whatsapp_url: initialBusiness?.whatsapp_url ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.set(key, value));

    const result = await saveBusinessSettings(payload);

    setIsSubmitting(false);

    if (!result?.ok) {
      setError(result?.message || 'No se pudo guardar la configuración.');
      return;
    }

    setNotice(result.message);
    router.refresh();
  }

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label className="label" htmlFor="name">Nombre del negocio</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="Café Luna"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="google_review_url">URL de reseñas de Google</label>
          <input
            id="google_review_url"
            name="google_review_url"
            type="url"
            value={form.google_review_url}
            onChange={handleChange}
            className="input"
            placeholder="https://maps.google.com/?cid=..."
          />
        </div>

        <div>
          <label className="label" htmlFor="menu_url">Enlace del menú</label>
          <input
            id="menu_url"
            name="menu_url"
            type="url"
            value={form.menu_url}
            onChange={handleChange}
            className="input"
            placeholder="https://mi-menu.com"
          />
        </div>

        <div>
          <label className="label" htmlFor="whatsapp_url">WhatsApp</label>
          <input
            id="whatsapp_url"
            name="whatsapp_url"
            value={form.whatsapp_url}
            onChange={handleChange}
            className="input"
            placeholder="https://wa.me/5215512345678 o +52 55 1234 5678"
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        {notice && (
          <div style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#bbf7d0' }}>
            {notice}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
