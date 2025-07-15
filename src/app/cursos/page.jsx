'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function GestionCursosPage() {
  const [cursos, setCursos] = useState([]);
  const [alerta, setAlerta] = useState('');

  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => {
        console.error('Error al cargar cursos:', err);
        setAlerta('Error al cargar cursos');
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este curso?')) return;

    const res = await fetch(`/api/cursos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCursos(prev => prev.filter(curso => curso.id !== id));
      setAlerta('Curso eliminado correctamente');
    } else {
      setAlerta('Error al eliminar curso');
    }

    // Ocultar mensaje luego de unos segundos
    setTimeout(() => setAlerta(''), 5000);
  };

  return (
    <div className="d-flex" role="main" aria-label="Gestión de cursos académicos">
      <Sidebar />

      <div className="container mt-4 mb-5">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3" tabIndex={0} id="titulo-gestion-cursos">
            Gestión de Cursos
          </h2>
          <Link
            href="/cursos/agregar"
            className="btn btn-primary"
            aria-label="Agregar nuevo curso"
          >
            + Agregar Curso
          </Link>
        </header>

        {/* Alerta accesible */}
        {alerta && (
          <div
            className="alert alert-info"
            role="alert"
            aria-live="assertive"
          >
            {alerta}
          </div>
        )}

        <div
          className="table-responsive"
          role="region"
          aria-labelledby="titulo-gestion-cursos"
        >
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Coordinador</th>
                <th scope="col">Docentes</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cursos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center" tabIndex={0}>
                    No hay cursos registrados.
                  </td>
                </tr>
              ) : (
                cursos.map(curso => (
                  <tr key={curso.id}>
                    <td>{curso.code}</td>
                    <td>{curso.name}</td>
                    <td>{curso.coordinador?.name || 'No asignado'}</td>
                    <td>{curso.docentes.map(d => d.name).join(', ')}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {/* Descomenta si implementas edición */}
                        {/* <Link
                          href={`/cursos/editar/${curso.id}`}
                          className="btn btn-sm btn-warning"
                          aria-label={`Editar curso ${curso.name}`}
                        >
                          Editar
                        </Link> */}
                        <button
                          onClick={() => handleDelete(curso.id)}
                          className="btn btn-sm btn-danger"
                          aria-label={`Eliminar curso ${curso.name}`}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid black';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
