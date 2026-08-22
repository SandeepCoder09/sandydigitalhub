import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'PAYLOAD_TOO_LARGE'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface FieldErrorMap {
  [fieldName: string]: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly fieldErrors?: FieldErrorMap;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 400,
    code: ErrorCode = 'BAD_REQUEST',
    fieldErrors?: FieldErrorMap
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = 'Invalid request parameters', fieldErrors?: FieldErrorMap) {
    return new AppError(message, 400, 'BAD_REQUEST', fieldErrors);
  }

  static unauthorized(message = 'Authentication required. Please sign in.') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'You do not have permission to access this resource.') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(message = 'The requested resource was not found.') {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static conflict(message = 'A resource with these details already exists.') {
    return new AppError(message, 409, 'CONFLICT');
  }

  static validation(message = 'Input validation failed. Please check the form.', fieldErrors?: FieldErrorMap) {
    return new AppError(message, 422, 'VALIDATION_ERROR', fieldErrors);
  }

  static rateLimited(message = 'Too many requests. Please slow down and try again later.') {
    return new AppError(message, 429, 'RATE_LIMITED');
  }

  static internal(message = 'An unexpected server error occurred. Please try again later.') {
    return new AppError(message, 500, 'INTERNAL_ERROR');
  }
}

/**
 * Maps a ZodError instance into a clean field-to-message record.
 */
export function formatZodErrors(error: ZodError): FieldErrorMap {
  const fieldErrors: FieldErrorMap = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (path && !fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }
  return fieldErrors;
}

/**
 * Centralized API error response handler.
 * Logs internal details safely and returns clean JSON without exposing database internals.
 */
export function handleApiError(error: unknown, reqContext?: string): NextResponse {
  const requestId = Math.random().toString(36).substring(2, 10);
  const timestamp = new Date().toISOString();

  // 1. Zod Validation Errors
  if (error instanceof ZodError) {
    const fieldErrors = formatZodErrors(error);
    const firstMessage = Object.values(fieldErrors)[0] || 'Validation error';
    return NextResponse.json(
      {
        success: false,
        error: firstMessage,
        code: 'VALIDATION_ERROR',
        fieldErrors,
        requestId,
        timestamp,
      },
      { status: 422 }
    );
  }

  // 2. Custom App Errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        fieldErrors: error.fieldErrors,
        requestId,
        timestamp,
      },
      { status: error.statusCode }
    );
  }

  // 3. Mongoose Duplicate Key Error (Code 11000)
  if (typeof error === 'object' && error !== null && (error as any).code === 11000) {
    const keys = Object.keys((error as any).keyPattern || {}).join(', ');
    return NextResponse.json(
      {
        success: false,
        error: `A record with this ${keys || 'information'} already exists. Please choose a different value.`,
        code: 'CONFLICT',
        requestId,
        timestamp,
      },
      { status: 409 }
    );
  }

  // 4. Mongoose Cast Error (Invalid ObjectId)
  if (typeof error === 'object' && error !== null && (error as any).name === 'CastError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid reference or identifier format.',
        code: 'BAD_REQUEST',
        requestId,
        timestamp,
      },
      { status: 400 }
    );
  }

  // 5. Unknown Internal Errors (Sanitize and Log Securely)
  console.error(`[API_ERROR][${requestId}] ${reqContext || 'Route'}:`, error);

  return NextResponse.json(
    {
      success: false,
      error: 'We encountered an internal issue processing your request. Please try again later.',
      code: 'INTERNAL_ERROR',
      requestId,
      timestamp,
    },
    { status: 500 }
  );
}
