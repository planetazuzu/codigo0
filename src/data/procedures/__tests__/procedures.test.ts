import { describe, it, expect } from 'vitest';
import {
  procedures,
  getProcedureById,
  getProcedureByIdSafe,
  getProceduresByCategory,
  searchProcedures,
  procedureSchema,
  safeParseProcedure,
  parseProcedure,
} from '../index.js';
import type { Procedure } from '../types.js';

describe('procedures - importación y datos', () => {
  it('exporta array procedures no vacío', () => {
    expect(Array.isArray(procedures)).toBe(true);
    expect(procedures.length).toBeGreaterThan(0);
  });

  it('todos los procedimientos tienen id único', () => {
    const ids = procedures.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('contiene procedimientos críticos esperados', () => {
    const knownIds = ['rcp-adulto-svb', 'rcp-adulto-sva', 'rcp-pediatrico', 'ictus', 'obstruccion-via-aerea', 'shock-hemorragico'];
    for (const id of knownIds) {
      const found = procedures.some((p) => p.id === id);
      expect(found, `Procedimiento "${id}" debe existir`).toBe(true);
    }
  });

  it('cada procedimiento tiene campos obligatorios', () => {
    for (const p of procedures) {
      expect(p.id).toBeDefined();
      expect(p.title).toBeDefined();
      expect(p.shortTitle).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.priority).toBeDefined();
      expect(p.ageGroup).toBeDefined();
      expect(Array.isArray(p.steps)).toBe(true);
      expect(Array.isArray(p.warnings)).toBe(true);
    }
  });
});

describe('procedures - schemas Zod', () => {
  it('procedureSchema valida un procedimiento válido', () => {
    const sample: Procedure = procedures[0];
    const result = safeParseProcedure(sample);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(sample.id);
    }
  });

  it('parseProcedure retorna datos correctos para procedimiento válido', () => {
    const sample = procedures[0];
    const parsed = parseProcedure(sample);
    expect(parsed.id).toBe(sample.id);
    expect(parsed.title).toBe(sample.title);
  });

  it('safeParseProcedure rechaza objeto inválido', () => {
    const invalid = { id: '', title: 'x', shortTitle: 'x', category: 'soporte_vital', priority: 'alto', ageGroup: 'adulto', steps: [], warnings: [] };
    const result = safeParseProcedure(invalid);
    expect(result.success).toBe(false);
  });

  it('todos los procedimientos del array pasan procedureSchema', () => {
    for (const p of procedures) {
      const result = safeParseProcedure(p);
      expect(result.success, `Procedimiento "${p.id}" debe ser válido según schema`).toBe(true);
    }
  });
});

describe('procedures - utils', () => {
  it('getProcedureById retorna procedimiento existente', () => {
    const p = getProcedureById('rcp-adulto-svb');
    expect(p).toBeDefined();
    expect(p?.id).toBe('rcp-adulto-svb');
  });

  it('getProcedureById retorna undefined para id inexistente', () => {
    expect(getProcedureById('no-existe')).toBeUndefined();
  });

  it('getProcedureById retorna undefined para id vacío', () => {
    expect(getProcedureById('')).toBeUndefined();
    expect(getProcedureById('   ')).toBeUndefined();
  });

  it('getProcedureByIdSafe retorna success true y data para id existente', () => {
    const result = getProcedureByIdSafe('ictus');
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe('ictus');
  });

  it('getProcedureByIdSafe retorna success false para id inexistente', () => {
    const result = getProcedureByIdSafe('no-existe');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('getProceduresByCategory retorna solo procedimientos de esa categoría', () => {
    const soporte = getProceduresByCategory('soporte_vital' as Category);
    expect(soporte.every((p) => p.category === 'soporte_vital')).toBe(true);
    const patologias = getProceduresByCategory('patologias' as Category);
    expect(patologias.every((p) => p.category === 'patologias')).toBe(true);
  });

  it('searchProcedures encuentra por título', () => {
    const results = searchProcedures('RCP');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.title.toLowerCase().includes('rcp'))).toBe(true);
  });

  it('searchProcedures con query corta retorna vacío', () => {
    const results = searchProcedures('a');
    expect(results).toEqual([]);
  });
});
