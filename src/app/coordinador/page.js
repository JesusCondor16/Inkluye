'use client';

import Sidebar from '@/components/Sidebar';
import { BookOpenCheck } from 'lucide-react';

export default function CoordinadorPage() {
  return (
    <div
      className="d-flex"
      role="main"
      aria-label="Panel principal del coordinador"
      style={{
        background: 'linear-gradient(135deg, #e9f5ec 0%, #d4ede0 100%)',
        minHeight: '100vh',
      }}
    >
      <Sidebar />

      <main
        className="container mt-5 mb-5 p-5"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          flex: 1,
          maxWidth: '960px',
        }}
        aria-labelledby="coordinador-heading"
      >
        <div className="d-flex align-items-center mb-4">
          <BookOpenCheck
            size={32}
            className="me-3 text-success"
            aria-hidden="true"
          />
          <h1
            id="coordinador-heading"
            className="h3 fw-bold text-dark m-0"
            tabIndex={0}
            aria-label="Título: Panel del Coordinador"
          >
            Panel del Coordinador
          </h1>
        </div>

        <p
          className="text-secondary fs-5"
          tabIndex={0}
          aria-label="Mensaje de bienvenida para el coordinador"
          style={{ lineHeight: '1.6' }}
        >
          Bienvenido al sistema de <strong>gestión de syllabus</strong>. Desde este panel podrá
          gestionar cursos, revisar asignaciones y apoyar a los docentes en sus procesos académicos.
          Use el menú lateral para acceder a sus herramientas.
        </p>
      </main>
    </div>
  );
}
