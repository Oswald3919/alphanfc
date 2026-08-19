import './globals.css';

export const metadata = {
  title: {
    default: 'AlphaNFC — Conecta tu negocio con el mundo digital',
    template: '%s | AlphaNFC',
  },
  description:
    'Plataforma SaaS que conecta ubicaciones físicas con analíticas digitales mediante placas de acrílico con QR y NFC.',
  keywords: ['NFC', 'QR', 'analíticas', 'negocio', 'reseñas', 'menú digital'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
