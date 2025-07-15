'use client';

import Sidebar from '@/components/Sidebar';

export default function InformacionPage() {
  return (
    <main className="d-flex" role="main" aria-label="Página de información general">
      <Sidebar />
      <div className="flex-grow-1 p-5" style={{ minHeight: '100vh' }}>
        <h1 className="mb-4 text-primary" tabIndex={0}>Información general del sistema</h1>

        <section className="mb-5" aria-labelledby="accesibilidad">
          <h2 id="accesibilidad" className="h5 text-dark" tabIndex={0}>Accesibilidad - WCAG 2.0 AAA</h2>
          <p tabIndex={0}>
            Este sistema cumple con la norma <strong>WCAG 2.0 AAA</strong>, lo cual garantiza que sea accesible para
            todas las personas, incluyendo aquellas con discapacidad visual, motora o cognitiva.
          </p>
          <ul>
            <li tabIndex={0}>✔️ Contraste alto y legible.</li>
            <li tabIndex={0}>✔️ Navegación por teclado en todas las funciones.</li>
            <li tabIndex={0}>✔️ Uso de roles ARIA, etiquetas semánticas y descripciones claras.</li>
          </ul>
        </section>

        <section className="mb-5" aria-labelledby="navegacion">
          <h2 id="navegacion" className="h5 text-dark" tabIndex={0}>¿Cómo navegar en el sistema?</h2>
          <p tabIndex={0}>Puedes utilizar las siguientes instrucciones para moverte:</p>
          <ul>
            <li tabIndex={0}>⬇️ Usa <kbd>Tab</kbd> para avanzar entre elementos interactivos.</li>
            <li tabIndex={0}>⬆️ Usa <kbd>Shift</kbd> + <kbd>Tab</kbd> para retroceder.</li>
            <li tabIndex={0}>📄 Todos los botones y enlaces tienen descripciones accesibles.</li>
            <li tabIndex={0}>🔒 Puedes cerrar sesión en cualquier momento desde el menú lateral.</li>
            <li tabIndex={0}>⏎ Presiona <kbd>Enter</kbd> para activar botones o enlaces seleccionados.</li>
          </ul>
        </section>

        <section aria-labelledby="soporte">
          <h2 id="soporte" className="h5 text-dark" tabIndex={0}>¿Necesitas ayuda adicional?</h2>
          <p tabIndex={0}>
            Si tienes dificultades para usar el sistema, contáctanos a través del correo: <a href="mailto:soporte@inkulye.com">soporte@inkulye.com</a>
          </p>
        </section>
      </div>
    </main>
  );
}
