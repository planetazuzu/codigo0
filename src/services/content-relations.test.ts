import { describe, it, expect } from 'vitest';
import {
  getGuideForProtocol,
  getProtocolForGuide,
  getProtocolRelations,
  getProtocolRelationsSafe,
  getGuideRelations,
} from './content-relations';

describe('content-relations', () => {
  describe('getGuideForProtocol', () => {
    it('retorna guía para protocolo con guía', () => {
      const guide = getGuideForProtocol('rcp-adulto-svb');
      expect(guide).not.toBeNull();
      expect(guide?.id).toBe('rcp-adulto-svb');
    });
    it('retorna null para protocolo sin guía', () => {
      expect(getGuideForProtocol('shock-hemorragico')).toBeNull();
    });
    it('retorna null para id vacío', () => {
      expect(getGuideForProtocol('')).toBeNull();
    });
  });

  describe('getProtocolForGuide', () => {
    it('retorna protocolo para guía con protocolo', () => {
      const protocol = getProtocolForGuide('rcp-adulto-svb');
      expect(protocol).not.toBeNull();
      expect(protocol?.id).toBe('rcp-adulto-svb');
    });
  });

  describe('getProtocolRelations', () => {
    it('retorna relaciones para id válido', () => {
      const relations = getProtocolRelations('rcp-adulto-svb');
      expect(relations.protocol).not.toBeNull();
      expect(relations.protocol?.id).toBe('rcp-adulto-svb');
      expect(relations.mapping).toBeDefined();
    });
    it('retorna protocol null para id vacío', () => {
      const relations = getProtocolRelations('');
      expect(relations.protocol).toBeNull();
      expect(relations.mapping).toBeUndefined();
    });
  });

  describe('getProtocolRelationsSafe', () => {
    it('retorna success true para id válido', () => {
      const result = getProtocolRelationsSafe('ictus');
      expect(result.success).toBe(true);
      expect(result.data?.protocol?.id).toBe('ictus');
    });
    it('retorna success false para id vacío', () => {
      const result = getProtocolRelationsSafe('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getGuideRelations', () => {
    it('retorna relaciones para guía existente', () => {
      const relations = getGuideRelations('rcp-adulto-svb');
      expect(relations.guide).not.toBeNull();
      expect(relations.guide?.id).toBe('rcp-adulto-svb');
    });
  });
});
