import { prisma } from '@/lib/prisma';
import { renderSyllabusHTML } from './syllabusTemplate';
import { translateCurso } from '@/lib/translateCurso';
import { translations } from '@/lib/translations';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';



export async function GET(req, context) {
  const { searchParams } = new URL(req.url);
  const { params } = context;
  const lang = searchParams.get('lang') || 'es';
  const courseId = parseInt(params.id, 10);

  if (!courseId || isNaN(courseId)) {
    return new Response('ID inválido', { status: 400 });
  }

  const t = translations[lang] || translations['es'];
  

  try {
    let curso = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        cursoDocentes: { include: { user: true } },
        coordinador: true,
        evaluacion: { include: { notas: true } },
        matriz: true,
        bibliografias: true,
        competencias: true,
        logros: true,
        prerequisites: { include: { prerequisite: true } },
        syllabus: true,
        capacidades: {
          include: {
            programaciones: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    if (!curso) {
      return new Response('Curso no encontrado', { status: 404 });
    }

    curso.docentes = curso.cursoDocentes?.map((d) => d.user) || [];

    if (lang !== 'es') {
      curso = await translateCurso(curso, lang);
    }

    const html = renderSyllabusHTML(curso, t, lang);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      baseURL: 'http://localhost:3000',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: '60px',
        bottom: '80px',
        left: '80px',
        right: '20px',
      },
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="
          font-size: 10px;
          width: 100%;
          text-align: right;
          padding-right: 20px;
          color: #444;
        ">
          <span class="pageNumber"></span>
        </div>
      `,
    });

    await browser.close();

    const filename = `syllabus-${curso.code}-${lang}.pdf`;
    const filePath = path.join(process.cwd(), 'public', 'syllabus', filename);
    const pdfUrl = `/syllabus/${filename}`;

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, pdfBuffer);

    await prisma.syllabus.upsert({
      where: { courseId: curso.id },
      update: { pdfUrl },
      create: { courseId: curso.id, pdfUrl },
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generando PDF:', error);
    return new Response('Error interno generando PDF', { status: 500 });
  }
}