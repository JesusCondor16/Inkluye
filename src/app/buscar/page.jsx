'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function BuscarSyllabusPage() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [ciclo, setCiclo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.name) setNombreUsuario(decoded.name);
      } catch (e) {
        console.error('Token malformado:', e);
      }
    }
  }, []);

  const handleBuscar = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token en localStorage');
        setCargando(false);
        return;
      }

      const qs = new URLSearchParams();
      if (codigo) qs.append('codigo', codigo);
      if (nombre) qs.append('nombre', nombre);
      if (ciclo) qs.append('ciclo', ciclo);

      const res = await fetch(`/api/syllabus?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Error desconocido en el servidor');
      }

      setResultados(data);
    } catch (err) {
      console.error('Error al buscar syllabus:', err.message || err);
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  const generarPdfUrl = (codigo, lang) => `/syllabus/syllabus-${codigo}-${lang}.pdf`;

  return (
    <main className="d-flex bg-light text-dark" role="main" aria-label="Página de búsqueda de syllabus">
      <Sidebar />

      <div className="flex-grow-1 p-5" style={{ minHeight: '100vh' }}>
        <section aria-labelledby="titulo-busqueda">
          <h1 id="titulo-busqueda" className="mb-4 fw-bold display-5 text-primary" tabIndex={0}>
            🎓 Buscar Syllabus Académico
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBuscar();
            }}
            aria-label="Formulario de búsqueda de syllabus"
          >
            <fieldset className="border p-4 rounded bg-white shadow-sm">
              <legend className="visually-hidden">Criterios de búsqueda</legend>

              <div className="row g-3 mb-3">
                {[
                  { id: 'codigo', label: 'Código del curso', value: codigo, set: setCodigo },
                  { id: 'nombre', label: 'Nombre del curso', value: nombre, set: setNombre },
                  { id: 'ciclo', label: 'Ciclo académico', value: ciclo, set: setCiclo },
                ].map(({ id, label, value, set }) => (
                  <div key={id} className="col-md-3">
                    <label htmlFor={id} className="form-label fw-semibold" id={`${id}-label`}>
                      {label}
                    </label>
                    <input
                      type="text"
                      id={id}
                      className="form-control form-control-sm"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      aria-labelledby={`${id}-label`}
                      aria-describedby={`${id}-desc`}
                    />
                    <small id={`${id}-desc`} className="form-text text-muted visually-hidden">
                      Ingrese el {label.toLowerCase()} para filtrar resultados.
                    </small>
                  </div>
                ))}
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-success px-4" aria-label="Ejecutar búsqueda">
                  🔍 Buscar
                </button>
              </div>
            </fieldset>
          </form>
        </section>

        <section className="mt-5" aria-labelledby="resultados-busqueda">
          <h2 id="resultados-busqueda" className="h4 fw-bold mb-3 text-secondary" tabIndex={0}>
            📚 Resultados
          </h2>

          {cargando && (
            <p role="status" className="text-info fw-semibold" aria-live="assertive">
              ⏳ Buscando syllabus...
            </p>
          )}

          {!cargando && resultados.length > 0 && (
            <div
              className="table-responsive"
              role="region"
              aria-labelledby="tabla-resultados"
              tabIndex={0}
            >
              <table className="table table-bordered table-striped table-hover align-middle shadow-sm">
                <caption id="tabla-resultados" className="visually-hidden">
                  Resultados de syllabus encontrados
                </caption>
                <thead className="table-primary text-center">
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Ciclo</th>
                    <th scope="col">Créditos</th>
                    <th scope="col">Español</th>
                    <th scope="col">Inglés</th>
                    <th scope="col">Chino</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((c) => (
                    <tr key={c.id}>
                      <td>{c.codigo}</td>
                      <td>{c.nombre}</td>
                      <td>{c.ciclo}</td>
                      <td>{c.creditos}</td>
                      {['es', 'en', 'zh'].map((lang) => {
                        const idioma = lang === 'es' ? 'Español' : lang === 'en' ? 'Inglés' : 'Chino';
                        const url = generarPdfUrl(c.codigo, lang);
                        return (
                          <td key={lang} className="text-center">
                            <Link
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-dark btn-sm"
                              aria-label={`Ver PDF en ${idioma} del curso ${c.nombre}`}
                            >
                              📄
                              <span className="visually-hidden">PDF en {idioma}</span>
                            </Link>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!cargando && resultados.length === 0 && (codigo || nombre || ciclo) && (
            <p role="status" className="text-warning fw-semibold mt-3" aria-live="assertive">
              ⚠️ No se encontraron resultados con los criterios dados.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

