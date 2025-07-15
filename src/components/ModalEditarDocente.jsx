'use client';

import { useEffect, useState } from 'react';

export default function ModalEditarDocente({ docente, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'DOCENTE',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (docente) {
      setFormData({
        name: docente.name || '',
        email: docente.email || '',
        role: docente.role || 'DOCENTE',
      });
    }
  }, [docente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docente?.id) {
      setErrorMsg('No se encontró el ID del docente a editar.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('No se encontró el token de autenticación.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(`/api/users/${docente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Error al editar docente');
      }

      onClose();
      onSuccess();
    } catch (error) {
      setErrorMsg('Ocurrió un error al editar el docente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal d-block"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalEditarDocenteTitulo"
      aria-describedby="modalEditarDocenteDescripcion"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit} aria-label="Formulario para editar docente">
            {/* Header */}
            <div className="modal-header" style={{ backgroundColor: '#003366', color: '#ffffff' }}>
              <h5
                className="modal-title"
                id="modalEditarDocenteTitulo"
                tabIndex={0}
              >
                Editar Docente
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Cerrar formulario de edición de docente"
                onClick={onClose}
              ></button>
            </div>

            {/* Descripción accesible oculta */}
            <div id="modalEditarDocenteDescripcion" className="visually-hidden">
              Este formulario permite modificar el nombre, correo electrónico y rol del docente seleccionado.
            </div>

            {/* Mensaje de error */}
            {errorMsg && (
              <div
                role="alert"
                className="alert alert-danger m-3"
                aria-live="assertive"
              >
                {errorMsg}
              </div>
            )}

            {/* Body */}
            <div className="modal-body" role="region" aria-labelledby="modalEditarDocenteTitulo">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">Rol</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  aria-required="true"
                >
                  <option value="DOCENTE">Docente</option>
                  <option value="COORDINADOR">Coordinador</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="submit"
                disabled={loading}
                aria-label="Guardar cambios del docente"
                style={{
                  backgroundColor: '#006400',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#004d00')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#006400')}
                onFocus={(e) => (e.currentTarget.style.outline = '2px solid black')}
                onBlur={(e) => (e.currentTarget.style.outline = 'none')}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                aria-label="Cancelar edición del docente"
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
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
