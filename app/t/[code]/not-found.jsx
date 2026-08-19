import { notFound } from 'next/navigation';

export default function TrackingNotFound() {
  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</p>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        Tótem no encontrado
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.6 }}>
        El código QR o chip NFC que escaneaste no está registrado en nuestro sistema.
        Puede que el tótem no esté activo todavía.
      </p>
    </main>
  );
}
