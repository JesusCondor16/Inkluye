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

  return (
    <main className="d-flex" role="main" aria-label="Página de exploración de syllabus">
      <Sidebar />

      <div className="flex-grow-1 p-5" style={{ minHeight: '100vh' }}>
        <h1 className="mb-4" tabIndex={0}>Explorar Syllabus</h1>

        {cargando ? (
          <p tabIndex={0}>Cargando syllabus disponibles...</p>
        ) : (
          <section
            className="row g-4"
            role="region"
            aria-labelledby="lista-syllabus"
            id="lista-syllabus"
          >
            {syllabus.length === 0 ? (
              <p tabIndex={0}>No hay syllabus disponibles actualmente.</p>
            ) : (
              syllabus.map((item) => (
                <div key={item.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm" aria-labelledby={`syllabus-${item.id}`}>
                    <div className="card-body">
                      <h5 id={`syllabus-${item.id}`} className="card-title" tabIndex={0}>
                        {item.nombre}
                      </h5>
                      <p className="card-text" tabIndex={0}>
                        <strong>Código:</strong> {item.codigo}<br />
                        <strong>Plan:</strong> {item.planEstudios}<br />
                        <strong>Ciclo:</strong> {item.ciclo}<br />
                        <strong>Créditos:</strong> {item.creditos}
                      </p>
                      {item.pdfUrl ? (
                        <Link
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary"
                          aria-label={`Ver PDF del syllabus ${item.nombre}`}
                        >
                          Ver PDF
                        </Link>
                      ) : (
                        <p className="text-muted" tabIndex={0}>PDF no disponible</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}
