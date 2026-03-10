import { useState } from 'react';
import { Image, X, ZoomIn, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '@/components/ui/BackButton';

// Estructura de imágenes por bloque
const imagenesPorBloque: Record<string, { nombre: string; ruta: string; descripcion?: string }[]> = {
  'bloque-0-fundamentos': [
    { nombre: 'algoritmo_operativo_del_tes.svg', ruta: '/assets/infografias/bloque-0-fundamentos/algoritmo_operativo_del_tes.svg' },
    { nombre: 'diagrama_seleccion_dispositivo_oxigenoterapia.png', ruta: '/assets/infografias/bloque-0-fundamentos/diagrama_seleccion_dispositivo_oxigenoterapia.png' },
    { nombre: 'fast_transtelefonico.png', ruta: '/assets/infografias/bloque-0-fundamentos/fast_transtelefonico.png' },
    { nombre: 'flujo_desa_telefono.png', ruta: '/assets/infografias/bloque-0-fundamentos/flujo_desa_telefono.png' },
    { nombre: 'flujo_rcp_transtelefonica.png', ruta: '/assets/infografias/bloque-0-fundamentos/flujo_rcp_transtelefonica.png' },
    { nombre: 'guia_colocacion_dispositivos_oxigenoterapia.png', ruta: '/assets/infografias/bloque-0-fundamentos/guia_colocacion_dispositivos_oxigenoterapia.png' },
    { nombre: 'resumen_visual_del_algoritmo_start.svg', ruta: '/assets/infografias/bloque-0-fundamentos/resumen_visual_del_algoritmo_start.svg' },
    { nombre: 'tabla_rangos_fio2_oxigenoterapia.png', ruta: '/assets/infografias/bloque-0-fundamentos/tabla_rangos_fio2_oxigenoterapia.png' },
    { nombre: 'tabla_rangos_fio2_oxigenoterapia1.png', ruta: '/assets/infografias/bloque-0-fundamentos/tabla_rangos_fio2_oxigenoterapia1.png' },
  ],
  'bloque-2-inmovilizacion': [
    { nombre: 'colocacion_colchon_vacio_paso_a_paso.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/colocacion_colchon_vacio_paso_a_paso.png' },
    { nombre: 'colocacion_collarin_paso_1_preparacion.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_1_preparacion.png' },
    { nombre: 'colocacion_collarin_paso_2_parte_posterior.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_2_parte_posterior.png' },
    { nombre: 'colocacion_collarin_paso_3_parte_anterior.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_3_parte_anterior.png' },
    { nombre: 'colocacion_collarin_paso_4_ajuste_cierres.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_4_ajuste_cierres.png' },
    { nombre: 'colocacion_collarin_paso_5_verificacion.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_5_verificacion.png' },
    { nombre: 'colocacion_collarin_paso_6_liberacion_controlada.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/colocacion_collarin_paso_6_liberacion_controlada.png' },
    { nombre: 'componentes_camilla_cuchara.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/componentes_camilla_cuchara.png' },
    { nombre: 'componentes_colchon_vacio.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/componentes_colchon_vacio.png' },
    { nombre: 'componentes_sistema_inmovilizacion.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/componentes_sistema_inmovilizacion.png' },
    { nombre: 'componentes_sistema_inmovilizacion_1.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/componentes_sistema_inmovilizacion_1.png' },
    { nombre: 'componentes_tablero_espinal.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/componentes_tablero_espinal.png' },
    { nombre: 'coordinacion_equipo_inmovilizacion.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/coordinacion_equipo_inmovilizacion.png' },
    { nombre: 'errores_frecuentes_collarin_cervical.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/errores_frecuentes_collarin_cervical.png' },
    { nombre: 'posicion_tes_inmovilizacion_manual.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/posicion_tes_inmovilizacion_manual.png' },
    { nombre: 'posicion_tes_inmovilizacion_manual_1.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/posicion_tes_inmovilizacion_manual_1.png' },
    { nombre: 'secuencia_transicion_inmovilizacion.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/secuencia_transicion_inmovilizacion.png' },
    { nombre: 'seleccion_talla_collarin_2.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_2.png' },
    { nombre: 'seleccion_talla_collarin_cervical.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_cervical.png' },
    { nombre: 'seleccion_talla_collarin_cervical1.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_cervical1.png' },
    { nombre: 'seleccion_talla_collarin_error_demasiado_grande.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_error_demasiado_grande.png' },
    { nombre: 'seleccion_talla_collarin_medicion_anatomica.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_medicion_anatomica.png' },
    { nombre: 'seleccion_talla_collarin_tabla_tallas.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/seleccion_talla_collarin_tabla_tallas.png' },
    { nombre: 'situaciones_que_requieren_inmovilizacion.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/situaciones_que_requieren_inmovilizacion.png' },
    { nombre: 'tecnica_sujecion_manual_1.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/tecnica_sujecion_manual_1.png' },
    { nombre: 'tecnica_sujecion_manual_cervical.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/tecnica_sujecion_manual_cervical.png' },
    { nombre: 'verificaciones_post_colocacion_collarin.png', ruta: '/assets/infografias/bloque-2-inmovilizacion/verificaciones_post_colocacion_collarin.png' },
  ],
  'bloque-3-material-sanitario': [
    { nombre: 'canulas_guedel_nasofaringea.png', ruta: '/assets/infografias/bloque-3-material-sanitario/canulas_guedel_nasofaringea.png' },
    { nombre: 'configuracion_maxima_fio2_bolsa_mascarilla.png', ruta: '/assets/infografias/bloque-3-material-sanitario/configuracion_maxima_fio2_bolsa_mascarilla.png' },
    { nombre: 'dispositivos_supragloticos_guia.png', ruta: '/assets/infografias/bloque-3-material-sanitario/dispositivos_supragloticos_guia.png' },
    { nombre: 'interpretacion_constantes_semaforo.png', ruta: '/assets/infografias/bloque-3-material-sanitario/interpretacion_constantes_semaforo.png' },
    { nombre: 'registro_constantes_vitales.png', ruta: '/assets/infografias/bloque-3-material-sanitario/registro_constantes_vitales.png' },
    { nombre: 'uso_correcto_ambu.png', ruta: '/assets/infografias/bloque-3-material-sanitario/uso_correcto_ambu.png' },
    { nombre: 'uso_correcto_pulsioximetro.png', ruta: '/assets/infografias/bloque-3-material-sanitario/uso_correcto_pulsioximetro.png' },
    { nombre: 'uso_correcto_tensiometro.png', ruta: '/assets/infografias/bloque-3-material-sanitario/uso_correcto_tensiometro.png' },
    { nombre: 'ventilacion_medios_fortuna.png', ruta: '/assets/infografias/bloque-3-material-sanitario/ventilacion_medios_fortuna.png' },
  ],
  'bloque-7-conduccion': [
    { nombre: 'configuracion_gps_antes_de_salir.png', ruta: '/assets/infografias/bloque-7-conduccion/configuracion_gps_antes_de_salir.png' },
  ],
  'bloque-12-marco-legal': [
    { nombre: 'diagrama_decisiones_eticas_urgencias.png', ruta: '/assets/infografias/bloque-12-marco-legal/diagrama_decisiones_eticas_urgencias.png' },
    { nombre: 'diagrama_decisiones_eticas.png', ruta: '/assets/infografias/bloque-12-marco-legal/diagrama_decisiones_eticas.png' },
  ],
};

const nombresBloques: Record<string, string> = {
  'bloque-0-fundamentos': 'Fundamentos',
  'bloque-2-inmovilizacion': 'Inmovilización',
  'bloque-3-material-sanitario': 'Material Sanitario',
  'bloque-7-conduccion': 'Conducción',
  'bloque-12-marco-legal': 'Marco Legal',
};

const GaleriaImagenes = () => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [bloqueActivo, setBloqueActivo] = useState<string | null>(null);

  const handleImagenClick = (ruta: string) => {
    setImagenSeleccionada(ruta);
  };

  const handleDescargar = (ruta: string, nombre: string) => {
    const link = document.createElement('a');
    link.href = ruta;
    link.download = nombre;
    link.click();
  };

  const totalImagenes = Object.values(imagenesPorBloque).reduce((acc, imagenes) => acc + imagenes.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton to="/manual" label="Volver al manual" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Galería de Infografías</h1>
        <p className="text-muted-foreground">
          {totalImagenes} imágenes organizadas por bloques temáticos
        </p>
      </div>

      {/* Filtro por bloque */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBloqueActivo(null)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            bloqueActivo === null
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:bg-muted'
          }`}
        >
          Todas ({totalImagenes})
        </button>
        {Object.keys(imagenesPorBloque).map((bloque) => (
          <button
            key={bloque}
            onClick={() => setBloqueActivo(bloque)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              bloqueActivo === bloque
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-muted'
            }`}
          >
            {nombresBloques[bloque]} ({imagenesPorBloque[bloque].length})
          </button>
        ))}
      </div>

      {/* Grid de imágenes */}
      <div className="space-y-8">
        {(bloqueActivo ? [bloqueActivo] : Object.keys(imagenesPorBloque)).map((bloque) => (
          <div key={bloque} className="space-y-4">
            {!bloqueActivo && (
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                {nombresBloques[bloque]}
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagenesPorBloque[bloque].map((imagen) => (
                <div
                  key={imagen.ruta}
                  className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                  onClick={() => handleImagenClick(imagen.ruta)}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={imagen.ruta}
                      alt={imagen.nombre}
                      className="w-full h-full object-contain p-2"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          // ✅ FIX XSS: Usar createElement en lugar de innerHTML
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'flex flex-col items-center justify-center p-4 text-center';
                          
                          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                          svg.setAttribute('class', 'w-12 h-12 text-muted-foreground mb-2');
                          svg.setAttribute('fill', 'none');
                          svg.setAttribute('stroke', 'currentColor');
                          svg.setAttribute('viewBox', '0 0 24 24');
                          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                          path.setAttribute('stroke-linecap', 'round');
                          path.setAttribute('stroke-linejoin', 'round');
                          path.setAttribute('stroke-width', '2');
                          path.setAttribute('d', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z');
                          svg.appendChild(path);
                          errorDiv.appendChild(svg);
                          
                          const p = document.createElement('p');
                          p.className = 'text-xs text-muted-foreground';
                          p.textContent = 'Error al cargar';
                          errorDiv.appendChild(p);
                          
                          parent.innerHTML = '';
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-2 bg-card border-t border-border">
                    <p className="text-xs text-foreground truncate" title={imagen.nombre}>
                      {imagen.nombre.replace(/\.(png|svg|jpg)$/i, '')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de imagen ampliada */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setImagenSeleccionada(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nombre = imagenSeleccionada.split('/').pop() || 'imagen';
                handleDescargar(imagenSeleccionada, nombre);
              }}
              className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label="Descargar"
            >
              <Download className="w-5 h-5" />
            </button>
            <img
              src={imagenSeleccionada}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaImagenes;
