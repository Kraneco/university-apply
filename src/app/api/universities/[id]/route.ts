import { NextRequest } from 'next/server';
import { UniversityService } from '@/lib/services/university-service';
import {
  createApiResponse,
  createErrorResponse,
  createNotFoundResponse,
} from '@/lib/api-response';
import { type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// GET /api/universities/[id] - 获取单个大学详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const language = getRequestLanguage(request);
    const { id } = await params;

    const university = await UniversityService.findById(id);

    if (!university) {
      return createNotFoundResponse('api.universities.notFound', language);
    }

    return createApiResponse(
      university,
      'api.universities.fetchDetailSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching university detail:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.universities.fetchDetailError',
      undefined,
      500,
      language
    );
  }
}
