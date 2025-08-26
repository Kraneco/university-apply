import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserService } from '@/lib/user-service';
import {
  createApiResponse,
  createErrorResponse,
  createUnauthorizedResponse,
} from '@/lib/api-response';
import { type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

export async function GET(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);

    // 从 cookie 中获取 token
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    // 验证 token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string; email: string; role: string };

    // 获取用户信息
    const user = await UserService.findById(decoded.userId);
    if (!user) {
      return createErrorResponse(
        'api.auth.userNotFound',
        undefined,
        404,
        language
      );
    }

    return createApiResponse({ user }, 'api.general.success', 200, language);
  } catch (error) {
    const language = getRequestLanguage(request);

    if (error instanceof jwt.JsonWebTokenError) {
      return createErrorResponse(
        'api.auth.invalidToken',
        undefined,
        401,
        language
      );
    }

    return createErrorResponse(
      'api.general.serverError',
      undefined,
      500,
      language
    );
  }
}
