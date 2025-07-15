'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ModalSeccion3({ onClose }) {
  const { id: cursoId } = useParams();
  const [capacidades, setCapacidades] = useState([]);
  const [programaciones, setProgramaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchCapacidades() {
    try {
      const res = await fetch(`/api/cursos/${cursoId}/seccion3`);
      if (res.ok) {
        const data = await res.json();

        const inicialCapacidades = data.length > 0 ? data : [{ nombre: '', descripcion: '' }];
        const inicialProgramaciones = inicialCapacidades.map((unidad, i) => ({
          logroUnidad: unidad.logro || '',
          filas: unidad.filas?.map((fila, j) => ({
            semana: fila.sem || '',
            contenido: fila.contenido || '',
            actividades: fila.actividades || '',
            recursos: fila.recursos || '',
            estrategias: fila.estrategias || '',
            fixed: (i === 1 && j === 3) || (i === 3 && j === 3),
          })) || Array(4).fill().map((_, j) => ({
            semana: '',
            contenido: '',
            actividades: '',
            recursos: '',
            estrategias: '',
            fixed: false,
          }))
        }));

        setCapacidades(inicialCapacidades);
        setProgramaciones(inicialProgramaciones);
      } else {
        throw new Error('No se pudieron obtener capacidades');
      }
    } catch (err) {
      console.error('Error al cargar capacidades:', err);
    } finally {
      setLoading(false);
    }
  }

  fetchCapacidades();
}, [cursoId]);

  const handleAgregarCapacidad = () => {
    if (capacidades.length < 5) {
      const nuevaUnidadIndex = capacidades.length;
      setCapacidades([...capacidades, { nombre: '', descripcion: '' }]);
      setProgramaciones([
        ...programaciones,
        {
          logroUnidad: '',
          filas: Array(4).fill().map((_, j) => {
            if (nuevaUnidadIndex === 1 && j === 3) return { semana: '8', contenido: 'Examen parcial', actividades: '', recursos: '', estrategias: '', fixed: true };
            if (nuevaUnidadIndex === 3 && j === 3) return { semana: '16', contenido: 'Examen final', actividades: '', recursos: '', estrategias: '', fixed: true };
            return { semana: '', contenido: '', actividades: '', recursos: '', estrategias: '', fixed: false };
          })
        }
      ]);
    }
  };

  const handleEliminarCapacidad = (index) => {
    const nuevasCap = [...capacidades];
    nuevasCap.splice(index, 1);
    setCapacidades(nuevasCap);

    const nuevasProg = [...programaciones];
    nuevasProg.splice(index, 1);
    setProgramaciones(nuevasProg);
  };

  const handleActualizar = (index, campo, valor) => {
    const nuevas = [...capacidades];
    nuevas[index][campo] = valor;
    setCapacidades(nuevas);
  };

  const handleActualizarLogro = (unidadIndex, valor) => {
    const nuevas = [...programaciones];
    nuevas[unidadIndex].logroUnidad = valor;
    setProgramaciones(nuevas);
  };

  const handleActualizarFila = (unidadIndex, filaIndex, campo, valor) => {
    const nuevas = [...programaciones];
    const fila = nuevas[unidadIndex].filas[filaIndex];
    if (fila.fixed && (campo === 'semana' || campo === 'contenido')) return;
    fila[campo] = valor;
    setProgramaciones(nuevas);
  };

  const guardarCapacidades = async () => {
  try {
    const unidades = capacidades.map((cap, i) => ({
      nombre: cap.nombre,
      descripcion: cap.descripcion,
      logro: programaciones[i]?.logroUnidad || '',
      filas: programaciones[i]?.filas.map((fila) => ({
        sem: fila.semana,
        contenido: fila.contenido,
        actividades: fila.actividades,
        recursos: fila.recursos,
        estrategias: fila.estrategias,
      })) || []
    }));

    const res = await fetch(`/api/cursos/${cursoId}/seccion3`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unidades),
    });

    if (res.ok) {
      alert('Capacidades y programación guardadas correctamente.');
      onClose();
    } else {
      alert('Error al guardar los datos.');
    }
  } catch (error) {
    console.error('Error al guardar datos:', error);
    alert('Error de conexión al guardar.');
  }
};

    return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-describedby="modalDesc"
      style={{ backgroundColor: '#000000b3' }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content" role="region" aria-labelledby="modalTitle">
          <div className="modal-header bg-black text-white">
            <h5 className="modal-title" id="modalTitle">Sección de Capacidades y Programación de contenidos</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={onClose} />
          </div>

          <div className="modal-body" id="modalDesc">
            <h6 className="text-uppercase fw-bold mb-4">5. CAPACIDADES</h6>

            {capacidades.map((cap, i) => (
              <div key={i} className="border rounded bg-white text-dark p-3 mb-4">
                <fieldset>
                  <legend className="h6">Unidad {i + 1}</legend>

                  <div className="mb-3">
                    <label htmlFor={`nombreUnidad-${i}`} className="form-label">Nombre de la unidad</label>
                    <input
                      id={`nombreUnidad-${i}`}
                      type="text"
                      maxLength={150}
                      className="form-control"
                      value={cap.nombre}
                      onChange={(e) => handleActualizar(i, 'nombre', e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor={`descripcionUnidad-${i}`} className="form-label">Descripción</label>
                    <textarea
                      id={`descripcionUnidad-${i}`}
                      className="form-control"
                      maxLength={250}
                      rows={3}
                      value={cap.descripcion}
                      onChange={(e) => handleActualizar(i, 'descripcion', e.target.value)}
                    />
                  </div>

                  <div className="text-end">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleEliminarCapacidad(i)}
                      aria-label={`Eliminar Unidad ${i + 1}`}
                    >
                      Eliminar Unidad
                    </button>
                  </div>
                </fieldset>
              </div>
            ))}

            {capacidades.length < 4 && (
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleAgregarCapacidad} aria-label="Agregar nueva unidad">
                  + Agregar Unidad
                </button>
              </div>
            )}

            <h6 className="text-uppercase fw-bold mt-5 mb-3">6. PROGRAMACIÓN DE CONTENIDOS</h6>

            {programaciones.map((prog, i) => (
              <div key={i} className="mb-5">
                <h6 className="fw-semibold">Unidad {i + 1}: {capacidades[i]?.nombre || '---'}</h6>

                <div className="mb-3">
                  <label htmlFor={`logroUnidad-${i}`} className="form-label">
                    Logro de la unidad (máx. 250 caracteres)
                  </label>
                  <textarea
                    id={`logroUnidad-${i}`}
                    className="form-control"
                    maxLength={250}
                    rows={2}
                    value={prog.logroUnidad}
                    onChange={(e) => handleActualizarLogro(i, e.target.value)}
                  />
                </div>

                <div className="table-responsive" role="region" aria-label={`Tabla de contenidos unidad ${i + 1}`}>
                  <table className="table table-bordered text-center align-middle" aria-describedby={`logroUnidad-${i}`}>
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Semana</th>
                        <th scope="col">Contenido</th>
                        <th scope="col">Actividades</th>
                        <th scope="col">Recursos</th>
                        <th scope="col">Estrategias</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prog.filas.map((fila, j) => (
                        <tr key={j}>
                          <td>
                            <input
                              type="text"
                              maxLength={2}
                              className="form-control"
                              value={fila.semana}
                              disabled={fila.fixed}
                              aria-label={`Semana ${j + 1}`}
                              onChange={(e) => handleActualizarFila(i, j, 'semana', e.target.value)}
                            />
                          </td>
                          {fila.fixed ? (
                            <td colSpan={4} className="fw-bold bg-light" aria-label={fila.contenido}>
                              {fila.contenido}
                            </td>
                          ) : (
                            <>
                              <td>
                                <input
                                  type="text"
                                  maxLength={250}
                                  className="form-control"
                                  value={fila.contenido}
                                  aria-label={`Contenido semana ${j + 1}`}
                                  onChange={(e) => handleActualizarFila(i, j, 'contenido', e.target.value)}
                                />
                              </td>
                              <td>
                                <textarea
                                  maxLength={500}
                                  rows={2}
                                  className="form-control"
                                  value={fila.actividades}
                                  aria-label={`Actividades semana ${j + 1}`}
                                  onChange={(e) => handleActualizarFila(i, j, 'actividades', e.target.value)}
                                />
                              </td>
                              <td>
                                <textarea
                                  type="text"
                                  maxLength={250}
                                  rows={2}
                                  className="form-control"
                                  value={fila.recursos}
                                  aria-label={`Recursos semana ${j + 1}`}
                                  onChange={(e) => handleActualizarFila(i, j, 'recursos', e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  maxLength={250}
                                  className="form-control"
                                  value={fila.estrategias}
                                  aria-label={`Estrategias semana ${j + 1}`}
                                  onChange={(e) => handleActualizarFila(i, j, 'estrategias', e.target.value)}
                                />
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={onClose} aria-label="Cerrar ventana del modal">Cerrar</button>
            <button className="btn btn-success" onClick={guardarCapacidades} aria-label="Guardar capacidades y cerrar">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
