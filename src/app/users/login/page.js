'use client';

import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Error al iniciar sesión');
        return;
      }

      const { token } = data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      switch (userRole) {
        case 'DIRECTOR':
          window.location.href = '/director';
          break;
        case 'COORDINADOR':
          window.location.href = '/coordinador';
          break;
        case 'DOCENTE':
          window.location.href = '/docente';
          break;
        case 'ESTUDIANTE':
          window.location.href = '/estudiante';
          break;
        default:
          setErrorMsg('Rol no reconocido');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Error inesperado');
    }
  }

  return (
    <main
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#e6f0fa',
        padding: '2rem',
      }}
      role="main"
      aria-label="Página de inicio de sesión del sistema Inkulye"
      tabIndex={-1}
    >
      <div
        className="col-md-6 col-lg-5 border p-4 rounded shadow"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#005a9c',
          borderWidth: '3px',
        }}
      >
        <h1
          className="mb-4 text-center"
          tabIndex={0}
          style={{ color: '#003366', fontWeight: 'bold' }}
        >
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} aria-describedby="login-desc" noValidate>
          <p
            id="login-desc"
            className="mb-4 text-muted"
            tabIndex={0}
            style={{ lineHeight: 1.6 }}
          >
            Ingresa tu correo electrónico y contraseña para acceder al sistema. Todos los campos son obligatorios.
          </p>

          {errorMsg && (
            <div
              className="alert alert-danger"
              role="alert"
              aria-live="assertive"
              tabIndex={0}
            >
              {errorMsg}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Correo electrónico <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="ejemplo@dominio.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Contraseña <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          {/* Enlace para recuperar contraseña */}
          <div className="mb-3 text-end">
            <Link
              href="/users/reset-password"
              className="text-decoration-none text-primary"
              aria-label="Recuperar contraseña olvidada"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="d-grid mt-2">
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                backgroundColor: '#005a9c',
                borderColor: '#003f7f',
                fontWeight: 'bold',
              }}
              aria-label="Enviar formulario de inicio de sesión"
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setMostrarAyuda(!mostrarAyuda)}
            className="btn btn-outline-secondary btn-sm"
            aria-expanded={mostrarAyuda}
            aria-controls="ayudaAccesibilidad"
            aria-label="Mostrar ayuda de accesibilidad para el inicio de sesión"
          >
            {mostrarAyuda ? 'Ocultar ayuda de accesibilidad' : 'Ayuda de accesibilidad'}
          </button>
        </div>

        {mostrarAyuda && (
          <section
            id="ayudaAccesibilidad"
            className="mt-4 alert alert-info"
            role="region"
            aria-live="polite"
            tabIndex={0}
            style={{
              backgroundColor: '#d9ecff',
              borderColor: '#005a9c',
              color: '#003366',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            <h2 className="h6 fw-bold">Instrucciones de navegación accesible</h2>
            <ul>
              <li>Presiona <strong>Tab</strong> para moverte entre campos y botones.</li>
              <li>Usa <strong>Shift + Tab</strong> para retroceder.</li>
              <li>Presiona <strong>Enter</strong> en el botón para enviar.</li>
              <li>Compatible con lectores de pantalla y zoom del navegador.</li>
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
