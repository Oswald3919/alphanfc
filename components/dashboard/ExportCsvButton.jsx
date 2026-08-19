'use client';

import { useState } from 'react';

export default function ExportCsvButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);

    try {
      const response = await fetch('/api/dashboard/export');

      if (!response.ok) {
        throw new Error('No se pudo exportar el CSV.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'alphanfc-metrics.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('No se pudo exportar los datos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="btn-primary"
      style={{ opacity: loading ? 0.7 : 1 }}
    >
      {loading ? 'Exportando…' : 'Exportar CSV'}
    </button>
  );
}
