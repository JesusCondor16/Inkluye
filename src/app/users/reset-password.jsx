'use client';

import { useState } from 'react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message || 'Error al cambiar contraseña');
  };

  return (
    <main className="container mt-5" role="main" aria-label="Formulario de cambio de contraseña">
      <h1 className="mb-4">Cambiar Contraseña</h1>
      {message && <div className="alert alert-info" role="alert">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            type="email"
            id="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">Última contraseña que recuerde</label>
          <input
            type="password"
            id="oldPassword"
            className="form-control"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
      </form>
    </main>
  );
}
