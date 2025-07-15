'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { jwtDecode } from 'jwt-decode';

export default function PerfilPage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData({
          name: decoded.name || '',
          email: decoded.email || '',
          role: decoded.role || '',
        });
      } catch (e) {
        console.error('Token inválido:', e);
      }
    }
  }, []);

  return (
    <main
      className="d-flex"
      role="main"
      aria-label="Página de perfil del usuario"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <Sidebar />

      <div
        className="flex-grow-1 p-4"
        style={{ minHeight: '100vh' }}
        aria-labelledby="titulo-perfil"
      >
        <section
          className="container"
          role="region"
          aria-labelledby="datos-usuario"
        >
          <h1
            id="titulo-perfil"
            className="mb-4 text-primary fw-bold"
            tabIndex={0}
          >
            Perfil del Usuario
          </h1>

          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="card-body p-4">
              <h2
                id="datos-usuario"
                className="h5 mb-4 text-dark"
                tabIndex={0}
              >
                Datos personales
              </h2>

              <dl className="row" style={{ fontSize: '1rem' }}>
                <dt className="col-sm-3 fw-semibold" tabIndex={0}>Nombre:</dt>
                <dd className="col-sm-9 text-dark" tabIndex={0}>{userData.name}</dd>

                <dt className="col-sm-3 fw-semibold" tabIndex={0}>Correo:</dt>
                <dd className="col-sm-9 text-dark" tabIndex={0}>{userData.email}</dd>

                <dt className="col-sm-3 fw-semibold" tabIndex={0}>Rol:</dt>
                <dd className="col-sm-9 text-dark" tabIndex={0}>{userData.role}</dd>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
