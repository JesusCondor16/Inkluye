'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function DocenteHomePage() {
  const [nombreUsuario, setNombreUsuario] = useState('Docente');
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
    <main className="d-flex" role="main" aria-label="Página principal del docente">
      <Sidebar />

      <div
        className="flex-grow-1 p-5"
        style={{ minHeight: '100vh', backgroundColor: '#F7FDF9' }} // fondo claro con verde suave
      >
        <section aria-labelledby="titulo-bienvenida-docente">
          <h1
            id="titulo-bienvenida-docente"
            className="mb-4"
            tabIndex={0}
            style={{
              color: '#145A32', // verde oscuro accesible
              fontWeight: 'bold',
              borderBottom: '2px solid #145A32',
              paddingBottom: '8px',
            }}
          >
            Bienvenido, {nombreUsuario}
          </h1>

          <p className="lead" tabIndex={0}>
            Desde aquí podrá buscar los syllabus disponibles.
          </p>

          <div className="mt-4" role="region" aria-labelledby="accesos-docente">
            <h2
              id="accesos-docente"
              className="h5 mb-3"
              tabIndex={0}
              style={{ color: '#145A32' }}
            >
              Accesos rápidos
            </h2>

            <div className="d-flex flex-wrap gap-3">
              <Link
                href="/buscar"
                className="btn"
                style={{
                  borderColor: '#145A32',
                  color: '#145A32',
                }}
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
