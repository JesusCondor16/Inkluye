'use client';

import { useEffect, useState } from 'react';

export default function ModalHistorialDocente({ docente, onClose }) {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch(`/api/users/${docente.id}/history`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setHistorial(data);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        alert('No se pudo cargar el historial');
      }
    };

    if (docente?.id) fetchHistorial();
  }, [docente]);

  return (
    <div
      className="modal d-block"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tituloHistorialDocente"
      aria-describedby="descripcionModalHistorial"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          {/* Encabezado */}
          <div
            className="modal-header"
            style={{ backgroundColor: '#003366', color: '#ffffff' }}
          >
            <h5
              className="modal-title"
              id="tituloHistorialDocente"
              tabIndex={0}
            >
              Historial de cambios: {docente?.name}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar historial del docente"
              onClick={onClose}
            ></button>
          </div>

          {/* Descripción accesible */}
          <div id="descripcionModalHistorial" className="visually-hidden">
            Este modal muestra el historial de modificaciones realizadas al docente seleccionado, incluyendo fecha, usuario responsable y descripción del cambio.
          </div>

          {/* Cuerpo */}
          <div className="modal-body" role="region" aria-labelledby="tituloHistorialDocente">
            {historial.length === 0 ? (
              <p tabIndex={0}>No hay historial disponible.</p>
            ) : (
              <div className="table-responsive">
                <table
                  className="table table-bordered table-hover align-middle"
                  aria-describedby="tablaHistorialDescripcion"
                >
                  <caption id="tablaHistorialDescripcion" className="visually-hidden">
                    Tabla que muestra el historial de cambios realizados a un docente, incluyendo fecha, responsable, rol y descripción del cambio.
                  </caption>
                  <thead style={{ backgroundColor: '#f8f9fa', color: '#212529' }}>
                    <tr>
                      <th scope="col">Fecha</th>
                      <th scope="col">Responsable</th>
                      <th scope="col">Rol</th>
                      <th scope="col">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item) => (
                      <tr key={item.id}>
                        <td>{new Date(item.changeDate).toLocaleString()}</td>
                        <td>{item.changedBy}</td>
                        <td>{item.changedByRole}</td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#6c757d',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#565e64')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
              onFocus={(e) => (e.currentTarget.style.outline = '2px solid black')}
              onBlur={(e) => (e.currentTarget.style.outline = 'none')}
              aria-label="Cerrar modal de historial del docente"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
