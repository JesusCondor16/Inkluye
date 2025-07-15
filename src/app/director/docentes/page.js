'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ModalAgregarDocente from '@/components/ModalAgregarDocente';
import ModalEditarDocente from '@/components/ModalEditarDocente';
import ModalHistorialDocente from '@/components/ModalHistorialDocente';
import { Pencil, Trash2, Clock } from 'lucide-react';

export default function GestionDocentesPage() {
  const [docentes, setDocentes] = useState([]);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const cargarDocentes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users?roles=DOCENTE,COORDINADOR', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error al obtener docentes:', errorText);
        return;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('Respuesta no es JSON');
        return;
      }

      const data = await res.json();
      setDocentes(data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    }
  };

  useEffect(() => {
    cargarDocentes();
  }, []);

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este docente?');
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el docente');
        return;
      }

      setMensaje('Docente eliminado correctamente.');
      cargarDocentes();
      setTimeout(() => setMensaje(''), 5000);
    } catch (error) {
      console.error('Error en la petición de eliminación:', error);
      alert('No se pudo eliminar el docente');
    }
  };

  const handleEditClick = (docente) => {
    setDocenteSeleccionado(docente);
    setMostrarEditar(true);
  };

  const verHistorial = (docente) => {
    setDocenteSeleccionado(docente);
    setMostrarHistorial(true);
  };

  return (
    <div className="d-flex" role="main" aria-label="Gestión de docentes académicos por el director">
      <Sidebar />

      <div className="container mt-4 mb-5" style={{ maxWidth: '100%' }}>
        <header
          className="d-flex justify-content-between align-items-center mb-4"
          aria-labelledby="titulo-gestion-docentes"
        >
          <h1 className="h3 text-primary" tabIndex={0} id="titulo-gestion-docentes">
            Gestión de Docentes
          </h1>
          <button
            className="btn btn-primary fw-bold"
            onClick={() => {
              setDocenteSeleccionado(null);
              setMostrarAgregar(true);
            }}
            aria-label="Agregar nuevo docente"
          >
            + Añadir Docente
          </button>
        </header>

        {mensaje && (
          <div
            className="alert alert-info"
            role="alert"
            aria-live="polite"
            tabIndex={0}
          >
            {mensaje}
          </div>
        )}

        <div
          className="table-responsive"
          role="region"
          aria-labelledby="tabla-docentes"
        >
          <table
            className="table table-bordered table-hover"
            aria-label="Tabla de docentes registrados"
          >
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docentes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted" tabIndex={0}>
                    No hay docentes registrados actualmente.
                  </td>
                </tr>
              ) : (
                docentes.map((docente, index) => (
                  <tr key={docente.id}>
                    <td tabIndex={0}>{index + 1}</td>
                    <td tabIndex={0}>{docente.name}</td>
                    <td tabIndex={0}>{docente.email}</td>
                    <td tabIndex={0}>{docente.role}</td>
                    <td>
                      <div
                        className="d-flex flex-wrap gap-2"
                        role="group"
                        aria-label={`Acciones para el docente ${docente.name}`}
                      >
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditClick(docente)}
                          aria-label={`Editar docente ${docente.name}`}
                        >
                          <Pencil size={16} className="me-1" aria-hidden="true" />
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleEliminar(docente.id)}
                          aria-label={`Eliminar docente ${docente.name}`}
                        >
                          <Trash2 size={16} className="me-1" aria-hidden="true" />
                          Eliminar
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => verHistorial(docente)}
                          aria-label={`Ver historial del docente ${docente.name}`}
                        >
                          <Clock size={16} className="me-1" aria-hidden="true" />
                          Historial
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODALES */}
        {mostrarAgregar && (
          <ModalAgregarDocente
            onClose={() => setMostrarAgregar(false)}
            onSuccess={cargarDocentes}
          />
        )}

        {mostrarEditar && docenteSeleccionado && (
          <ModalEditarDocente
            docente={docenteSeleccionado}
            onClose={() => {
              setMostrarEditar(false);
              setDocenteSeleccionado(null);
            }}
            onSuccess={() => {
              setMostrarEditar(false);
              setDocenteSeleccionado(null);
              cargarDocentes();
            }}
          />
        )}

        {mostrarHistorial && docenteSeleccionado && (
          <ModalHistorialDocente
            docente={docenteSeleccionado}
            onClose={() => {
              setMostrarHistorial(false);
              setDocenteSeleccionado(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
