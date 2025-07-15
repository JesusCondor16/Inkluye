// src/lib/translateCurso.js

import { translateGoogle } from './translateGoogle';

export async function translateCurso(curso, lang) {
  if (lang === 'es') return curso;

  const traducir = async (txt) => {
    if (!txt || typeof txt !== 'string' || txt.trim() === '') return '—';
    return await translateGoogle(txt, lang);
  };

  const asegurarArray = (x) => Array.isArray(x) ? x : [];

  return {
    ...curso,

    // Traducción directa de campos base
    name: await traducir(curso.name ?? ''),
    sumilla: await traducir(curso.sumilla ?? ''),
    type: await traducir(curso.type ?? ''),
    area: await traducir(curso.area ?? ''),
    modality: await traducir(curso.modality ?? ''),

    // Horas semanales (si son números, los convertimos a string y traducimos)
    theoryHours: curso.theoryHours ?? 0,
    practiceHours: curso.practiceHours ?? 0,
    labHours: curso.labHours ?? 0,

    // Traducción de competencias
    competencias: await Promise.all(
      asegurarArray(curso.competencias).map(async (c) => ({
        ...c,
        descripcion: await traducir(c.descripcion ?? ''),
        tipo: await traducir(c.tipo ?? ''),
      }))
    ),

    // Traducción de logros
    logros: await Promise.all(
      asegurarArray(curso.logros).map(async (l) => ({
        ...l,
        descripcion: await traducir(l.descripcion ?? ''),
      }))
    ),

    // Traducción de capacidades y programaciones
    capacidades: await Promise.all(
      asegurarArray(curso.capacidades).map(async (cap) => ({
        ...cap,
        nombre: await traducir(cap.nombre ?? ''),
        descripcion: await traducir(cap.descripcion ?? ''),
        programaciones: await Promise.all(
          asegurarArray(cap.programaciones).map(async (p) => ({
            ...p,
            logroUnidad: await traducir(p.logroUnidad ?? ''),
            contenido: await traducir(p.contenido ?? ''),
            actividades: await traducir(p.actividades ?? ''),
            recursos: await traducir(p.recursos ?? ''),
            estrategias: await traducir(p.estrategias ?? ''),
          }))
        ),
      }))
    ),

    // Evaluación
    evaluacion: curso.evaluacion
      ? {
          ...curso.evaluacion,
          estrategia: await traducir(curso.evaluacion.estrategia ?? ''),
          evaluacion: await traducir(curso.evaluacion.evaluacion ?? ''),
          formula: await traducir(curso.evaluacion.formula ?? ''),
          notas: await Promise.all(
            asegurarArray(curso.evaluacion.notas).map(async (n) => ({
              ...n,
              texto: await traducir(n.texto ?? ''),
            }))
          ),
        }
      : {
          estrategia: '—',
          evaluacion: '—',
          formula: '—',
          notas: [],
        },

    // Matriz
    matriz: await Promise.all(
      asegurarArray(curso.matriz).map(async (m) => ({
        ...m,
        unidad: await traducir(m.unidad ?? ''),
        criterio: await traducir(m.criterio ?? ''),
        desempenio: await traducir(m.desempenio ?? ''),
        producto: await traducir(m.producto ?? ''),
        instrumento: await traducir(m.instrumento ?? ''),
      }))
    ),

    // Bibliografía
    bibliografias: await Promise.all(
      asegurarArray(curso.bibliografias).map(async (b) => ({
        ...b,
        texto: await traducir(b.texto ?? ''),
      }))
    ),

    // Docentes del curso (puedes traducir los nombres si lo deseas)
    cursoDocentes: asegurarArray(curso.cursoDocentes).map((cd) => ({
      ...cd,
      user: {
        ...cd.user,
        name: cd.user.name, // O traducir si deseas: await traducir(cd.user.name)
      },
    })),

    // Coordinador (si quieres traducir el nombre)
    coordinador: curso.coordinador
      ? {
          ...curso.coordinador,
          name: curso.coordinador.name, // O traducir si deseas
        }
      : null,
  };
}
