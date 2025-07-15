'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

export default function ExplorarSyllabusPage() {
  const [syllabus, setSyllabus] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.name) setNombreUsuario(decoded.name);
      } catch (e) {
        console.error('Error al decodificar token:', e);
      }
    }

    const fetchSyllabus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/syllabus', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setSyllabus(data);
        } else {
          console.error('Error al obtener syllabus:', data?.error || 'Error desconocido');
        }
      } catch (err) {
        console.error('Error de red al cargar syllabus:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchSyllabus();
  }, []);

  const generarUrlPDF = (codigo, lang) => `/syllabus/syllabus-${codigo}-${lang}.pdf`;

  const verificarExistenciaPDF = async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  };

  // Cargar las URLs de PDF por idioma
  useEffect(() => {
    const cargarPDFs = async () => {
      const nuevos = await Promise.all(
        syllabus.map(async (curso) => {
          const disponible = {};
          for (const lang of ['es', 'en', 'zh']) {
            const url = generarUrlPDF(curso.codigo, lang);
            const existe = await verificarExistenciaPDF(url);
            if (existe) {
              disponible[lang] = url;
            }
          }
          return { ...curso, urls: disponible };
        })
      );
      setSyllabus(nuevos);
    };

    if (!cargando && syllabus.length > 0) {
      cargarPDFs();
    }
  }, [cargando]);

  return (
    <main className="d-flex bg-light text-dark" role="main" aria-label="Página de exploración de syllabus">
      <Sidebar />

      <div className="flex-grow-1 p-5" style={{ minHeight: '100vh' }}>
        <section aria-labelledby="titulo-explorar">
          <h1 id="titulo-explorar" className="mb-4 display-5 fw-bold text-primary" tabIndex={0}>
            📘 Explorar Syllabus
          </h1>

          {cargando ? (
            <p role="status" className="text-info fw-semibold" aria-live="polite" tabIndex={0}>
              ⏳ Cargando syllabus disponibles...
            </p>
          ) : (
            <section
              className="row g-4"
              role="region"
              aria-labelledby="lista-syllabus"
              id="lista-syllabus"
            >
              {syllabus.length === 0 ? (
                <p
                  role="status"
                  className="text-warning fw-semibold"
                  aria-live="assertive"
                  tabIndex={0}
                >
                  ⚠️ No hay syllabus disponibles actualmente.
                </p>
              ) : (
                syllabus.map((item) => (
                  <div key={item.id} className="col-md-6 col-lg-4">
                    <article
                      className="card h-100 shadow-sm border-0 bg-white"
                      aria-labelledby={`syllabus-${item.id}`}
                    >
                      <div className="card-body d-flex flex-column">
                        <h2
                          id={`syllabus-${item.id}`}
                          className="card-title h5 fw-bold text-secondary"
                          tabIndex={0}
                        >
                          {item.nombre}
                        </h2>
                        <p className="card-text flex-grow-1" tabIndex={0}>
                          <strong>Código:</strong> {item.codigo}<br />
                          <strong>Plan:</strong> {item.planEstudios}<br />
                          <strong>Ciclo:</strong> {item.ciclo}<br />
                          <strong>Créditos:</strong> {item.creditos}
                        </p>

                        {/* Botones por idioma */}
                        <div className="mt-3 d-flex flex-wrap gap-2">
                          {item.urls?.es && (
                            <Link
                              href={item.urls.es}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm"
                              aria-label={`Ver PDF en español de ${item.nombre}`}
                            >
                              🇪🇸 Español
                            </Link>
                          )}
                          {item.urls?.en && (
                            <Link
                              href={item.urls.en}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-success btn-sm"
                              aria-label={`View PDF in English for ${item.nombre}`}
                            >
                              🇬🇧 English
                            </Link>
                          )}
                          {item.urls?.zh && (
                            <Link
                              href={item.urls.zh}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-warning btn-sm"
                              aria-label={`查看 ${item.nombre} 的中文 PDF`}
                            >
                              🇨🇳 中文
                            </Link>
                          )}
                        </div>

                        {!item.urls || Object.keys(item.urls).length === 0 ? (
                          <p className="text-muted mt-2" tabIndex={0}>
                            PDF no disponible en ningún idioma.
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </div>
                ))
              )}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
