'use client';

import { useState, useEffect } from 'react';

export default function ModalSeccion2({ cursoId, onClose }) {
  const [competencias, setCompetencias] = useState([
    { codigo: '', descripcion: '', tipo: '', nivel: '' },
  ]);
  const [logros, setLogros] = useState([
    { codigo: '', descripcion: '' },
  ]);

  useEffect(() => {
    if (!cursoId || isNaN(cursoId)) return;

    const cargarDatos = async () => {
      try {
        const res = await fetch(`/api/cursos/${cursoId}/seccion2`);
        const data = await res.json();

        if (res.ok) {
          setCompetencias(
            data.competencias.length > 0
              ? data.competencias
              : [{ codigo: '', descripcion: '', tipo: '', nivel: '' }]
          );
          setLogros(
            data.logros.length > 0
              ? data.logros
              : [{ codigo: '', descripcion: '' }]
          );
        } else {
          console.error('Error al cargar sección 2:', data?.error || 'Desconocido');
        }
      } catch (err) {
        console.error('Error al cargar sección 2:', err);
      }
    };

    cargarDatos();
  }, [cursoId]);

  useEffect(() => {
    setLogros((prevLogros) =>
      competencias.map((c, i) => ({
        codigo: prevLogros[i]?.codigo?.startsWith(c.codigo)
          ? prevLogros[i].codigo
          : c.codigo,
        descripcion: prevLogros[i]?.descripcion || '',
      }))
    );
  }, [competencias]);

  const agregarFilaCompetencia = () => {
    if (competencias.length < 4) {
      setCompetencias([...competencias, { codigo: '', descripcion: '', tipo: '', nivel: '' }]);
    }
  };

  const actualizarCompetencia = (index, campo, valor) => {
    const nuevas = [...competencias];
    nuevas[index][campo] = valor;
    setCompetencias(nuevas);
  };

  const actualizarLogro = (index, campo, valor) => {
    const nuevos = [...logros];
    nuevos[index][campo] = valor;
    setLogros(nuevos);
  };

  const handleGuardar = async () => {
    if (!cursoId || isNaN(cursoId)) {
      alert('ID de curso inválido');
      return;
    }

    try {
      const res = await fetch(`/api/cursos/${cursoId}/seccion2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competencias, logros }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Error al guardar sección 2');
      }

      alert('Sección 2 guardada correctamente');
      onClose();
    } catch (err) {
      console.error('Error al guardar sección 2:', err);
      alert('Error al guardar los datos.');
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="modalCompetencias"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content" role="document">
          <div
            className="modal-header"
            style={{ backgroundColor: '#003366', color: '#fff' }}
          >
            <h5 className="modal-title" id="modalCompetencias" tabIndex={0}>
              3. Competencias del perfil de egreso
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar modal"
              onClick={onClose}
              onFocus={(e) => (e.currentTarget.style.outline = '2px solid #f6c744')}
              onBlur={(e) => (e.currentTarget.style.outline = 'none')}
            />
          </div>

          <div className="modal-body">
            <fieldset>
              <legend className="visually-hidden">Competencias</legend>
              <table className="table table-bordered" aria-label="Tabla de competencias del perfil de egreso">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {competencias.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <label htmlFor={`codigo-${i}`} className="visually-hidden">Código</label>
                        <input
                          id={`codigo-${i}`}
                          type="text"
                          maxLength={7}
                          className="form-control"
                          value={c.codigo}
                          onChange={(e) => actualizarCompetencia(i, 'codigo', e.target.value)}
                        />
                      </td>
                      <td>
                        <label htmlFor={`descripcion-${i}`} className="visually-hidden">Descripción</label>
                        <input
                          id={`descripcion-${i}`}
                          type="text"
                          maxLength={500}
                          className="form-control"
                          value={c.descripcion}
                          onChange={(e) => actualizarCompetencia(i, 'descripcion', e.target.value)}
                        />
                      </td>
                      <td>
                        <label htmlFor={`tipo-${i}`} className="visually-hidden">Tipo</label>
                        <select
                          id={`tipo-${i}`}
                          className="form-select"
                          value={c.tipo}
                          onChange={(e) => actualizarCompetencia(i, 'tipo', e.target.value)}
                        >
                          <option value="">Seleccione</option>
                          <option value="Genérico">Genérico</option>
                          <option value="Especialidad">Especialidad</option>
                        </select>
                      </td>
                      <td>
                        <label htmlFor={`nivel-${i}`} className="visually-hidden">Nivel</label>
                        <select
                          id={`nivel-${i}`}
                          className="form-select"
                          value={c.nivel}
                          onChange={(e) => actualizarCompetencia(i, 'nivel', e.target.value)}
                        >
                          <option value="">Seleccione</option>
                          <option value="Básico">Básico</option>
                          <option value="Intermedio">Intermedio</option>
                          <option value="Avanzado">Avanzado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {competencias.length < 4 && (
                <button
                  className="btn btn-outline-primary mb-3"
                  onClick={agregarFilaCompetencia}
                  aria-label="Agregar una nueva fila de competencia"
                >
                  + Agregar Competencia
                </button>
              )}
            </fieldset>

            <hr className="my-4" />

            <fieldset>
              <legend className="h5 mb-3" tabIndex={0}>
                4. Logros de aprendizaje (Competencia de la asignatura)
              </legend>
              {logros.map((l, i) => (
                <div className="row mb-3" key={i}>
                  <div className="col-md-3">
                    <label htmlFor={`logro-codigo-${i}`} className="form-label">
                      Código
                    </label>
                    <input
                      id={`logro-codigo-${i}`}
                      type="text"
                      className="form-control"
                      value={l.codigo}
                      onChange={(e) => actualizarLogro(i, 'codigo', e.target.value)}
                    />
                  </div>
                  <div className="col-md-9">
                    <label htmlFor={`logro-desc-${i}`} className="form-label">
                      Descripción
                    </label>
                    <textarea
                      id={`logro-desc-${i}`}
                      className="form-control"
                      rows={2}
                      maxLength={500}
                      value={l.descripcion}
                      onChange={(e) => actualizarLogro(i, 'descripcion', e.target.value)}
                      placeholder="Máximo 500 caracteres"
                      aria-describedby={`desc-help-${i}`}
                    />
                    <div id={`desc-help-${i}`} className="form-text">
                      Máximo 500 caracteres
                    </div>
                  </div>
                </div>
              ))}
            </fieldset>
          </div>

          <div className="modal-footer d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              aria-label="Cerrar sin guardar cambios"
              onFocus={(e) => e.currentTarget.style.outline = '2px solid #000'}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              Cerrar
            </button>
            <button
              className="btn btn-success"
              onClick={handleGuardar}
              aria-label="Guardar competencias y logros de aprendizaje"
              onFocus={(e) => e.currentTarget.style.outline = '2px solid #000'}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
