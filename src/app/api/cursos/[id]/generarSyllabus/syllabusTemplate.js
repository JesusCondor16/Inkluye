// src/app/api/cursos/[id]/generarSyllabus/syllabusTemplate.js

export function renderSyllabusHTML(curso, t, lang = 'es') {
  return `
    <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <title>${t.title} - ${curso.name}</title>
        <link rel="icon" href="/syllabus/documento.ico" type="image/x-icon" />
        <style>
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 11pt;
            color: #000;
            line-height: 1.4;
            margin: 0;
            padding: 0;
          }
          .wrapper {
            padding: 0;
            margin: 0;
          }
          h1 {
            text-align: center;
            font-size: 14pt;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 10px;
          }
          .logo {
            height: 80px;
          }
          .institucional {
            text-align: center;
            margin-bottom: 15px;
            line-height: 1;
          }
          .institucional p {
            margin: 2px 0;
            font-weight: normal;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 11pt;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
            margin-left: 20px;
            line-height: 1;
          }
          .info-table td {
            padding: 2px 5px;
            vertical-align: top;
            font-weight: normal;
          }
          .label {
            width: 35%;
            padding-left: 15px;
          }
          .colon {
            width: 3%;
          }
          .value {
            width: 62%;
            text-align: left;
          }
          .competencias-table, .evaluacion-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
            line-height: 1;
          }
          .competencias-table th, .competencias-table td,
          .evaluacion-table th, .evaluacion-table td {
            border: 1px solid #000;
            padding: 4px 8px;
            text-align: left;
          }
          .seccion-logros ul {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
          }
          .seccion-logros li {
            margin-bottom: 12px;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .seccion-logros li p {
            font-size: 11pt;
            color: #000;
            margin: 0;
            line-height: 1.4;
            text-align: justify;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
            margin-left: 20px;
          }
          @page {
            margin: 1cm 1cm 1cm 2.5cm;
          }
        </style>
      </head>
      <body>
      <div class="wrapper">
        <div class="logo-container">
          <img src="http://localhost:3000/EscudoUNMSM.jpg" alt="Escudo UNMSM" width="150" />
        </div>

        <div class="institucional">
          ${
            lang === 'es'
              ? `
            <p>UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS</p>
            <p><em>(Universidad del Perú, DECANA DE AMÉRICA)</em></p>
            <p>FACULTAD DE INGENIERÍA DE SISTEMAS E INFORMÁTICA</p>
            <p>ESCUELA PROFESIONAL DE INGENIERÍA DE SOFTWARE</p>
            `
              : lang === 'en'
              ? `
            <p>NATIONAL UNIVERSITY OF SAN MARCOS</p>
            <p><em>(The University of Peru, DEAN OF AMERICA)</em></p>
            <p>FACULTY OF SYSTEMS ENGINEERING AND COMPUTER SCIENCE</p>
            <p>SCHOOL OF SOFTWARE ENGINEERING</p>
            `
              : `
            <p>圣马尔科斯国立大学</p>
            <p><em>（秘鲁大学，美洲的创始大学）</em></p>
            <p>系统与信息工程学院</p>
            <p>软件工程专业</p>
            `
          }
        </div>

        <h1>${t.title}</h1>

        <div class="section">
          <p class="section-title">${t.generalInfo}</p>
          <table class="info-table">
            <tr><td class="label">${t.subject}</td><td class="colon">:</td><td class="value">${curso.name}</td></tr>
            <tr><td class="label">${t.code}</td><td class="colon">:</td><td class="value">${curso.code}</td></tr>
            <tr><td class="label">${t.type}</td><td class="colon">:</td><td class="value">${curso.type}</td></tr>
            <tr><td class="label">${t.area}</td><td class="colon">:</td><td class="value">${curso.area}</td></tr>
            <tr><td class="label">${t.weeks}</td><td class="colon">:</td><td class="value">${curso.weeks}</td></tr>
            <tr><td class="label">${t.hours}</td><td class="colon">:</td><td class="value">${t.theoryHoursLabel}: ${curso.theoryHours}, ${t.practiceHoursLabel}: ${curso.practiceHours}, ${t.labHoursLabel}: ${curso.labHours}</td></tr>
            <tr><td class="label">${t.semester}</td><td class="colon">:</td><td class="value">${curso.semester}</td></tr>
            <tr><td class="label">${t.cycle}</td><td class="colon">:</td><td class="value">${curso.cycle}</td></tr>
            <tr><td class="label">${t.credits}</td><td class="colon">:</td><td class="value">${curso.credits}</td></tr>
            <tr><td class="label">${t.modality}</td><td class="colon">:</td><td class="value">${curso.modality}</td></tr>
            <tr><td class="label">${t.prerequisites}</td><td class="colon">:</td><td class="value">${curso.prerequisites?.length ? curso.prerequisites.map(p => p.prerequisite.name).join(', ') : '—'}</td></tr>
            <tr><td class="label">${t.teachers}</td><td class="colon">:</td><td class="value">
              ${curso.cursoDocentes?.length ? curso.cursoDocentes.map(d => `${d.user.name} (${d.user.email})`).join('<br>') : '—'}
            </td></tr>
          </table>
        </div>

        <div class="section seccion-sumilla">
          <p class="section-title">${t.sumilla}</p>
          <p>${curso.sumilla ?? '—'}</p>
        </div>

        <div class="section seccion-competencias">
          <p class="section-title">${t.competenciesTitle}</p>
          <table class="competencias-table">
            <thead>
              <tr>
                <th>${t.codeHeader}</th>
                <th>${t.descriptionHeader}</th>
                <th>${t.typeHeader}</th>
                <th>${t.levelHeader}</th>
              </tr>
            </thead>
            <tbody>
              ${curso.competencias?.map(c => `
                <tr>
                  <td>${c.codigo}</td>
                  <td>${c.descripcion}</td>
                  <td>${c.tipo}</td>
                  <td>${c.nivel}</td>
                </tr>
              `).join('') ?? ''}
            </tbody>
          </table>
        </div>

        <div class="section seccion-logros">
          <p class="section-title">${t.achievements}</p>
          <ul>
            ${curso.logros?.map(l => `
              <li>
                <p>${l.codigo}</p>
                <p>${l.descripcion}</p>
              </li>
            `).join('') ?? ''}
          </ul>
        </div>

        <div class="section seccion-capacidades">
          <p class="section-title">${t.capacities}</p>
          <ul style="padding-left: 20px; list-style-type: disc;">
            ${curso.capacidades?.map((cap, i) => `
              <li style="margin-bottom: 12px;">
                <p><strong>${t.unitName ?? 'Unidad'} ${i + 1}:</strong> ${cap.nombre ?? '—'}</p>
                <p><strong>${t.unitDescription ?? 'Descripción'}:</strong> ${cap.descripcion ?? '—'}</p>
              </li>
            `).join('')}
          </ul>
        </div>


        
        <div class="section seccion-programacion">
          <p class="section-title">${t.programming}</p>

          ${curso.capacidades?.map((cap, i) => `
            <h3 style="margin-top: 1em;">${t.unitName ?? 'Unidad'} ${i + 1}: ${cap.nombre ?? '—'}</h3>
            <p><strong>${t.unitAchievementLabel ?? 'Logro de la unidad'}:</strong> ${cap.programaciones?.[0]?.logroUnidad ?? '—'}</p>

            <table class="evaluacion-table" style="margin-bottom: 2em;">
              <thead>
                <tr>
                  <th>${t.tableHeaders.week}</th>
                  <th>${t.tableHeaders.content}</th>
                  <th>${t.tableHeaders.activities}</th>
                  <th>${t.tableHeaders.resources}</th>
                  <th>${t.tableHeaders.strategies}</th>
                </tr>
              </thead>
              <tbody>
                ${(cap.programaciones ?? []).map((p, j) => {
                  const semana = p.semana?.trim() ?? '—';
                  const contenido = p.contenido?.trim() ?? '—';

                  const contenidoLower = contenido.toLowerCase();
                  const isExamenParcial = semana === '8' && contenidoLower === 'examen parcial';
                  const isExamenFinal = semana === '16' && contenidoLower === 'examen final';

                  // Formateador universal
                  const format = (txt) =>
                    (txt ?? '—')
                      .toString()
                      .replace(/\r?\n/g, '<br>')
                      .replace(/ {2}/g, '&nbsp;&nbsp;');

                  if (isExamenParcial || isExamenFinal) {
                    return `
                      <tr>
                        <td>${semana}</td>
                        <td colspan="4" style="text-align:center; font-weight:bold;">
                          ${format(contenido)}
                        </td>
                      </tr>
                    `;
                  }

                  return `
                    <tr>
                      <td>${semana}</td>
                      <td>${format(p.contenido)}</td>
                      <td>${format(p.actividades)}</td>
                      <td>${format(p.recursos)}</td>
                      <td>${format(p.estrategias)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `).join('')}


          <div class="section seccion-estrategia">
          <p class="section-title">${t.strategy}</p>
          <p>${curso.evaluacion?.estrategia ?? '—'}</p>
        </div>


        <div class="section seccion-evaluacion">
          <p class="section-title">${t.evaluation}</p>
          <p>${curso.evaluacion?.evaluacion ?? '—'}</p>
          <p><strong>${t.formula}:</strong> ${curso.evaluacion?.formula ?? '—'}</p>
          <ul>
            ${curso.evaluacion?.notas?.map(n => `<li>${n.texto}</li>`).join('') ?? ''}
          </ul>
          <table class="evaluacion-table">
            <thead>
              <tr>
                <th>${t.unit}</th>
                <th>${t.criterion}</th>
                <th>${t.performance}</th>
                <th>${t.product}</th>
                <th>${t.instrument}</th>
              </tr>
            </thead>
            <tbody>
              ${curso.matriz.map(m => `
                <tr>
                  <td>${m.unidad}</td>
                  <td>${m.criterio}</td>
                  <td>${m.desempenio}</td>
                  <td>${m.producto}</td>
                  <td>${m.instrumento}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>


        <div class="section seccion-bibliografia">
          <p class="section-title">${t.bibliography}</p>
          <ul>
            ${curso.bibliografias.map(b => `<li>${b.texto}</li>`).join('')}
          </ul>
        </div>




        </div>



        </div>
      </body>
    </html>
  `;
}