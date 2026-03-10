/**
 * Array único de procedimientos (evita dependencia circular con utils).
 */

import type { Procedure } from './types.js';
import { soportevitalProcedures } from './categories/soporte-vital.js';
import { patologiasProcedures } from './categories/patologias.js';
import { escenaProcedures } from './categories/escena.js';

export const procedures: Procedure[] = [
  ...soportevitalProcedures,
  ...patologiasProcedures,
  ...escenaProcedures,
];
