# AlphaNFC

AlphaNFC es una plataforma SaaS orientada a negocios que conecta ubicaciones físicas con experiencias digitales mediante tótems NFC y QR.

## Visión del producto

Cada tótem representa un punto de interacción físico en el negocio, como recepción, caja, mesa o mostrador. Los clientes escanean el código QR o la etiqueta NFC para acceder a reseñas, menú digital, WhatsApp o indicadores analíticos.

## Stack principal

- Next.js App Router
- Supabase
- PostgreSQL
- Tailwind CSS

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Convención de nomenclatura

Se utiliza exclusivamente el término “tótem” para referirse a cada punto de interacción físico. La base de datos conserva la tabla `public.tables` por compatibilidad con la estructura actual, pero el lenguaje del producto y la UI se escribirá siempre en “tótem” / “tótems”.

## Estructura relevante

- `/app/dashboard` — panel analítico
- `/app/dashboard/tables` — gestión de tótems
- `/app/t/[code]` — experiencia pública del tótem
- `/actions/tables.js` — server actions de creación, edición y borrado

## Despliegue

La app se despliega en Vercel con las variables del entorno de Supabase y la URL pública configurada.
