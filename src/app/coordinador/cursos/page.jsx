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
        setError('⚠️ No se encontró el token de autenticación.');
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
        setError(`⚠️ ${err.message}`);
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
      className="d-flex bg-light text-dark"
      role="main"
      aria-label="Vista principal de cursos coordinados"
      style={{ minHeight: '100vh' }}
    >
      <Sidebar />

      <main className="container mt-4 mb-5" aria-labelledby="titulo-mis-cursos">
        <h1
          id="titulo-mis-cursos"
          className="display-5 fw-bold text-primary mb-4"
          tabIndex={0}
        >
          🎓 Mis Cursos Coordinados
        </h1>

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            tabIndex={0}
            className="text-info fw-semibold"
          >
            ⏳ Cargando cursos...
          </div>
        ) : error ? (
          <div
            className="alert alert-danger fw-semibold"
            role="alert"
            tabIndex={0}
            aria-label="Mensaje de error"
          >
            {error}
          </div>
        ) : cursos.length === 0 ? (
          <p
            aria-live="polite"
            tabIndex={0}
            className="text-muted fw-semibold"
          >
            📭 No tienes cursos asignados por el momento.
          </p>
        ) : (
          <div
            className="table-responsive"
            role="region"
            aria-labelledby="tabla-cursos-titulo"
          >
            <table
              className="table table-bordered table-hover table-striped align-middle shadow-sm"
              aria-describedby="tabla-cursos-titulo"
            >
              <caption id="tabla-cursos-titulo" className="visually-hidden">
                Lista de cursos coordinados con opción para generar syllabus
              </caption>
              <thead className="table-primary">
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Semestre</th>
                  <th scope="col">Créditos</th>
                  <th scope="col">Acción</th>
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
                        type="button"
                        className="btn btn-success btn-sm fw-bold"
                        onClick={() => handleGenerarSyllabus(curso.id)}
                        aria-label={`Generar syllabus para el curso ${curso.name}`}
                        style={{
                          borderRadius: '0.375rem',
                          transition: 'box-shadow 0.2s ease-in-out',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.outline = '3px solid #000';
                          e.currentTarget.style.outlineOffset = '2px';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.outline = 'none';
                        }}
                      >
                        📝 Generar
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
