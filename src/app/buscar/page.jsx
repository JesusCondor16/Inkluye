'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function BuscarSyllabusPage() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('');
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
      if (plan) qs.append('plan', plan);
      if (ciclo) qs.append('ciclo', ciclo);

      const res = await fetch(`/api/syllabus?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Respuesta no válida del servidor:', jsonError);
        throw new Error('No se pudo interpretar la respuesta del servidor');
      }

      if (!res.ok) {
        console.error('Error del servidor:', data);
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

  return (
    <main className="d-flex bg-light text-dark" role="main" aria-label="Página de búsqueda de syllabus">
      <Sidebar />

      <div className="flex-grow-1 p-5" style={{ minHeight: '100vh' }}>
        <section aria-labelledby="titulo-busqueda">
          <h1 id="titulo-busqueda" className="mb-4 fw-bold" tabIndex={0}>
            Buscar Syllabus
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBuscar();
            }}
            aria-label="Formulario de búsqueda de syllabus"
          >
            <fieldset className="border p-3 rounded bg-white shadow-sm">
              <legend className="visually-hidden">Criterios de búsqueda</legend>

              <div className="row g-3 mb-3">
                {[
                  { id: 'codigo', label: 'Código del curso', value: codigo, set: setCodigo },
                  { id: 'nombre', label: 'Nombre del curso', value: nombre, set: setNombre },
                  { id: 'plan', label: 'Plan de estudios', value: plan, set: setPlan },
                  { id: 'ciclo', label: 'Ciclo académico', value: ciclo, set: setCiclo },
                ].map(({ id, label, value, set }) => (
                  <div key={id} className="col-md-3">
                    <label htmlFor={id} className="form-label fw-semibold">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={id}
                      className="form-control"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      aria-describedby={`${id}-desc`}
                      aria-label={label}
                    />
                    <small id={`${id}-desc`} className="form-text text-muted visually-hidden">
                      Ingrese el {label.toLowerCase()} para buscar syllabus relacionados.
                    </small>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary mt-2" aria-label="Ejecutar búsqueda">
                Buscar
              </button>
            </fieldset>
          </form>
        </section>

        <section className="mt-5" aria-labelledby="resultados-busqueda">
          <h2 id="resultados-busqueda" className="h5 fw-bold mb-3" tabIndex={0}>
            Resultados
          </h2>

          {cargando && (
            <p role="status" className="text-info fw-semibold" aria-live="polite">
              Cargando resultados...
            </p>
          )}

          {!cargando && resultados.length > 0 && (
            <div className="table-responsive" role="region" aria-label="Tabla de resultados de syllabus">
              <table className="table table-bordered table-striped table-hover caption-top">
                <caption className="visually-hidden">Resultados de syllabus encontrados</caption>
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Plan</th>
                    <th scope="col">Ciclo</th>
                    <th scope="col">Créditos</th>
                    <th scope="col">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((c) => (
                    <tr key={c.id}>
                      <td>{c.codigo}</td>
                      <td>{c.nombre}</td>
                      <td>{c.planEstudios}</td>
                      <td>{c.ciclo}</td>
                      <td>{c.creditos}</td>
                      <td>
                        {c.pdfUrl ? (
                          <Link
                            href={c.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary"
                            aria-label={`Ver PDF del curso ${c.nombre}`}
                          >
                            Ver PDF
                          </Link>
                        ) : (
                          <span className="text-muted" aria-label="PDF no disponible">
                            No disponible
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!cargando && resultados.length === 0 && (codigo || nombre || plan || ciclo) && (
            <p role="status" className="text-warning fw-semibold" aria-live="polite">
              No se encontraron resultados para los criterios proporcionados.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
