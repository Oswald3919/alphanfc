/**
 * Server Action: trackAndRedirect
 *
 * Called when a visitor clicks a CTA button on the landing page.
 * 1. Inserts a row into the `events` table (fire-and-forget style).
 * 2. Redirects the user to the target external URL.
 *
 * Using a Server Action means zero client-side JS is required for tracking —
 * the browser submits a native form POST which the server handles.
 */
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * @param {FormData} formData - Contains tableId, actionType, redirectUrl
 */
export async function trackAndRedirect(formData) {
  const tableId    = formData.get('tableId');
  const actionType = formData.get('actionType');
  const redirectUrl = formData.get('redirectUrl');

  // Validate the action type before inserting to avoid DB constraint errors
  const validActions = ['google_review', 'menu', 'whatsapp', 'instagram', 'facebook', 'tiktok', 'website', 'phone'];
  if (!tableId || !validActions.includes(actionType)) {
    // If data is malformed, redirect anyway without logging
    redirect(redirectUrl || '/');
  }

  const supabase = await createClient();

  // Insert event — we do NOT await to block the user; redirect happens either way
  await supabase.from('events').insert({
    table_id:    tableId,
    action_type: actionType,
  });

  // Next.js redirect() throws internally — must be called OUTSIDE try/catch
  redirect(redirectUrl);
}
