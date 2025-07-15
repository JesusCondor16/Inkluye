'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';

export default function MisCursosPage() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCursos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/cursos/coordinador', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'No se pudieron obtener los cursos.');
        }

        const cursosData = await res.json();
        setCursos(cursosData);
      } catch (err) {
        console.error('Error al cargar cursos del coordinador:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const handleGenerarSyllabus = (id) => {
    router.push(`/coordinador/cursos/${id}/syllabus`);
  };

  return (
    <div
      className="d-flex"
      role="main"
      aria-label="Vista principal con la lista de cursos coordinados"
      style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}
    >
      <Sidebar />

      <main className="container mt-4 mb-5" aria-labelledby="titulo-mis-cursos">
        <h1
          id="titulo-mis-cursos"
          className="h3 mb-4 text-dark fw-bold"
          tabIndex={0}
        >
          Mis Cursos Coordinados
        </h1>

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            tabIndex={0}
            className="text-dark fw-bold"
          >
            Cargando cursos...
          </div>
        ) : error ? (
          <div
            className="alert alert-danger"
            role="alert"
            tabIndex={0}
            aria-label="Mensaje de error al cargar los cursos"
          >
            {error}
          </div>
        ) : cursos.length === 0 ? (
          <p
            aria-live="polite"
            tabIndex={0}
            className="text-muted"
          >
            No tienes cursos asignados por el momento.
          </p>
        ) : (
          <div
            className="table-responsive"
            role="region"
            aria-labelledby="tabla-cursos-titulo"
          >
            <table
              className="table table-bordered table-striped align-middle"
              aria-describedby="tabla-cursos-titulo"
            >
              <caption id="tabla-cursos-titulo" className="visually-hidden">
                Tabla de cursos coordinados con botón para generar syllabus.
              </caption>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Semestre</th>
                  <th scope="col">Créditos</th>
                  <th scope="col">Generar Syllabus</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso) => (
                  <tr key={curso.id}>
                    <td tabIndex={0}>{curso.code}</td>
                    <td tabIndex={0}>{curso.name}</td>
                    <td tabIndex={0}>{curso.semester}</td>
                    <td tabIndex={0}>{curso.credits}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm fw-bold"
                        onClick={() => handleGenerarSyllabus(curso.id)}
                        aria-label={`Generar syllabus para el curso ${curso.name}`}
                        style={{
                          backgroundColor: '#157347',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.outline = '2px solid #000';
                          e.currentTarget.style.outlineOffset = '2px';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.outline = 'none';
                        }}
                      >
                        Generar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
