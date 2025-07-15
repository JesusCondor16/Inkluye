'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import getMenuByRole from '@/utils/getMenuByRole';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Users,
  ShieldCheck,
  History,
  BookOpen,
  Search,
  Home,
  User,
  FileText,
} from 'lucide-react';

const iconMap = {
  '/director': <Home className="me-2" size={18} aria-hidden="true" />,
  '/director/docentes': <Users className="me-2" size={18} aria-hidden="true" />,
  '/director/coordinadores': <ShieldCheck className="me-2" size={18} aria-hidden="true" />,
  '/director/historial': <History className="me-2" size={18} aria-hidden="true" />,
  '/director/cursos': <BookOpen className="me-2" size={18} aria-hidden="true" />,
  '/director/cursos/agregar': <BookOpen className="me-2" size={18} aria-hidden="true" />,
  '/coordinador/cursos': <BookOpen className="me-2" size={18} aria-hidden="true" />,
  '/estudiante/explorar': <Search className="me-2" size={18} aria-hidden="true" />,
  '/buscar': <Search className="me-2" size={18} aria-hidden="true" />,
  '/perfil': <User className="me-2" size={18} aria-hidden="true" />,
  '/informacion': <FileText className="me-2" size={18} aria-hidden="true" />,
};

export default function Sidebar() {
  const [menuItems, setMenuItems] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const router = useRouter();
  const cerrarSesionBtnRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const items = getMenuByRole(decoded.role);
      setMenuItems(items);
    } catch (err) {
      console.error('Token inválido');
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/users/login');
  };

  return (
    <nav
      className="d-flex flex-column bg-light p-3"
      style={{ minHeight: '100vh', width: '250px', borderRight: '1px solid #ccc' }}
      aria-label="Menú lateral"
      role="navigation"
    >
      {/* Logo + título */}
      <div className="mb-4 text-center">
        <img
          src="/inkluye.png"
          alt="Logo de Inkluye: persona estilizada en círculo dentro de un libro abierto"
          style={{ width: '90px', height: 'auto', marginBottom: '0.5rem' }}
          aria-hidden="true"
        />
        <h2 className="text-primary fw-bold" tabIndex={0}>
          Inkluye
        </h2>
      </div>

      {/* Menú dinámico */}
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              href={item.path}
              className="nav-link d-flex align-items-center text-dark"
              aria-label={`Ir a ${item.label}`}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #000';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              style={{ padding: '0.5rem', borderRadius: '0.375rem' }}
            >
              {iconMap[item.path] || <FileText className="me-2" size={18} aria-hidden="true" />}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <hr />

      {/* Botón cerrar sesión */}
      <button
        ref={cerrarSesionBtnRef}
        className="btn btn-outline-danger d-flex align-items-center mt-auto"
        onClick={() => setMostrarConfirmacion(true)}
        aria-label="Cerrar sesión"
      >
        <LogOut className="me-2" aria-hidden="true" />
        Cerrar sesión
      </button>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-confirmacion-titulo"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modal-confirmacion-titulo" tabIndex={-1}>
                  Confirmar cierre de sesión
                </h5>
              </div>
              <div className="modal-body">
                <p tabIndex={0}>¿Estás seguro de que deseas cerrar sesión?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setMostrarConfirmacion(false);
                    cerrarSesionBtnRef.current?.focus();
                  }}
                  aria-label="Cancelar"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={cerrarSesion}
                  aria-label="Confirmar cierre de sesión"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
