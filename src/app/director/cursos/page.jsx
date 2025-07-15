'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';

export default function GestionCursosPage() {
  const [cursos, setCursos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const cargarCursos = async () => {
    try {
      const res = await fetch('/api/cursos');
      const data = await res.json();
      setCursos(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setMensaje('Error al cargar cursos.');
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const eliminarCurso = async (id) => {
    const confirmacion = confirm('¿Estás seguro de eliminar este curso?');
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMensaje('Token no encontrado.');
        return;
      }

      const res = await fetch(`/api/cursos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMensaje('Curso eliminado correctamente.');
        cargarCursos();
      } else {
        const error = await res.json();
        setMensaje('Error al eliminar curso: ' + error.error);
      }
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      setMensaje('Ocurrió un error al eliminar el curso.');
    }

    setTimeout(() => setMensaje(''), 5000);
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container mt-4 mb-5" style={{ maxWidth: '100%' }}>
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 text-primary">Gestión de Cursos</h1>
          <Link href="/director/cursos/agregar" className="btn btn-primary fw-bold">
            + Agregar Curso
          </Link>
        </header>

        {mensaje && (
          <div className="alert alert-info" role="alert">
            {mensaje}
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Semestre</th>
                <th>Coordinador</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cursos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No hay cursos registrados.
                  </td>
                </tr>
              ) : (
                cursos.map((curso) => (
                  <tr key={curso.id}>
                    <td>{curso.code}</td>
                    <td>{curso.name}</td>
                    <td>{curso.semester || '—'}</td>
                    <td>{curso.coordinador?.name || '—'}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link
                          href={`/director/cursos/${curso.id}/editar`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminarCurso(curso.id)}
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
