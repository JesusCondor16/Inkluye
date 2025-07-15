'use client';

import React, { useEffect, useRef } from 'react';

export default function ModalSeccion1({ curso, sumilla, setSumilla, onClose }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGuardar = async () => {
    try {
      const res = await fetch(`/api/cursos/${curso.id}/seccion1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sumilla }),
      });

      if (!res.ok) throw new Error('Error al guardar');

      alert('Guardado correctamente');
      onClose();
    } catch (err) {
      console.error('Error al guardar sumilla:', err);
      alert('Ocurrió un error al guardar.');
    }
  };

  return (
    <div
      className="modal show d-block"
      role="dialog"
      aria-labelledby="modalInfoGeneral"
      aria-modal="true"
      aria-describedby="infoGeneralContenido"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content" role="document">
          <div
            className="modal-header"
            style={{ backgroundColor: '#003366', color: '#ffffff' }}
          >
            <h5 className="modal-title" id="modalInfoGeneral" tabIndex={0}>
              1. Información general del curso
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar modal"
              onClick={onClose}
              onFocus={(e) => (e.currentTarget.style.outline = '2px solid #f6c744')}
              onBlur={(e) => (e.currentTarget.style.outline = 'none')}
            ></button>
          </div>

          <div className="modal-body" id="infoGeneralContenido">
            <dl className="row">
              <dt className="col-sm-4">1.1 Nombre de la asignatura:</dt>
              <dd className="col-sm-8">{curso?.name}</dd>

              <dt className="col-sm-4">1.2 Código de la asignatura:</dt>
              <dd className="col-sm-8">{curso?.code}</dd>

              <dt className="col-sm-4">1.3 Tipo de asignatura:</dt>
              <dd className="col-sm-8">{curso?.type}</dd>

              <dt className="col-sm-4">1.4 Área de estudios:</dt>
              <dd className="col-sm-8">{curso?.area}</dd>

              <dt className="col-sm-4">1.5 Número de semanas:</dt>
              <dd className="col-sm-8">{curso?.weeks}</dd>

              <dt className="col-sm-4">1.6 Horas semanales:</dt>
              <dd className="col-sm-8">
                Teoría: {curso?.theoryHours ?? 0}, Laboratorio: {curso?.labHours ?? 0}, Práctica: {curso?.practiceHours ?? 0}
              </dd>

              <dt className="col-sm-4">1.7 Semestre académico:</dt>
              <dd className="col-sm-8">{curso?.semester}</dd>

              <dt className="col-sm-4">1.8 Ciclo:</dt>
              <dd className="col-sm-8">{curso?.cycle}</dd>

              <dt className="col-sm-4">1.9 Créditos:</dt>
              <dd className="col-sm-8">{curso?.credits}</dd>

              <dt className="col-sm-4">1.10 Modalidad:</dt>
              <dd className="col-sm-8">{curso?.modality}</dd>

              <dt className="col-sm-4">1.11 Pre-requisitos:</dt>
              <dd className="col-sm-8">
                {curso?.prerequisites?.map((p) => p.prerequisite?.name).join(', ') || '—'}
              </dd>

              <dt className="col-sm-4">1.12 Docente(s):</dt>
              <dd className="col-sm-8">
                {curso?.cursoDocentes?.map((d) => d.user?.name).join(', ') || '—'}
              </dd>

              <dt className="col-sm-4">1.13 Coordinador:</dt>
              <dd className="col-sm-8">{curso?.coordinador?.name || '—'}</dd>
            </dl>

            <hr className="my-4" />
            <h5 id="titulo-sumilla" tabIndex={0}>2. Sumilla</h5>

            <label htmlFor="sumilla" className="form-label visually-hidden">
              Sumilla del curso
            </label>
            <textarea
              ref={textareaRef}
              id="sumilla"
              className="form-control"
              rows={5}
              maxLength={1000}
              value={sumilla}
              onChange={(e) => setSumilla(e.target.value)}
              placeholder="Escriba la sumilla del curso (máx. 1000 caracteres)"
              aria-labelledby="titulo-sumilla"
              aria-describedby="sumilla-contador"
              required
            />
            <div
              id="sumilla-contador"
              className="text-end text-muted mt-1"
              aria-live="polite"
              tabIndex={0}
            >
              {sumilla.length}/1000 caracteres
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              aria-label="Cerrar modal sin guardar cambios"
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGuardar}
              aria-label="Guardar la sumilla del curso"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
