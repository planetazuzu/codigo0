import { describe, it, expect } from 'vitest';
import {
  getProtocol,
  getGuide,
  getAllProtocols,
  getAllDrugs,
  getAllGuides,
  getGuideSection,
} from './content-adapter';

describe('content-adapter', () => {
  describe('getProtocol', () => {
    it('retorna protocolo existente por id', () => {
      const p = getProtocol('rcp-adulto-svb');
      expect(p).not.toBeNull();
      expect(p?.id).toBe('rcp-adulto-svb');
    });
    it('retorna null para id inexistente', () => {
      expect(getProtocol('no-existe')).toBeNull();
    });
    it('retorna null para id vacío', () => {
      expect(getProtocol('')).toBeNull();
    });
  });

  describe('getAllProtocols', () => {
    it('retorna array no vacío', () => {
      const list = getAllProtocols();
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
    });
  });

  describe('getAllDrugs', () => {
    it('retorna array', () => {
      const list = getAllDrugs();
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe('getGuide', () => {
    it('retorna guía existente', () => {
      const g = getGuide('rcp-adulto-svb');
      expect(g).not.toBeNull();
      expect(g?.id).toBe('rcp-adulto-svb');
    });
    it('retorna null para id inexistente', () => {
      expect(getGuide('no-existe')).toBeNull();
    });
  });

  describe('getAllGuides', () => {
    it('retorna array no vacío', () => {
      const list = getAllGuides();
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
    });
  });

  describe('getGuideSection', () => {
    it('retorna sección 1 de guía existente', () => {
      const section = getGuideSection('rcp-adulto-svb', 1);
      expect(section).not.toBeNull();
      expect(section?.numero).toBe(1);
    });
  });
});
