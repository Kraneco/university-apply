import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { UserService } from '@/lib/user-service';
import {
  createErrorResponse,
  createValidationErrorResponse,
} from '@/lib/api-response';
import { getTranslation, type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// 登录数据验证模式
const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);

    // 解析请求体
    const body = await request.json();

    // 验证输入数据
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return createValidationErrorResponse(
        'api.general.validationError',
        undefined,
        language
      );
    }

    const { email, password, rememberMe } = validationResult.data;

    // 查找用户
    const user = await UserService.findByEmail(email);
    if (!user) {
      return createErrorResponse(
        'api.auth.invalidCredentials',
        undefined,
        401,
        language
      );
    }

    // 验证密码
    const isValidPassword = await UserService.verifyPassword(user, password);
    if (!isValidPassword) {
      return createErrorResponse(
        'api.auth.invalidCredentials',
        undefined,
        401,
        language
      );
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: rememberMe ? '30d' : '24h' }
    );

    // 创建响应
    const responseData = {
      success: true,
      data: { user, token },
      message: getTranslation(language, 'api.auth.loginSuccess'),
      timestamp: new Date().toISOString(),
    };

    // 创建响应对象
    const response = NextResponse.json(responseData, { status: 200 });

    // 设置 cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30天或24小时
    };

    response.cookies.set('auth-token', token, cookieOptions);

    return response;
  } catch (error) {
    const language = getRequestLanguage(request);
    console.error('Login error:', error);
    return createErrorResponse(
      'api.general.serverError',
      undefined,
      500,
      language
    );
  }
}
