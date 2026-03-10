/**
 * Utilidades de Sanitización
 * Previene ataques XSS en frontend
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizar HTML permitiendo solo tags seguros
 */
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') {
    // En SSR, retornar string vacío (no hay DOM)
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'class', 'id',
      'data-*', // Permitir atributos data-* para compatibilidad
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
    SAFE_FOR_TEMPLATES: false,
    SANITIZE_DOM: true,
    SANITIZE_NAMED_PROPS: false,
    USE_PROFILES: { html: true },
  });
}

/**
 * Sanitizar texto plano (eliminar HTML completamente)
 */
export function sanitizeText(text: string): string {
  if (typeof window === 'undefined') {
    return text;
  }

  // Crear un div temporal para extraer solo texto
  const div = document.createElement('div');
  div.textContent = text;
  return div.textContent || div.innerText || '';
}

/**
 * Sanitizar URL para prevenir javascript: y otros protocolos peligrosos
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Normalizar espacios
  url = url.trim();

  // Bloquear protocolos peligrosos
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
  const lowerUrl = url.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      console.warn(`⚠️  URL bloqueada por protocolo peligroso: ${url}`);
      return '#';
    }
  }

  // Permitir solo http, https, mailto, tel
  if (!/^(https?|mailto|tel|#):/.test(url)) {
    // Si no tiene protocolo, asumir relativa (segura)
    if (!url.startsWith('/') && !url.startsWith('./') && !url.startsWith('../')) {
      return `/${url}`;
    }
    return url;
  }

  return url;
}

/**
 * Sanitizar atributo src de imagen
 */
export function sanitizeImageSrc(src: string): string {
  if (!src || typeof src !== 'string') {
    return '';
  }

  // Normalizar espacios
  src = src.trim();

  // Bloquear protocolos peligrosos
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
  const lowerSrc = src.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerSrc.startsWith(protocol)) {
      console.warn(`⚠️  Image src bloqueada por protocolo peligroso: ${src}`);
      return '';
    }
  }

  // Permitir data URIs para imágenes base64 (necesario para algunas funcionalidades)
  if (src.startsWith('data:image/')) {
    // Validar que sea realmente una imagen
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
    const matches = src.match(/^data:(image\/[a-z0-9+]+);base64,/i);
    if (matches && validImageTypes.includes(matches[1].toLowerCase())) {
      return src; // Data URI válido
    }
    console.warn(`⚠️  Data URI inválido bloqueado: ${src.substring(0, 50)}...`);
    return '';
  }

  // Permitir http, https, y rutas relativas
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/') || src.startsWith('./') || src.startsWith('../')) {
    return src;
  }

  // Si no tiene protocolo ni ruta, asumir relativa desde public/
  return `/${src}`;
}

/**
 * Sanitizar atributo alt de imagen
 */
export function sanitizeImageAlt(alt: string | null | undefined): string {
  if (!alt || typeof alt !== 'string') {
    return '';
  }

  // Sanitizar como texto plano (sin HTML)
  return sanitizeText(alt).slice(0, 200); // Limitar longitud
}


