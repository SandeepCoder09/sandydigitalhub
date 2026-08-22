/**
 * Server-Side Sanitization & Injection Defense Utility
 * Protects MongoDB queries, removes NoSQL injection operators, and neutralizes XSS payloads.
 */

/**
 * Recursively strips any keys starting with '$' or containing '.' to eliminate NoSQL injection.
 * Removes null byte characters (\0) and dangerous prototype pollution properties.
 */
export function sanitizeMongoQuery<T = any>(input: any): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    // Strip null bytes
    return input.replace(/\0/g, '') as unknown as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeMongoQuery(item)) as unknown as T;
  }

  if (typeof input === 'object') {
    const cleaned: Record<string, any> = {};

    for (const [key, value] of Object.entries(input)) {
      // Reject dangerous prototype pollution and MongoDB operators
      if (
        key.startsWith('$') ||
        key.includes('.') ||
        key === '__proto__' ||
        key === 'constructor' ||
        key === 'prototype'
      ) {
        continue;
      }

      cleaned[key] = sanitizeMongoQuery(value);
    }

    return cleaned as T;
  }

  return input;
}

/**
 * Escapes dangerous HTML characters to prevent Stored Cross-Site Scripting (XSS).
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips all HTML tags and script elements from a string, returning pure safe text.
 */
export function stripHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Sanitizes and normalizes plain text strings with reasonable length bounds.
 */
export function sanitizeText(str: string, maxLength: number = 2000): string {
  if (!str || typeof str !== 'string') return '';
  const cleaned = stripHtml(str).replace(/\0/g, '').trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Mass assignment protection: picks only explicitly allowlisted fields from an untrusted object.
 */
export function pickAllowedFields<T extends Record<string, any>>(
  source: any,
  allowedKeys: (keyof T | string)[]
): Partial<T> {
  if (!source || typeof source !== 'object') return {};
  const result: Partial<T> = {};

  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      result[key as keyof T] = sanitizeMongoQuery(source[key]);
    }
  }

  return result;
}
