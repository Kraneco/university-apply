import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { UserService } from '@/lib/user-service';
import {
  createApiResponse,
  createErrorResponse,
  createValidationErrorResponse,
} from '@/lib/api-response';
import { validatePassword } from '@/lib/utils';
import { getTranslation, type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// 注册数据验证模式
const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少需要8个字符'),
  name: z.string().min(2, '姓名至少需要2个字符'),
  role: z.enum(['student', 'admin']).default('student'),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);

    // 解析请求体
    const body = await request.json();

    // 验证输入数据
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return createValidationErrorResponse(
        'api.general.validationError',
        undefined,
        language
      );
    }

    const { email, password, name, role, phone } = validationResult.data;

    // 验证密码强度
    const passwordValidation = validatePassword(password, language);
    if (!passwordValidation.isValid) {
      return createErrorResponse(
        'api.auth.weakPassword',
        undefined,
        400,
        language
      );
    }

    // 创建用户
    const user = await UserService.createUser({
      email,
      password,
      name,
      role,
      phone,
    });

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // 创建响应
    const responseData = {
      success: true,
      data: { user, token },
      message: getTranslation(language, 'api.auth.registerSuccess'),
      timestamp: new Date().toISOString(),
    };

    // 创建响应对象
    const response = NextResponse.json(responseData, { status: 201 });

    // 设置 cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60 * 1000, // 24小时
    };

    response.cookies.set('auth-token', token, cookieOptions);

    return response;
  } catch (error) {
    const language = getRequestLanguage(request);

    // 处理已知错误
    if (error instanceof Error) {
      if (error.message === 'api.auth.emailAlreadyExists') {
        return createErrorResponse(
          'api.auth.emailAlreadyExists',
          undefined,
          409,
          language
        );
      }
    }

    // 处理未知错误
    return createErrorResponse('api.general.error', undefined, 500, language);
  }
}
