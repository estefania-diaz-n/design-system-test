import type { Metadata } from 'next';
import '@tefi/design-system/dist/style.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Design System Test',
  description: 'Aplicación Next.js para validar un Design System publicado en npm.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
