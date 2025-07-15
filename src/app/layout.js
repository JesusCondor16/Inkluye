import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Inkluye',
  description: 'Sistema de gestión de syllabus',
  icons: {
    icon: '/inkluye.png', // Aquí está tu ícono personalizado
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body>{children}</body>
    </html>
  );
}
