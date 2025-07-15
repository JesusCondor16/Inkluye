'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [mostrarCreditos, setMostrarCreditos] = useState(false);

  return (
    <main
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#e6f0fa',
        padding: '2rem',
      }}
      role="main"
      aria-label="Página principal del sistema de gestión de syllabus"
      tabIndex={-1}
    >
      <div
        className="text-center shadow p-5 rounded"
        style={{
          backgroundColor: '#ffffff',
          maxWidth: '700px',
          width: '100%',
          border: '3px solid #005a9c',
        }}
      >
        <h1
          tabIndex={0}
          className="mb-4"
          style={{
            color: '#003366',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          Bienvenido al Sistema de Gestión de Syllabus - Inkluye
        </h1>

        <p
          tabIndex={0}
          className="lead mb-4"
          style={{
            fontSize: '1.125rem',
            color: '#333',
            lineHeight: 1.6,
          }}
        >
          Este sistema está diseñado para facilitar la gestión de syllabus en instituciones educativas,
          cumpliendo con la normativa <strong>WCAG 2.0 AAA</strong> para garantizar accesibilidad para todas las personas,
          incluyendo usuarios con discapacidades visuales.
        </p>

        <nav aria-label="Opciones principales">
          <div className="d-grid gap-3 col-6 mx-auto">
            <Link
              href="/users/login"
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: '#005a9c',
                borderColor: '#003f7f',
                fontWeight: 'bold',
              }}
              role="button"
              aria-label="Iniciar sesión en el sistema"
            >
              Iniciar sesión
            </Link>

            <button
              onClick={() => setMostrarAyuda(!mostrarAyuda)}
              className="btn btn-outline-primary btn-lg"
              style={{
                borderColor: '#005a9c',
                color: '#005a9c',
                fontWeight: 'bold',
              }}
              aria-expanded={mostrarAyuda}
              aria-controls="ayudaAccesibilidad"
              aria-label="Mostrar ayuda de accesibilidad"
            >
              {mostrarAyuda ? 'Ocultar ayuda de accesibilidad' : 'Ayuda de accesibilidad'}
            </button>

            <button
              onClick={() => setMostrarCreditos(!mostrarCreditos)}
              className="btn btn-outline-secondary btn-lg"
              style={{
                borderColor: '#6c757d',
                color: '#6c757d',
                fontWeight: 'bold',
              }}
              aria-expanded={mostrarCreditos}
              aria-controls="creditosAutores"
              aria-label="Mostrar créditos del sistema"
            >
              {mostrarCreditos ? 'Ocultar créditos' : 'Créditos'}
            </button>
          </div>
        </nav>

        {/* Sección de ayuda */}
        {mostrarAyuda && (
          <section
            id="ayudaAccesibilidad"
            className="mt-4 text-start alert alert-info"
            role="region"
            aria-live="polite"
            tabIndex={0}
            style={{
              backgroundColor: '#d9ecff',
              borderColor: '#005a9c',
              color: '#003366',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            <h2 className="h5 fw-bold mb-2">Instrucciones de accesibilidad</h2>
            <ul>
              <li>Usa <strong>Tab ↹</strong> para navegar entre elementos interactivos.</li>
              <li>Presiona <strong>Enter ⏎</strong> para activar botones o enlaces.</li>
              <li>Usa <strong>Ctrl + +</strong> (o <strong>Cmd + +</strong> en Mac) para aumentar el tamaño del texto.</li>
              <li>Este sistema es compatible con lectores de pantalla como NVDA, JAWS o VoiceOver.</li>
              <li>Todos los elementos tienen etiquetas accesibles y contraste adecuado.</li>
            </ul>
          </section>
        )}

        {/* Sección de créditos */}
        {mostrarCreditos && (
          <section
            id="creditosAutores"
            className="mt-4 text-start alert alert-secondary"
            role="region"
            aria-live="polite"
            tabIndex={0}
            style={{
              backgroundColor: '#f8f9fa',
              borderColor: '#6c757d',
              color: '#333',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            <h2 className="h5 fw-bold mb-2">Créditos del sistema</h2>
            <ul>
              <li><strong>Condor Marin, Jesus Ernesto</strong></li>
              <li><strong>Quiroz Ardiles, Sergio Daniel</strong></li>
            </ul>
            <p className="mb-0">Desarrollado con enfoque inclusivo y accesible.</p>
          </section>
        )}
      </div>
    </main>
  );
}
