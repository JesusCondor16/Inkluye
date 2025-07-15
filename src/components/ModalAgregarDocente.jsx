'use client';

import { useState, useEffect } from 'react';

export default function ModalAgregarDocente({ onClose, onSuccess, docente }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DOCENTE',
  });

  useEffect(() => {
    if (docente) {
      setForm({
        name: docente.name,
        email: docente.email,
        password: '',
        role: docente.role,
      });
    }
  }, [docente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    const url = docente ? `/api/users/${docente.id}` : '/api/users';
    const method = docente ? 'PUT' : 'POST';

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    if (!docente) payload.password = form.password;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onClose();
        onSuccess();
      } else {
        const err = await res.text();
        alert(`Error al ${docente ? 'editar' : 'registrar'} docente: ` + err);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Ocurrió un error al enviar el formulario.');
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-agregar-docente-titulo"
      aria-describedby="modal-agregar-docente-desc"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit} aria-label="Formulario para añadir o editar un docente">
            {/* Header */}
            <div
              className="modal-header"
              style={{ backgroundColor: '#003366', color: '#ffffff' }}
            >
              <h5
                className="modal-title"
                id="modal-agregar-docente-titulo"
                tabIndex={0}
              >
                {docente ? 'Editar Docente' : 'Añadir a personal'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Cerrar modal de docente"
              ></button>
            </div>

            {/* Descripción accesible oculta */}
            <div id="modal-agregar-docente-desc" className="visually-hidden">
              Este formulario permite registrar o editar los datos de un docente, incluyendo nombre, correo, contraseña y rol.
            </div>

            {/* Body */}
            <div className="modal-body" role="region" aria-labelledby="modal-agregar-docente-titulo">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              {!docente && (
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="role" className="form-label">Rol</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={form.role}
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
                className="btn"
                style={{
                  backgroundColor: '#0d6efd',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#084298')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0d6efd')}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid black';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                aria-label={docente ? 'Guardar cambios del docente' : 'Registrar nuevo docente'}
              >
                Guardar
              </button>

              <button
                type="button"
                className="btn"
                style={{
                  backgroundColor: '#6c757d',
                  color: '#ffffff',
                  border: 'none',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#565e64')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
                onClick={onClose}
                aria-label="Cancelar registro o edición de docente"
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
