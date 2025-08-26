import { NextResponse } from 'next/server';
import { getTranslation, type Language } from '@/lib/i18n';
import { ApiResponse } from '@/types';

// 获取请求的语言（从请求头或默认中文）
export function getRequestLanguage(request?: Request): Language {
  if (!request) return 'zh';

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// 创建成功响应
export function createApiResponse<T>(
  data: T,
  messageKey?: string,
  status = 200,
  language: Language = 'zh'
): NextResponse<ApiResponse<T>> {
  const message = messageKey ? getTranslation(language, messageKey) : undefined;

  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// 创建错误响应
export function createErrorResponse(
  messageKey: string,
  errorKey?: string,
  status = 400,
  language: Language = 'zh'
): NextResponse<ApiResponse> {
  const message = getTranslation(language, messageKey);
  const error = errorKey ? getTranslation(language, errorKey) : undefined;

  return NextResponse.json(
    {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// 创建未授权响应
export function createUnauthorizedResponse(
  messageKey = 'api.auth.unauthorized',
  language: Language = 'zh'
): NextResponse<ApiResponse> {
  return createErrorResponse(messageKey, undefined, 401, language);
}

// 创建禁止访问响应
export function createForbiddenResponse(
  messageKey = 'api.auth.forbidden',
  language: Language = 'zh'
): NextResponse<ApiResponse> {
  return createErrorResponse(messageKey, undefined, 403, language);
}

// 创建未找到响应
export function createNotFoundResponse(
  messageKey = 'api.general.notFound',
  language: Language = 'zh'
): NextResponse<ApiResponse> {
  return createErrorResponse(messageKey, undefined, 404, language);
}

// 创建服务器错误响应
export function createServerErrorResponse(
  messageKey = 'api.general.serverError',
  language: Language = 'zh'
): NextResponse<ApiResponse> {
  return createErrorResponse(messageKey, undefined, 500, language);
}

// 创建验证错误响应
export function createValidationErrorResponse(
  messageKey = 'api.general.validationError',
  errorKey?: string,
  language: Language = 'zh'
): NextResponse<ApiResponse> {
  return createErrorResponse(messageKey, errorKey, 422, language);
}

// 兼容旧的API响应函数（用于平滑迁移）
export function apiSuccess<T>(
  data: T,
  messageKey?: string,
  status = 200
): NextResponse<ApiResponse<T>> {
  return createApiResponse(data, messageKey, status);
}

export function apiError(
  messageKey: string,
  errorKey?: string,
  status = 400
): NextResponse<ApiResponse> {
  return createErrorResponse(messageKey, errorKey, status);
}

// 处理常见错误的通用函数
export function handleApiError(
  error: unknown,
  defaultMessageKey: string,
  language: Language = 'zh'
): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // 数据库相关错误
    if (
      message.includes('database') ||
      message.includes('connection') ||
      message.includes('timeout')
    ) {
      return createErrorResponse(
        'api.general.databaseError',
        undefined,
        500,
        language
      );
    }

    // 外键约束错误
    if (message.includes('foreign key') || message.includes('constraint')) {
      return createErrorResponse(
        'api.general.constraintError',
        undefined,
        400,
        language
      );
    }

    // 重复键错误
    if (message.includes('duplicate') || message.includes('unique')) {
      return createErrorResponse(
        'api.general.duplicateError',
        undefined,
        409,
        language
      );
    }

    // 验证错误
    if (message.includes('validation') || message.includes('invalid')) {
      return createErrorResponse(
        'api.general.validationError',
        undefined,
        422,
        language
      );
    }

    // 权限错误
    if (message.includes('permission') || message.includes('access')) {
      return createErrorResponse(
        'api.general.forbidden',
        undefined,
        403,
        language
      );
    }
  }

  return createErrorResponse(defaultMessageKey, undefined, 500, language);
}

export function apiException(
  error: unknown,
  messageKey = 'api.general.serverError',
  status = 500
): NextResponse<ApiResponse> {
  return createErrorResponse(messageKey, undefined, status);
}
