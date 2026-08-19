'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { validateBusinessUrl, validateWhatsappUrl } from '@/lib/utils';

export async function saveBusinessSettings(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: 'Debes iniciar sesión para guardar la configuración.' };
  }

  const name = (formData.get('name') ?? '').toString().trim();
  if (!name || name.length < 2 || name.length > 120) {
    return { ok: false, message: 'El nombre del negocio es obligatorio y debe tener entre 2 y 120 caracteres.' };
  }

  const googleReviewUrl = (formData.get('google_review_url') ?? '').toString().trim();
  const menuUrl = (formData.get('menu_url') ?? '').toString().trim();
  const whatsappUrl = (formData.get('whatsapp_url') ?? '').toString().trim();

  if (googleReviewUrl && !validateBusinessUrl(googleReviewUrl)) {
    return { ok: false, message: 'La URL de reseñas de Google no es válida.' };
  }

  if (menuUrl && !validateBusinessUrl(menuUrl)) {
    return { ok: false, message: 'La URL del menú no es válida.' };
  }

  if (whatsappUrl && !validateWhatsappUrl(whatsappUrl)) {
    return { ok: false, message: 'El WhatsApp debe ser un enlace válido o un número de teléfono correcto.' };
  }

  const { error } = await supabase
    .from('businesses')
    .update({
      name,
      google_review_url: googleReviewUrl || null,
      menu_url: menuUrl || null,
      whatsapp_url: whatsappUrl || null,
    })
    .eq('user_id', user.id);

  if (error) {
    return {
      ok: false,
      message: 'No se pudo guardar la configuración del negocio. Inténtalo de nuevo.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');

  return {
    ok: true,
    message: 'Configuración guardada correctamente.',
  };
}
