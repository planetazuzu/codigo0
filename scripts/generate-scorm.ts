#!/usr/bin/env tsx

/**
 * Script principal para generar paquetes SCORM
 * Fase C: Generación completa de paquetes SCORM
 * 
 * Uso:
 *   npm run scorm:generate [guide-id]
 * 
 * Ejemplo:
 *   npm run scorm:generate abcde-operativo
 */

import { mkdir, copyFile, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getGuideById, getAllGuides } from '../src/data/guides-index.js';
import { convertMarkdownToHtml } from '../scorm/generator/markdown-to-html.js';
import { generateManifest } from '../scorm/generator/manifest-generator.js';
import { buildScormPackage } from '../scorm/generator/package-builder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function main() {
    const guideId = process.argv[2];
    
    if (!guideId) {
        console.log('📋 Guías disponibles:');
        const guides = getAllGuides();
        guides.forEach(guide => {
            console.log(`  - ${guide.id}: ${guide.titulo}`);
        });
        console.log('\n💡 Uso: npm run scorm:generate <guide-id>');
        process.exit(0);
    }
    
    const guide = getGuideById(guideId);
    if (!guide) {
        console.error(`❌ Guía no encontrada: ${guideId}`);
        process.exit(1);
    }
    
    console.log(`\n🚀 Generando SCORM para: ${guide.titulo}`);
    console.log(`   ID: ${guide.id}`);
    console.log(`   Secciones: ${guide.secciones.length}\n`);
    
    // Crear directorios de salida
    const packageDir = join(projectRoot, 'scorm', 'packages', guide.id);
    const sectionsDir = join(packageDir, 'sections');
    const assetsDir = join(packageDir, 'assets');
    const distDir = join(projectRoot, 'scorm', 'dist');
    
    await mkdir(sectionsDir, { recursive: true });
    await mkdir(assetsDir, { recursive: true });
    await mkdir(distDir, { recursive: true });
    
    // FASE 1: Convertir Markdown a HTML
    console.log('📝 Fase 1: Convirtiendo Markdown a HTML...');
    
    for (const section of guide.secciones) {
        // La ruta en guides-index.ts ya incluye /docs/consolidado/, pero necesitamos public/
        const markdownPath = join(projectRoot, 'public', section.ruta.replace('/docs/consolidado/', 'docs/consolidado/'));
        const outputPath = join(sectionsDir, `section-${String(section.numero).padStart(2, '0')}.html`);
        
        console.log(`   ✓ Sección ${section.numero}: ${section.titulo}`);
        
        try {
            const htmlContent = await convertMarkdownToHtml(markdownPath);
            // Envolver en estructura HTML completa con SCORM
            const wrappedHtml = wrapSectionHtml(htmlContent, section, guide);
            await writeFile(outputPath, wrappedHtml, 'utf-8');
            console.log(`     ✅ Convertido correctamente`);
        } catch (error) {
            console.error(`     ❌ Error:`, error);
            throw error;
        }
    }
    
    console.log('\n✅ Fase 1 completada: Markdown convertido a HTML');
    
    // FASE 2: Copiar templates y assets
    console.log('\n📦 Fase 2: Copiando templates y assets...');
    
    const templatesDir = join(projectRoot, 'scorm', 'templates');
    await copyFile(join(templatesDir, 'scorm-api.js'), join(assetsDir, 'scorm-api.js'));
    await copyFile(join(templatesDir, 'navigation.js'), join(assetsDir, 'navigation.js'));
    await copyFile(join(templatesDir, 'styles.css'), join(assetsDir, 'styles.css'));
    
    // Generar index.html desde template
    const indexTemplate = await readFile(join(templatesDir, 'index.html'), 'utf-8');
    const indexHtml = indexTemplate
        .replace(/{{TITLE}}/g, guide.titulo)
        .replace(/{{TOTAL_SECTIONS}}/g, guide.secciones.length.toString());
    await writeFile(join(packageDir, 'index.html'), indexHtml, 'utf-8');
    
    console.log('   ✅ Templates y assets copiados');
    
    // FASE 3: Generar imsmanifest.xml
    console.log('\n📄 Fase 3: Generando imsmanifest.xml...');
    
    const manifestPath = join(packageDir, 'imsmanifest.xml');
    await generateManifest(guide, manifestPath);
    console.log('   ✅ Manifest generado');
    
    // FASE 4: Generar paquete ZIP
    console.log('\n📦 Fase 4: Generando paquete ZIP...');
    
    const zipPath = join(distDir, `${guide.id}-scorm-1.2.zip`);
    await buildScormPackage(guide, packageDir, zipPath);
    console.log(`   ✅ Paquete ZIP generado: ${zipPath}`);
    
    console.log('\n🎉 ¡Paquete SCORM generado exitosamente!');
    console.log(`\n📦 Archivo: ${zipPath}`);
    console.log(`\n💡 Próximos pasos:`);
    console.log(`   - Importar el ZIP en un LMS (Moodle, Canvas, etc.)`);
    console.log(`   - Verificar que el tracking funciona correctamente`);
    console.log(`   - Probar navegación entre secciones`);
}

/**
 * Envolver contenido HTML de sección en estructura completa con SCORM
 */
function wrapSectionHtml(content: string, section: any, guide: any): string {
    const prevSection = section.numero > 1 ? `section-${String(section.numero - 1).padStart(2, '0')}.html` : null;
    const nextSection = section.numero < guide.secciones.length ? `section-${String(section.numero + 1).padStart(2, '0')}.html` : null;
    const progress = (section.numero / guide.secciones.length) * 100;
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${section.titulo} - ${guide.titulo}</title>
    <link rel="stylesheet" href="../assets/styles.css">
    <script src="../assets/scorm-api.js"></script>
</head>
<body>
    <div class="scorm-container">
        <header class="scorm-header">
            <h1>${guide.titulo}</h1>
            <div class="scorm-progress">
                <span>Sección ${section.numero} de ${guide.secciones.length}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        </header>
        
        <main class="scorm-content">
            <h2>${section.titulo}</h2>
            ${content}
        </main>
        
        <footer class="scorm-footer">
            ${prevSection ? `<a href="${prevSection}" class="btn-nav">← Anterior</a>` : '<button class="btn-nav" disabled>← Anterior</button>'}
            ${nextSection ? `<a href="${nextSection}" class="btn-nav">Siguiente →</a>` : '<button onclick="completeCourse()" class="btn-nav">Completar</button>'}
            <button onclick="exitCourse()" class="btn-exit">Salir</button>
        </footer>
    </div>
    
    <script>
        // Inicializar SCORM al cargar
        (function() {
            if (window.SCORM) {
                window.SCORM.updateProgress(${section.numero}, ${guide.secciones.length});
            }
            
            // Función para completar curso
            window.completeCourse = function() {
                if (window.SCORM) {
                    window.SCORM.setCompleted();
                }
                alert('¡Has completado la guía!');
            };
            
            // Función para salir
            window.exitCourse = function() {
                if (window.SCORM) {
                    window.SCORM.terminate();
                }
                if (window.opener) {
                    window.close();
                } else {
                    window.location.href = '../index.html';
                }
            };
        })();
    </script>
</body>
</html>`;
}

main().catch(console.error);

