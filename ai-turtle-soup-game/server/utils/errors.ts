/**
 * 自定义错误类
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation Failed', public readonly details?: any) {
    super(message, 422);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too Many Requests') {
    super(message, 429);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service Unavailable') {
    super(message, 503);
  }
}

/**
 * 错误响应接口
 */
export interface ErrorResponse {
  error: string;
  message: string;
  requestId?: string;
  details?: any;
  timestamp: string;
  path?: string;
  method?: string;
}

/**
 * 创建标准错误响应
 */
export function createErrorResponse(
  error: Error | AppError,
  req?: any
): ErrorResponse {
  const errorName = error.constructor.name.replace('Error', '') || 'InternalServer';

  const response: ErrorResponse = {
    error: errorName,
    message: error.message,
    timestamp: new Date().toISOString(),
  };

  if (req) {
    response.requestId = req.headers['x-request-id'];
    response.path = req.path;
    response.method = req.method;
  }

  if (error instanceof ValidationError && error.details) {
    response.details = error.details;
  }

  // 生产环境隐藏堆栈信息
  if (process.env.NODE_ENV !== 'production' && error.stack) {
    response.details = response.details || {};
    response.details.stack = error.stack.split('\n').map(line => line.trim());
  }

  return response;
}