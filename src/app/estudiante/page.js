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
    <main className="d-flex" role="main" aria-label="Página principal del estudiante">
      <Sidebar />

      <div className="flex-grow-1 p-5" style={{ minHeight: '100vh', backgroundColor: '#F7F9FC' }}>
        <section aria-labelledby="titulo-bienvenida-estudiante">
          <div
            className="px-4 py-3 rounded mb-4"
            style={{ backgroundColor: '#007B9E', color: '#fff' }}
            role="region"
            aria-label="Encabezado de bienvenida"
          >
            <h1 id="titulo-bienvenida-estudiante" className="mb-0" tabIndex={0}>
              Bienvenido, {nombreUsuario}
            </h1>
          </div>

          <p className="lead" tabIndex={0}>
            Desde aquí podrá buscar los syllabus disponibles registrados en el sistema.
          </p>

          <div className="mt-4" role="region" aria-labelledby="accesos-estudiante">
            <h2 id="accesos-estudiante" className="h5 mb-3" tabIndex={0}>
              Accesos rápidos
            </h2>

            <div className="d-flex flex-wrap gap-3">
              <Link
                href="/buscar"
                className="btn btn-outline-primary"
                aria-label="Buscar syllabus"
              >
                Buscar Syllabus
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger"
                aria-label="Cerrar sesión"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
