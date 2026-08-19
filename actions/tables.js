'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { normalizeTotemCode } from '@/lib/utils';

async function getBusinessId({ userId }) {
  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error || !business) {
    return null;
  }

  return business.id;
}

function parseLocationName(raw) {
  const value = (raw ?? '').toString().trim();
  if (!value) {
    return { error: 'La ubicación es obligatoria.' };
  }
  if (value.length < 2 || value.length > 80) {
    return { error: 'La ubicación debe tener entre 2 y 80 caracteres.' };
  }
  return { value };
}

export async function createTotemAction(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: 'Debes iniciar sesión para crear tótems.' };
  }

  const locationNameResult = parseLocationName(formData.get('location_name'));
  if (locationNameResult.error) {
    return { ok: false, message: locationNameResult.error };
  }

  const code = normalizeTotemCode(formData.get('code') || formData.get('location_name'));
  if (!code) {
    return { ok: false, message: 'El código del tótem no es válido.' };
  }

  const businessId = await getBusinessId({ userId: user.id });
  if (!businessId) {
    return { ok: false, message: 'No se encontró un negocio asociado a tu cuenta.' };
  }

  const { error } = await supabase.from('tables').insert({
    business_id: businessId,
    location_name: locationNameResult.value,
    code,
  });

  if (error) {
    const message = error.code === '23505'
      ? 'Ese código ya está registrado. Usa uno diferente.'
      : 'No se pudo crear el tótem. Inténtalo de nuevo.';
    return { ok: false, message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/tables');

  return {
    ok: true,
    message: 'Tótem creado correctamente.',
    code,
  };
}

export async function updateTotemAction(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: 'Debes iniciar sesión para editar tótems.' };
  }

  const tableId = formData.get('table_id');
  const locationNameResult = parseLocationName(formData.get('location_name'));
  if (!tableId || !locationNameResult.value) {
    return { ok: false, message: 'El tótem que intentas editar no es válido.' };
  }

  const code = normalizeTotemCode(formData.get('code'));
  if (!code) {
    return { ok: false, message: 'El código del tótem no es válido.' };
  }

  const businessId = await getBusinessId({ userId: user.id });
  if (!businessId) {
    return { ok: false, message: 'No se encontró un negocio asociado a tu cuenta.' };
  }

  const { error } = await supabase
    .from('tables')
    .update({
      location_name: locationNameResult.value,
      code,
    })
    .eq('id', tableId)
    .eq('business_id', businessId);

  if (error) {
    const message = error.code === '23505'
      ? 'Ese código ya existe. Cambia la ubicación o el código.'
      : 'No se pudo actualizar la ubicación del tótem.';
    return { ok: false, message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/tables');

  return {
    ok: true,
    message: 'Ubicación del tótem actualizada correctamente.',
    code,
  };
}

export async function deleteTotemAction(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: 'Debes iniciar sesión para eliminar tótems.' };
  }

  const tableId = formData.get('table_id');
  if (!tableId) {
    return { ok: false, message: 'No se pudo identificar el tótem a eliminar.' };
  }

  const businessId = await getBusinessId({ userId: user.id });
  if (!businessId) {
    return { ok: false, message: 'No se encontró un negocio asociado a tu cuenta.' };
  }

  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', tableId)
    .eq('business_id', businessId);

  if (error) {
    return { ok: false, message: 'No se pudo eliminar el tótem. Inténtalo de nuevo.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/tables');

  return {
    ok: true,
    message: 'Tótem eliminado correctamente.',
  };
}

export const createTableAction = createTotemAction;
export const updateTableAction = updateTotemAction;
export const deleteTableAction = deleteTotemAction;
