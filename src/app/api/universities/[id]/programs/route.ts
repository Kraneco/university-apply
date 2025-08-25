import { NextRequest } from 'next/server';
import { UniversityService } from '@/lib/services/university-service';
import {
  createApiResponse,
  createErrorResponse,
  createNotFoundResponse,
} from '@/lib/api-response';
import { getTranslation, type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// GET /api/universities/[id]/programs - 获取大学的专业列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const language = getRequestLanguage(request);
    const { id } = await params;

    // 检查大学是否存在
    const university = await UniversityService.findById(id);
    if (!university) {
      return createNotFoundResponse('api.universities.notFound', language);
    }

    // 获取大学的专业列表
    const programs = await UniversityService.getPrograms(id);

    return createApiResponse(
      programs,
      'api.universities.fetchProgramsSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching university programs:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.universities.fetchProgramsError',
      undefined,
      500,
      language
    );
  }
}
