'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBusinessSettings } from '@/actions/business';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function BusinessSettingsForm({ initialBusiness }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [form, setForm] = useState({
    name: initialBusiness?.name ?? '',
    google_review_url: initialBusiness?.google_review_url ?? '',
    menu_url: initialBusiness?.menu_url ?? '',
    whatsapp_url: initialBusiness?.whatsapp_url ?? '',
    instagram_url: initialBusiness?.instagram_url ?? '',
    facebook_url: initialBusiness?.facebook_url ?? '',
    tiktok_url: initialBusiness?.tiktok_url ?? '',
    website_url: initialBusiness?.website_url ?? '',
    phone_number: initialBusiness?.phone_number ?? '',
    wifi_name: initialBusiness?.wifi_name ?? '',
    wifi_password: initialBusiness?.wifi_password ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingMenu, setIsUploadingMenu] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function persistBusinessData(nextForm) {
    const payload = new FormData();
    Object.entries(nextForm).forEach(([key, value]) => payload.set(key, value ?? ''));

    const result = await saveBusinessSettings(payload);
    if (!result?.ok) {
      throw new Error(result?.message || 'No se pudo guardar la configuración del negocio.');
    }

    return result;
  }

  async function handleMenuUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('El archivo del menú debe ser un PDF o una imagen (.png, .jpg, .webp).');
      event.target.value = '';
      return;
    }

    setError('');
    setNotice('');
    setIsUploadingMenu(true);
    setUploadProgress(0);

    try {
      const businessId = initialBusiness?.id || 'business';
      const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
      const path = `${businessId}/menu-${Date.now()}-${safeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menus')
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600',
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(percent);
          },
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'No se pudo subir el archivo del menú.');
      }

      const { data: publicData } = supabase.storage.from('menus').getPublicUrl(uploadData.path);
      const publicUrl = publicData?.publicUrl;

      if (!publicUrl) {
        throw new Error('No se pudo obtener la URL pública del menú cargado.');
      }

      const nextForm = {
        ...form,
        menu_url: publicUrl,
      };

      setForm(nextForm);
      await persistBusinessData(nextForm);

      setNotice('Menú subido y guardado correctamente.');
      event.target.value = '';
      router.refresh();
    } catch (err) {
      setError(err.message || 'No se pudo procesar el archivo del menú.');
    } finally {
      setIsUploadingMenu(false);
      setUploadProgress(0);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      const result = await persistBusinessData(form);
      setNotice(result.message);
      router.refresh();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la configuración.');
    } finally {
      setIsSubmitting(false);
    }
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
          <label className="label" htmlFor="menu_url">Menú Digital</label>
          <input
            id="menu_url"
            name="menu_url"
            type="url"
            value={form.menu_url}
            onChange={handleChange}
            className="input"
            placeholder="https://mi-menu.com o sube un PDF/imagen"
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginTop: '0.75rem' }}>
            <label htmlFor="menu-file-upload" className="btn-ghost" style={{ display: 'inline-flex', cursor: 'pointer', minWidth: '180px', justifyContent: 'center' }}>
              {isUploadingMenu ? 'Subiendo…' : 'Subir PDF o imagen'}
            </label>
            <input
              id="menu-file-upload"
              type="file"
              accept="application/pdf,image/*"
              onChange={handleMenuUpload}
              style={{ display: 'none' }}
            />

            {form.menu_url && (
              <a href={form.menu_url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                Ver archivo
              </a>
            )}
          </div>

          {isUploadingMenu && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                <span>Subiendo archivo</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-3)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-light))', transition: 'width 0.2s ease' }} />
              </div>
            </div>
          )}

          {form.menu_url && (
            <div style={{ marginTop: '0.75rem', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Archivo actual: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{form.menu_url.includes('/menus/') ? 'Archivo subido en Storage' : 'URL externa configurada'}</span>
            </div>
          )}
        </div>

        <div>
          <label className="label" htmlFor="instagram_url">Instagram</label>
          <input
            id="instagram_url"
            name="instagram_url"
            type="url"
            value={form.instagram_url}
            onChange={handleChange}
            className="input"
            placeholder="https://instagram.com/tu.negocio"
          />
        </div>

        <div>
          <label className="label" htmlFor="facebook_url">Facebook</label>
          <input
            id="facebook_url"
            name="facebook_url"
            type="url"
            value={form.facebook_url}
            onChange={handleChange}
            className="input"
            placeholder="https://facebook.com/tu.negocio"
          />
        </div>

        <div>
          <label className="label" htmlFor="tiktok_url">TikTok</label>
          <input
            id="tiktok_url"
            name="tiktok_url"
            type="url"
            value={form.tiktok_url}
            onChange={handleChange}
            className="input"
            placeholder="https://tiktok.com/@tu.negocio"
          />
        </div>

        <div>
          <label className="label" htmlFor="website_url">Sitio web oficial</label>
          <input
            id="website_url"
            name="website_url"
            type="url"
            value={form.website_url}
            onChange={handleChange}
            className="input"
            placeholder="https://www.tunegocio.com"
          />
        </div>

        <div>
          <label className="label" htmlFor="phone_number">Llamada telefónica</label>
          <input
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="input"
            placeholder="tel:+525512345678"
          />
        </div>

        <div>
          <label className="label" htmlFor="wifi_name">Nombre de Wi‑Fi</label>
          <input
            id="wifi_name"
            name="wifi_name"
            value={form.wifi_name}
            onChange={handleChange}
            className="input"
            placeholder="Nombre de la red"
          />
        </div>

        <div>
          <label className="label" htmlFor="wifi_password">Contraseña de Wi‑Fi</label>
          <input
            id="wifi_password"
            name="wifi_password"
            value={form.wifi_password}
            onChange={handleChange}
            className="input"
            placeholder="Contraseña de acceso"
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

        <button type="submit" className="btn-primary" disabled={isSubmitting || isUploadingMenu} style={{ opacity: isSubmitting || isUploadingMenu ? 0.7 : 1 }}>
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
