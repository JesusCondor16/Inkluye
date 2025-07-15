'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ModalSeccion1 from '@/components/ModalsSyllabus/ModalSeccion1';
import ModalSeccion2 from '@/components/ModalsSyllabus/ModalSeccion2';
import ModalSeccion3 from '@/components/ModalsSyllabus/ModalSeccion3';
import ModalSeccion4 from '@/components/ModalsSyllabus/ModalSeccion4';

export default function SyllabusCursoPage() {
  const { id: cursoId } = useParams();
  const [curso, setCurso] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalSeccion2, setMostrarModalSeccion2] = useState(false);
  const [mostrarModalSeccion3, setMostrarModalSeccion3] = useState(false);
  const [mostrarModalSeccion4, setMostrarModalSeccion4] = useState(false);
  const [sumilla, setSumilla] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cursoId) return;

    fetch(`/api/cursos/${cursoId}`)
      .then((res) => res.json())
      .then(setCurso)
      .catch((err) => console.error('Error al obtener curso:', err))
      .finally(() => setLoading(false));
  }, [cursoId]);

  const handleGenerarSyllabus = async (lang = 'es') => {
    try {
      const res = await fetch(`/api/cursos/${cursoId}/generarSyllabus?lang=${lang}`);
      if (!res.ok) {
        alert(`Error generando el syllabus en idioma: ${lang}`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar syllabus:', error);
      alert('Error al generar syllabus');
    }
  };

  return (
    <div
      className="d-flex"
      role="main"
      aria-label="Gestión de syllabus del curso"
      style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}
    >
      <Sidebar />
      <main
        className="container mt-4 mb-5"
        aria-labelledby="titulo-pagina"
      >
        <h1
          className="h3 mb-4 fw-bold text-dark"
          id="titulo-pagina"
          tabIndex={0}
        >
          Syllabus del Curso
        </h1>

        {loading ? (
          <p tabIndex={0} aria-live="polite">Cargando datos del curso...</p>
        ) : (
          <>
            <div
              className="table-responsive"
              role="region"
              aria-label="Tabla de secciones del syllabus"
            >
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Ítem</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, desc: 'Información general, Sumilla', onClick: () => setMostrarModal(true) },
                    { id: 2, desc: 'Competencias del perfil de egreso, Logros de aprendizaje', onClick: () => setMostrarModalSeccion2(true) },
                    { id: 3, desc: 'Capacidades y Programación de contenidos', onClick: () => setMostrarModalSeccion3(true) },
                    { id: 4, desc: 'Estrategia didáctica, Evaluación, Matriz y Bibliografía', onClick: () => setMostrarModalSeccion4(true) },
                  ].map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.desc}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: '#0d6efd',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                          }}
                          onClick={item.onClick}
                          aria-label={`Editar sección ${item.id}: ${item.desc}`}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid #000';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="mb-4 d-flex flex-wrap gap-3"
              aria-label="Opciones para generar syllabus en distintos idiomas"
            >
              <button
                className="btn"
                style={{
                  backgroundColor: '#157347',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 16px',
                }}
                onClick={() => handleGenerarSyllabus('es')}
                aria-label="Generar syllabus en Español"
              >
                Generar syllabus (Español)
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: '#0dcaf0',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 16px',
                }}
                onClick={() => handleGenerarSyllabus('en')}
                aria-label="Generate syllabus in English"
              >
                Generate syllabus (English)
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: '#ffc107',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 16px',
                }}
                onClick={() => handleGenerarSyllabus('zh')}
                aria-label="生成教学大纲 (Chino)"
              >
                生成教学大纲 (Chino)
              </button>
            </div>

            {/* Modales por sección */}
            {mostrarModal && (
              <ModalSeccion1
                curso={curso}
                sumilla={sumilla}
                setSumilla={setSumilla}
                onClose={() => setMostrarModal(false)}
              />
            )}
            {mostrarModalSeccion2 && (
              <ModalSeccion2 cursoId={cursoId} onClose={() => setMostrarModalSeccion2(false)} />
            )}
            {mostrarModalSeccion3 && (
              <ModalSeccion3 cursoId={cursoId} onClose={() => setMostrarModalSeccion3(false)} />
            )}
            {mostrarModalSeccion4 && (
              <ModalSeccion4 cursoId={cursoId} onClose={() => setMostrarModalSeccion4(false)} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
