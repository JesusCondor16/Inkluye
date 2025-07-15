'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

export default function DirectorHomePage() {
  const [nombreUsuario, setNombreUsuario] = useState('Director');

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

  return (
    <main
      className="d-flex"
      role="main"
      aria-label="Página principal del director"
      style={{ minHeight: '100vh', backgroundColor: '#e6f0fa' }} // fondo celeste claro accesible
    >
      <Sidebar />

      <div className="flex-grow-1 p-5">
        <section
          aria-labelledby="titulo-bienvenida-director"
          className="shadow p-4 rounded bg-white"
          style={{ border: '3px solid #005a9c', maxWidth: '900px' }}
        >
          <h1
            id="titulo-bienvenida-director"
            className="mb-4"
            tabIndex={0}
            style={{ color: '#003366', fontWeight: 'bold', fontSize: '2rem' }}
          >
            Bienvenido, {nombreUsuario}
          </h1>

          <p
            className="lead"
            tabIndex={0}
            style={{ color: '#333', lineHeight: 1.6 }}
          >
            Esta es su plataforma de gestión de syllabus. Desde aquí podrá realizar tareas clave para la administración académica.
          </p>

          <ul className="mt-4" aria-label="Lista de acciones disponibles">
            <li className="mb-3 d-flex align-items-start" tabIndex={0}>
              <span aria-hidden="true" className="me-2 text-primary fw-bold">✓</span>
              <span><strong>Gestionar docentes:</strong> Añadir, editar o eliminar docentes del sistema.</span>
            </li>
            <li className="mb-3 d-flex align-items-start" tabIndex={0}>
              <span aria-hidden="true" className="me-2 text-primary fw-bold">✓</span>
              <span><strong>Asignar coordinadores:</strong> Designar responsables de syllabus por curso.</span>
            </li>
            <li className="mb-3 d-flex align-items-start" tabIndex={0}>
              <span aria-hidden="true" className="me-2 text-primary fw-bold">✓</span>
              <span><strong>Revisar historial:</strong> Visualizar los cambios realizados por el personal.</span>
            </li>
          </ul>

          <section
            role="region"
            aria-labelledby="accesos-rapidos-director"
            className="mt-5"
          >
            <h2
              id="accesos-rapidos-director"
              className="h5 mb-3"
              tabIndex={0}
              style={{ fontWeight: 'bold', color: '#003366' }}
            >
              Accesos rápidos
            </h2>

            <div className="d-flex flex-wrap gap-3">
              <Link
                href="/director/docentes"
                className="btn btn-primary"
                style={{ backgroundColor: '#005a9c', borderColor: '#004080', fontWeight: 'bold' }}
                aria-label="Ir a la sección de gestión de docentes"
              >
                Gestión de Docentes
              </Link>

              <Link
                href="/director/cursos"
                className="btn btn-outline-primary"
                style={{ borderColor: '#005a9c', color: '#005a9c', fontWeight: 'bold' }}
                aria-label="Ir a la sección de gestión de cursos"
              >
                Gestión de Cursos
              </Link>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
