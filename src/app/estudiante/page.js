'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function EstudianteHomePage() {
  const [nombreUsuario, setNombreUsuario] = useState('Estudiante');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.name) {
          setNombreUsuario(decoded.name);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <main
      className="d-flex bg-light text-dark"
      role="main"
      aria-label="Página principal del estudiante"
      style={{ minHeight: '100vh' }}
    >
      <Sidebar />

      <div className="flex-grow-1 p-5">
        <section aria-labelledby="titulo-bienvenida-estudiante">
          <div
            className="px-4 py-4 rounded mb-4 shadow-sm"
            style={{ backgroundColor: '#007B9E', color: '#ffffff' }}
            role="region"
            aria-label="Encabezado de bienvenida al estudiante"
          >
            <h1
              id="titulo-bienvenida-estudiante"
              className="mb-0 display-6 fw-bold"
              tabIndex={0}
            >
              👋 ¡Bienvenido/a, {nombreUsuario}!
            </h1>
          </div>

          <p className="lead mb-4" tabIndex={0}>
            Desde aquí puedes explorar y buscar los syllabus disponibles registrados en el sistema académico.
          </p>

          <section
            role="region"
            aria-labelledby="accesos-estudiante"
            className="mt-4"
          >
            <h2 id="accesos-estudiante" className="h5 fw-bold mb-3" tabIndex={0}>
              🔎 Accesos Rápidos
            </h2>

            <div className="d-flex flex-wrap gap-3" role="group" aria-label="Grupo de acciones principales del estudiante">
              <Link
                href="/buscar"
                className="btn btn-primary btn-lg shadow-sm"
                aria-label="Ir a la búsqueda de syllabus"
                onFocus={(e) => {
                  e.currentTarget.style.outline = '3px solid #000';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                📚 Buscar Syllabus
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-lg shadow-sm"
                aria-label="Cerrar sesión del sistema"
                onFocus={(e) => {
                  e.currentTarget.style.outline = '3px solid #000';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                🔒 Cerrar Sesión
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
