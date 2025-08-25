import { NextRequest } from 'next/server';
import { ApplicationService } from '@/lib/services/application-service';
import { getCurrentUser } from '@/lib/auth';
import {
  createApiResponse,
  createErrorResponse,
  createUnauthorizedResponse,
  getRequestLanguage,
  handleApiError,
} from '@/lib/api-response';

// GET /api/applications - 获取用户的所有申请
export async function GET(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const applications = await ApplicationService.findByUserId(user.id);

    return createApiResponse(
      applications,
      'api.applications.fetchSuccess',
      200,
      language
    );
  } catch (error) {
    const language = getRequestLanguage(request);
    return handleApiError(error, 'api.applications.fetchError', language);
  }
}

// POST /api/applications - 创建新申请
export async function POST(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const body = await request.json();
    const { universityId, programId, notes, priority } = body;

    if (!universityId) {
      return createErrorResponse(
        'api.applications.missingFields',
        undefined,
        400,
        language
      );
    }

    const application = await ApplicationService.create({
      userId: user.id,
      universityId,
      programId,
      notes,
      priority: priority || 'medium',
    });

    return createApiResponse(
      application,
      'api.applications.createSuccess',
      201,
      language
    );
  } catch (error) {
    const language = getRequestLanguage(request);
    return handleApiError(error, 'api.applications.createError', language);
  }
}
