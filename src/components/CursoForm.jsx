'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CursoForm({ modo, cursoId }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    tipo: '',
    area: '',
    semanas: '',
    horasSemanales: '',
    semestre: '',
    ciclo: '',
    creditos: '',
    modalidad: '',
    prerrequisitos: [],
    docentes: [],
    coordinadorId: '',
  });

  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [coordinadores, setCoordinadores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar cursos, docentes y coordinadores
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const headers = { Authorization: `Bearer ${token}` };

        const [cursosRes, docentesRes, coordinadoresRes] = await Promise.all([
          fetch('/api/cursos'),
          fetch('/api/users?roles=DOCENTE', { headers }),
          fetch('/api/users?roles=COORDINADOR', { headers }),
        ]);

        if (!cursosRes.ok || !docentesRes.ok || !coordinadoresRes.ok) {
          throw new Error('Error al cargar información');
        }

        const cursosData = await cursosRes.json();
        const docentesData = await docentesRes.json();
        const coordinadoresData = await coordinadoresRes.json();

        setCursosDisponibles(Array.isArray(cursosData) ? cursosData : []);
        setDocentes(Array.isArray(docentesData) ? docentesData : []);
        setCoordinadores(Array.isArray(coordinadoresData) ? coordinadoresData : []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        alert('Hubo un problema cargando los datos del formulario. Asegúrate de estar autenticado.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Si es edición, carga los datos del curso
  useEffect(() => {
    const cargarCurso = async () => {
      if (modo !== 'editar' || !cursoId) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const res = await fetch(`/api/cursos/${cursoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Error al obtener curso');

        const data = await res.json();

        setFormData({
          nombre: data.name || '',
          codigo: data.code || '',
          tipo: data.type || '',
          area: data.area || '',
          semanas: data.weeks || '',
          horasSemanales: data.theoryHours || '',
          semestre: data.semester || '',
          ciclo: data.cycle || '',
          creditos: data.credits || '',
          modalidad: data.modality || '',
          prerrequisitos: Array.isArray(data.prerequisites)
            ? data.prerequisites.map((p) => p.prerequisiteId)
            : [],
          docentes: Array.isArray(data.docentes)
            ? data.docentes.map((d) => d.id)
            : Array.isArray(data.cursoDocentes)
            ? data.cursoDocentes.map((d) => d.user.id)
            : [],
          coordinadorId: data.coordinadorId || data.coordinador?.id || '',
        });
      } catch (err) {
        console.error('Error al cargar curso:', err);
        alert('No se pudo cargar el curso para editar.');
      }
    };

    cargarCurso();
  }, [modo, cursoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter((o) => o.selected).map((o) => o.value);
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado');
      return;
    }

    const url = modo === 'editar' ? `/api/cursos/${cursoId}` : '/api/cursos';
    const method = modo === 'editar' ? 'PUT' : 'POST';

    const dataToSend = {
      name: formData.nombre,
      code: formData.codigo.trim().toUpperCase(),
      type: formData.tipo,
      area: formData.area,
      weeks: parseInt(formData.semanas) || null,
      theoryHours: parseInt(formData.horasSemanales) || null,
      semester: formData.semestre,
      cycle: formData.ciclo,
      credits: parseInt(formData.creditos) || null,
      modality: formData.modalidad,
      coordinadorId: formData.coordinadorId ? parseInt(formData.coordinadorId) : null,
      prerrequisitos: formData.prerrequisitos.map((id) => parseInt(id)),
      docentes: formData.docentes.map((id) => parseInt(id)),
    };

    if (modo === 'crear') {
      const existe = cursosDisponibles.some((c) => c.code.toUpperCase() === dataToSend.code);
      if (existe) {
        alert('Ya existe un curso con ese código.');
        return;
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Error al guardar curso');
        return;
      }

      alert(modo === 'editar' ? 'Curso actualizado' : 'Curso creado');
      router.push('/cursos');
    } catch (err) {
      console.error('Error al guardar curso:', err);
      alert('Error al guardar curso');
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando datos...</p>;

  return (
    <div className="container mt-4 mb-5">
      <h1 className="h3 mb-4">{modo === 'editar' ? 'Editar Curso' : 'Agregar Curso'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {[
            { label: 'Nombre', name: 'nombre' },
            { label: 'Código', name: 'codigo' },
            { label: 'Tipo', name: 'tipo' },
            { label: 'Área', name: 'area' },
            { label: 'Semanas', name: 'semanas', type: 'number' },
            { label: 'Horas Semanales', name: 'horasSemanales', type: 'number' },
            { label: 'Créditos', name: 'creditos', type: 'number' },
            { label: 'Semestre', name: 'semestre' },
            { label: 'Ciclo', name: 'ciclo' },
            { label: 'Modalidad', name: 'modalidad' },
          ].map(({ label, name, type = 'text' }) => (
            <div className="col-md-6 mb-3" key={name}>
              <label htmlFor={name} className="form-label">{label}</label>
              <input
                type={type}
                id={name}
                name={name}
                className="form-control"
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="col-md-6 mb-3">
            <label htmlFor="prerrequisitos" className="form-label">Prerrequisitos</label>
            <select
              multiple
              id="prerrequisitos"
              name="prerrequisitos"
              className="form-select"
              onChange={handleMultiChange}
              value={formData.prerrequisitos}
            >
              {cursosDisponibles.map((curso) => (
                <option key={curso.id} value={curso.id}>{curso.name}</option>
              ))}
            </select>
            <small className="form-text text-muted">
              Usa Ctrl (o Cmd en Mac) para seleccionar múltiples cursos.
            </small>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="docentes" className="form-label">Docentes</label>
            <select
              multiple
              id="docentes"
              name="docentes"
              className="form-select"
              onChange={handleMultiChange}
              value={formData.docentes}
              required
            >
              {docentes.map((docente) => (
                <option key={docente.id} value={docente.id}>{docente.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="coordinadorId" className="form-label">Coordinador</label>
            <select
              id="coordinadorId"
              name="coordinadorId"
              className="form-select"
              onChange={handleChange}
              value={formData.coordinadorId}
              required
            >
              <option value="">Seleccione</option>
              {coordinadores.map((coord) => (
                <option key={coord.id} value={coord.id}>{coord.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-success">
            {modo === 'editar' ? 'Actualizar Curso' : 'Crear Curso'}
          </button>
        </div>
      </form>
    </div>
  );
}
