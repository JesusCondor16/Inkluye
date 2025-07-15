'use client';

import CursoForm from '@/components/CursoForm';

export default function EditarCursoPage({ params }) {
  const cursoId = params.id;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Curso</h1>
      <CursoForm modo="editar" cursoId={cursoId} />
    </div>
  );
}
