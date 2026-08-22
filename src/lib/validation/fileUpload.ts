import path from 'path';

export interface FileValidationOptions {
  maxSizeInBytes?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  category?: 'DOCUMENT' | 'IMAGE' | 'AVATAR' | 'INVOICE';
}

const DEFAULT_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const DEFAULT_ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];

const DANGEROUS_EXTENSIONS = [
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.php',
  '.js',
  '.ts',
  '.vbs',
  '.scr',
  '.jar',
  '.py',
  '.pl',
  '.msi',
  '.html',
  '.htm',
  '.svg', // Disallow SVG uploads from untrusted users to prevent stored XSS
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  extension?: string;
  sizeBytes?: number;
  mimeType?: string;
}

/**
 * Validates an uploaded File or Buffer server-side against strict security policies.
 */
export function validateUploadedFile(
  file: { name: string; size: number; type: string },
  options: FileValidationOptions = {}
): FileValidationResult {
  const maxSize = options.maxSizeInBytes || 10 * 1024 * 1024; // Default 10 MB
  const allowedMime = options.allowedMimeTypes || DEFAULT_ALLOWED_MIME_TYPES;
  const allowedExt = options.allowedExtensions || DEFAULT_ALLOWED_EXTENSIONS;

  if (!file || !file.name) {
    return { valid: false, error: 'No file provided or missing filename.' };
  }

  // 1. Check size
  if (file.size <= 0) {
    return { valid: false, error: 'File is empty (0 bytes).' };
  }

  if (file.size > maxSize) {
    const mbLimit = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `File exceeds maximum allowed size of ${mbLimit} MB.` };
  }

  // 2. Check Extension
  const rawExt = path.extname(file.name).toLowerCase();
  if (!rawExt) {
    return { valid: false, error: 'Files without extensions are not allowed.' };
  }

  if (DANGEROUS_EXTENSIONS.includes(rawExt)) {
    return { valid: false, error: 'Executable or potentially harmful file types are strictly prohibited.' };
  }

  if (!allowedExt.includes(rawExt)) {
    return {
      valid: false,
      error: `File format ${rawExt} is not supported. Allowed formats: ${allowedExt.join(', ')}`,
    };
  }

  // 3. Check MIME type
  const normalizedMime = file.type ? file.type.toLowerCase().trim() : '';
  if (normalizedMime && !allowedMime.includes(normalizedMime)) {
    return {
      valid: false,
      error: `Detected MIME type (${normalizedMime}) does not match allowed types.`,
    };
  }

  // 4. Generate Safe Normalized Filename
  const baseName = path
    .basename(file.name, rawExt)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 50);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = `${baseName}_${timestamp}_${randomSuffix}${rawExt}`;

  return {
    valid: true,
    sanitizedFilename,
    extension: rawExt,
    sizeBytes: file.size,
    mimeType: normalizedMime,
  };
}
