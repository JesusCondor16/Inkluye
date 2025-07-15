'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function EditarCursoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

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

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token no encontrado');
        return;
      }

      try {
        // Cargar curso actual
        const cursoRes = await fetch(`/api/cursos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cursoRes.ok) throw new Error('Error al obtener curso');
        const data = await cursoRes.json();

        setFormData({
          nombre: data.name || '',
          codigo: data.code || '',
          tipo: data.type || '',
          area: data.area || '',
          semanas: data.weeks || '',
          horasSemanales:
            data.theoryHours && data.practiceHours
              ? data.theoryHours + data.practiceHours
              : data.theoryHours || '',
          semestre: data.semester || '',
          ciclo: data.cycle || '',
          creditos: data.credits || '',
          modalidad: data.modality || '',
          prerrequisitos: data.prerequisites?.map((p) => p.prerequisiteId) || [],
          docentes: data.cursoDocentes?.map((cd) => cd.user.id) || [],
          coordinadorId: data.coordinador?.id || '',
        });

        // Cargar cursos
        const cursosRes = await fetch('/api/cursos');
        const cursosData = await cursosRes.json();
        setCursosDisponibles(cursosData);

        // Cargar docentes
        const docentesRes = await fetch('/api/users?roles=DOCENTE', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocentes(await docentesRes.json());

        // Cargar coordinadores
        const coordsRes = await fetch('/api/users?roles=COORDINADOR', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoordinadores(await coordsRes.json());
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar datos');
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado');
      return;
    }

    const dataToSend = {
      name: formData.nombre,
      code: formData.codigo.trim().toUpperCase(),
      type: formData.tipo,
      area: formData.area,
      weeks: parseInt(formData.semanas) || null,
      theoryHours: parseInt(formData.horasSemanales) || null,
      credits: parseInt(formData.creditos) || null,
      semester: formData.semestre,
      cycle: formData.ciclo,
      modality: formData.modalidad,
      coordinadorId: formData.coordinadorId ? parseInt(formData.coordinadorId) : null,
      docentes: formData.docentes.map((d) => parseInt(d)),
      prerrequisitos: formData.prerrequisitos.map((p) => parseInt(p)),
    };

    try {
      const res = await fetch(`/api/cursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        alert('Curso actualizado correctamente');
        router.push('/director/cursos');
      } else {
        const error = await res.json();
        alert(error.error || 'Error al actualizar el curso');
      }
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      alert('Error al actualizar el curso');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container mt-4 mb-5">
        <h1 className="h3 mb-4">Editar Curso</h1>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {[{ label: 'Nombre', name: 'nombre' },
              { label: 'Código', name: 'codigo' },
              { label: 'Tipo', name: 'tipo' },
              { label: 'Área', name: 'area' },
              { label: 'Semanas', name: 'semanas', type: 'number' },
              { label: 'Horas Semanales', name: 'horasSemanales', type: 'number' },
              { label: 'Créditos', name: 'creditos', type: 'number' },
              { label: 'Semestre', name: 'semestre' },
              { label: 'Ciclo', name: 'ciclo' },
              { label: 'Modalidad', name: 'modalidad' }].map(
              ({ label, name, type = 'text' }) => (
                <div key={name} className="col-md-6 mb-3">
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
              )
            )}

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
                  <option key={curso.id} value={curso.id}>
                    {curso.name}
                  </option>
                ))}
              </select>
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
                  <option key={docente.id} value={docente.id}>
                    {docente.name}
                  </option>
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
                  <option key={coord.id} value={coord.id}>
                    {coord.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-success">
              Actualizar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
