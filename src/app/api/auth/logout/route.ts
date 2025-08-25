import { NextRequest, NextResponse } from 'next/server';
import { createApiResponse } from '@/lib/api-response';
import { getTranslation, type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

export async function POST(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);

    // 创建响应
    const responseData = {
      success: true,
      data: { message: '登出成功' },
      message: getTranslation(language, 'api.auth.logoutSuccess'),
      timestamp: new Date().toISOString(),
    };

    // 创建响应对象
    const response = NextResponse.json(responseData, { status: 200 });

    // 清除认证 cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 立即过期
    });

    return response;
  } catch (error) {
    const language = getRequestLanguage(request);
    return NextResponse.json(
      {
        success: false,
        message: getTranslation(language, 'api.auth.logoutError'),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
