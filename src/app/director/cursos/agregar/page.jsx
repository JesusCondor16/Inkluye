'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AgregarCursoPage() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    area: '',
    weeks: '',
    semester: '',
    cycle: '',
    credits: '',
    modality: '',
    horasDetalle: '',
    prerrequisitos: [],
    docentes: [],
    coordinadorId: '',
  });

  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [coordinadores, setCoordinadores] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    fetch('/api/cursos', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(setCursosDisponibles);
    fetch('/api/users?roles=DOCENTE', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(setDocentes);
    fetch('/api/users?roles=COORDINADOR', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(setCoordinadores);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter(o => o.selected).map(o => o.value);
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const parsearHoras = (str) => {
    const regex = /Te[oó]r[ií]a:\s*(\d+),?\s*Pr[aá]ctica:\s*(\d+),?\s*Laboratorio:\s*(\d+)/i;
    const match = str.match(regex);
    if (!match) return null;
    return {
      theoryHours: parseInt(match[1]),
      practiceHours: parseInt(match[2]),
      labHours: parseInt(match[3]),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const horas = parsearHoras(formData.horasDetalle);
    if (!horas) {
      alert('Formato inválido. Usa: Teoría: 2, Práctica: 1, Laboratorio: 2');
      return;
    }

    const payload = {
      name: formData.name,
      code: formData.code,
      type: formData.type,
      area: formData.area,
      weeks: formData.weeks ? parseInt(formData.weeks) : null,
      credits: parseInt(formData.credits),
      semester: formData.semester,
      cycle: formData.cycle,
      modality: formData.modality,
      theoryHours: horas.theoryHours,
      practiceHours: horas.practiceHours,
      labHours: horas.labHours,
      prerrequisitos: formData.prerrequisitos.map((id) => parseInt(id)),
      docentes: formData.docentes.map((id) => parseInt(id)),
      coordinadorId: formData.coordinadorId ? parseInt(formData.coordinadorId) : null,
    };

    const res = await fetch('/api/cursos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Curso registrado correctamente');
      setFormData({
        name: '',
        code: '',
        type: '',
        area: '',
        weeks: '',
        semester: '',
        cycle: '',
        credits: '',
        modality: '',
        horasDetalle: '',
        prerrequisitos: [],
        docentes: [],
        coordinadorId: '',
      });
    } else {
      const err = await res.json();
      alert('Error al registrar curso: ' + (err.error || 'Error desconocido'));
    }
  };

  return (
    <div className="d-flex" role="main" aria-label="Formulario para agregar curso">
      <Sidebar />
      <main className="container mt-4 mb-5" aria-labelledby="titulo-agregar-curso">
        <h1 id="titulo-agregar-curso" className="mb-4 text-primary" tabIndex={0}>
          Agregar Curso
        </h1>

        <form onSubmit={handleSubmit} aria-label="Formulario de registro de curso" noValidate>
          <div className="row">
            {[
              { id: 'name', label: 'Nombre', required: true },
              { id: 'code', label: 'Código', required: true },
              { id: 'type', label: 'Tipo de asignatura' },
              { id: 'area', label: 'Área de estudios' },
              { id: 'weeks', label: 'Número de semanas', type: 'number' },
              { id: 'credits', label: 'Créditos', type: 'number', required: true },
              { id: 'semester', label: 'Semestre académico' },
              { id: 'cycle', label: 'Ciclo' },
              { id: 'modality', label: 'Modalidad' }
            ].map(({ id, label, type = 'text', required }) => (
              <div className="col-md-6 mb-3" key={id}>
                <label htmlFor={id} className="form-label">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  className="form-control"
                  value={formData[id]}
                  onChange={handleChange}
                  required={required}
                  aria-required={required ? 'true' : undefined}
                />
              </div>
            ))}

            <div className="col-md-12 mb-3">
              <label htmlFor="horasDetalle" className="form-label">Horas semanales</label>
              <input
                id="horasDetalle"
                name="horasDetalle"
                className="form-control"
                value={formData.horasDetalle}
                onChange={handleChange}
                required
                aria-required="true"
                aria-describedby="horasDetalle-desc"
              />
              <small id="horasDetalle-desc" className="form-text text-muted">
                Formato: Teoría: 2, Práctica: 1, Laboratorio: 2
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="prerrequisitos" className="form-label">Prerrequisitos</label>
              <select
                id="prerrequisitos"
                name="prerrequisitos"
                className="form-select"
                multiple
                onChange={handleMultiChange}
                value={formData.prerrequisitos}
                aria-describedby="prerrequisitos-desc"
              >
                {cursosDisponibles.map(curso => (
                  <option key={curso.id} value={curso.id}>{curso.name}</option>
                ))}
              </select>
              <small id="prerrequisitos-desc" className="form-text text-muted">
                Usa Ctrl (o Cmd en Mac) para seleccionar múltiples cursos.
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="docentes" className="form-label">Docentes</label>
              <select
                id="docentes"
                name="docentes"
                className="form-select"
                multiple
                onChange={handleMultiChange}
                value={formData.docentes}
                aria-describedby="docentes-desc"
              >
                {docentes.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <small id="docentes-desc" className="form-text text-muted">
                Puedes seleccionar más de un docente.
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="coordinadorId" className="form-label">Asignar a coordinador</label>
              <select
                id="coordinadorId"
                name="coordinadorId"
                className="form-select"
                value={formData.coordinadorId}
                onChange={handleChange}
                aria-label="Selecciona un coordinador"
              >
                <option value="">Seleccione</option>
                {coordinadores.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#146c43',
                color: '#ffffff',
                border: 'none',
                fontWeight: 'bold'
              }}
              aria-label="Registrar curso"
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #000';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              Registrar Curso
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
