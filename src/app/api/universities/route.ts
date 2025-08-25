import { NextRequest } from 'next/server';
import { UniversityService } from '@/lib/services/university-service';
import { createApiResponse, createErrorResponse } from '@/lib/api-response';
import { getTranslation, type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// GET /api/universities - 获取大学列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const country = searchParams.get('country');

    let universities;

    if (search) {
      universities = await UniversityService.search(search);
    } else if (country) {
      universities = await UniversityService.findByCountry(country);
    } else {
      universities = await UniversityService.findAll();
    }

    const language = getRequestLanguage(request);
    return createApiResponse(
      universities,
      'api.universities.fetchSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching universities:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.universities.fetchError',
      undefined,
      500,
      language
    );
  }
}
