'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function ModalSeccion4({ onClose }) {
  const { id } = useParams();
  const cursoId = parseInt(id, 10);
  const [estrategia, setEstrategia] = useState('');
  const [evaluacion, setEvaluacion] = useState('');
  const [formula, setFormula] = useState('');
  const [notas, setNotas] = useState(['']);
  const [matriz, setMatriz] = useState([]);
  const [bibliografias, setBibliografias] = useState(['']);
  const [unidades, setUnidades] = useState([]);
  const estrategiaRef = useRef(null);

  useEffect(() => {
    if (!cursoId || isNaN(cursoId)) return;

    const fetchTodo = async () => {
      let matrizDesdeBackend = [];

      try {
        const res = await fetch(`/api/cursos/${cursoId}/seccion4`);
        const data = await res.json();

        if (res.ok) {
          const { evaluacion, bibliografia, matriz } = data;

          if (evaluacion) {
            setEstrategia(evaluacion.estrategia ?? '');
            setEvaluacion(evaluacion.evaluacion ?? '');
            setFormula(evaluacion.formula ?? '');
            setNotas(evaluacion.notas?.map(n => n.texto ?? '') ?? ['']);
          }

          setBibliografias(bibliografia?.map(b => b.texto ?? '') ?? ['']);

          if (matriz) {
            matrizDesdeBackend = matriz.map(fila => ({
              unidad: fila.unidad ?? '',
              criterio: fila.criterio ?? '',
              desempenio: fila.desempenio ?? '',
              producto: fila.producto ?? '',
              instrumento: fila.instrumento ?? '',
            }));
            setMatriz(matrizDesdeBackend);
          }
        } else {
          console.error('Error al cargar sección 4:', data?.error || 'Desconocido');
        }
      } catch (err) {
        console.error('Error cargando sección 4:', err);
      }

      try {
        const res2 = await fetch(`/api/cursos/${cursoId}/seccion3`);
        const data2 = await res2.json();

        if (res2.ok) {
          setUnidades(data2);

          if (!matrizDesdeBackend.length && data2.length > 0) {
            const matrizInicial = data2.map(u => ({
              unidad: u.nombre ?? '',
              criterio: '',
              desempenio: '',
              producto: '',
              instrumento: '',
            }));
            setMatriz(matrizInicial);
          }
        } else {
          console.error('Error al cargar sección 3:', data2?.error || 'Desconocido');
        }
      } catch (err) {
        console.error('Error cargando unidades para matriz:', err);
      }
    };

    fetchTodo();
  }, [cursoId]);

  useEffect(() => {
    if (estrategiaRef.current) estrategiaRef.current.focus();
  }, [estrategia]);

  const handleNotaChange = (i, value) => {
    const nuevas = [...notas];
    nuevas[i] = value;
    setNotas(nuevas);
  };

  const agregarNota = () => setNotas([...notas, '']);
  const eliminarNota = i => setNotas(notas.filter((_, idx) => idx !== i));

  const actualizarMatriz = (i, campo, valor) => {
    const nuevas = [...matriz];
    nuevas[i][campo] = valor;
    setMatriz(nuevas);
  };

  const actualizarBibliografia = (i, valor) => {
    const nuevas = [...bibliografias];
    nuevas[i] = valor;
    setBibliografias(nuevas);
  };

  const agregarBibliografia = () => {
    if (bibliografias.length < 15) setBibliografias([...bibliografias, '']);
  };

  const eliminarBibliografia = i => {
    setBibliografias(bibliografias.filter((_, idx) => idx !== i));
  };

  const handleGuardar = async () => {
    if (!cursoId || isNaN(cursoId)) {
      alert('ID de curso inválido');
      return;
    }

    try {
      const res = await fetch(`/api/cursos/${cursoId}/seccion4`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estrategia, evaluacion, formula, notas, matriz, bibliografia: bibliografias }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Error al guardar sección 4');
      }

      alert('Sección 4 guardada correctamente');
      onClose();
    } catch (err) {
      console.error('Error al guardar sección 4:', err);
      alert('Error al guardar los datos.');
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-seccion4"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="titulo-seccion4" tabIndex={0}>
              7. Estrategia didáctica y 8. Evaluación
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>

          <div className="modal-body">
            {/* Estrategia */}
            <section className="mb-4" aria-labelledby="estrategia">
              <h6 id="estrategia" tabIndex={0}>7. Estrategia didáctica</h6>
              <textarea
                ref={estrategiaRef}
                className="form-control"
                rows={4}
                maxLength={2000}
                value={estrategia}
                onChange={e => setEstrategia(e.target.value)}
              />
            </section>

            {/* Evaluación */}
            <section className="mb-4" aria-labelledby="evaluacion">
              <h6 id="evaluacion" tabIndex={0}>8. Evaluación</h6>
              <textarea
                className="form-control"
                rows={4}
                maxLength={2000}
                value={evaluacion}
                onChange={e => setEvaluacion(e.target.value)}
              />
              <label className="mt-2" htmlFor="formula">Fórmula matemática</label>
              <input
                id="formula"
                className="form-control"
                value={formula}
                onChange={e => setFormula(e.target.value)}
              />
            </section>

            {/* Notas */}
            <section className="mb-4" aria-labelledby="notas">
              <h6 id="notas" tabIndex={0}>Notas</h6>
              {notas.map((nota, i) => (
                <div key={i} className="d-flex align-items-center mb-2">
                  <label htmlFor={`nota-${i}`} className="me-2 fw-semibold">Nota {i + 1}</label>
                  <input
                    id={`nota-${i}`}
                    type="text"
                    className="form-control me-2"
                    value={nota}
                    onChange={e => handleNotaChange(i, e.target.value)}
                  />
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarNota(i)} aria-label={`Eliminar nota ${i + 1}`}>🗑</button>
                </div>
              ))}
              <button className="btn btn-outline-primary" onClick={agregarNota}>+ Añadir nota</button>
            </section>

            {/* Matriz */}
            <section className="mb-4" aria-labelledby="matriz">
              <h5 id="matriz" tabIndex={0}>Matriz de evaluación por competencias</h5>
              <table className="table table-bordered table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Unidad</th>
                    <th>Criterio</th>
                    <th>Desempeño</th>
                    <th>Producto</th>
                    <th>Instrumento</th>
                  </tr>
                </thead>
                <tbody>
                  {matriz.map((fila, i) => (
                    <tr key={i}>
                      <td>{fila.unidad}</td>
                      {['criterio', 'desempenio', 'producto', 'instrumento'].map((campo) => (
                        <td key={campo}>
                          <input
                            className="form-control"
                            value={fila[campo]}
                            maxLength={1000}
                            onChange={e => actualizarMatriz(i, campo, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Bibliografía */}
            <section className="mb-4" aria-labelledby="bibliografia">
              <h6 id="bibliografia" tabIndex={0}>9. Bibliografía</h6>
              {bibliografias.map((biblio, i) => (
                <div key={i} className="d-flex align-items-center mb-2">
                  <input
                    id={`biblio-${i}`}
                    className="form-control me-2"
                    maxLength={1000}
                    value={biblio}
                    onChange={e => actualizarBibliografia(i, e.target.value)}
                  />
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarBibliografia(i)} aria-label={`Eliminar bibliografía ${i + 1}`}>🗑</button>
                </div>
              ))}
              {bibliografias.length < 15 && (
                <button className="btn btn-outline-primary" onClick={agregarBibliografia}>
                  + Añadir bibliografía
                </button>
              )}
            </section>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            <button className="btn btn-success" onClick={handleGuardar}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
