export default function getMenuByRole(role) {
  const perfil = { label: 'Perfil', path: '/perfil' };
  const buscar = { label: 'Buscar Syllabus', path: '/buscar' };
  const info = { label: 'Información general', path: '/informacion' };

  switch (role) {
    case 'DIRECTOR':
      return [
        { label: 'Inicio', path: '/director' },
        { label: 'Gestión de docentes', path: '/director/docentes' },
        { label: 'Gestión de cursos', path: '/director/cursos' },
        { label: 'Agregar Curso', path: '/director/cursos/agregar' },
        buscar,
        perfil,
        info,
      ];
    case 'COORDINADOR':
      return [
        { label: 'Mis Cursos', path: '/coordinador/cursos' },
        buscar,
        perfil,
        info,
      ];
    case 'DOCENTE':
      return [
        buscar,
        perfil,
        info,
      ];
    case 'ESTUDIANTE':
      return [
        { label: 'Explorar Syllabus', path: '/estudiante/explorar' },
        buscar,
        perfil,
        info,
      ];
    default:
      return [buscar, perfil, info];
  }
}
