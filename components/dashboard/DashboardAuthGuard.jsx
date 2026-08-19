'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function DashboardAuthGuard({ children }) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const signOutSession = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.warn('No se pudo cerrar la sesión al abandonar el dashboard:', error);
      }
    };

    const handleBeforeUnload = () => {
      void signOutSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void signOutSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return children;
}
