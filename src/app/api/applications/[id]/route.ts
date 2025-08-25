import { NextRequest } from 'next/server';
import { ApplicationService } from '@/lib/services/application-service';
import { getCurrentUser } from '@/lib/auth';
import {
  createApiResponse,
  createErrorResponse,
  createUnauthorizedResponse,
  createForbiddenResponse,
  createNotFoundResponse,
  getRequestLanguage,
} from '@/lib/api-response';

// GET /api/applications/[id] - 获取单个申请详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const application = await ApplicationService.findById(params.id);

    if (!application) {
      return createNotFoundResponse('api.applications.notFound', language);
    }

    // 检查用户权限
    if (application.userId !== user.id && user.role !== 'admin') {
      return createForbiddenResponse('api.auth.forbidden', language);
    }

    return createApiResponse(
      application,
      'api.applications.fetchSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching application:', error);
    return createErrorResponse(
      'api.applications.fetchError',
      undefined,
      500,
      language
    );
  }
}

// PUT /api/applications/[id] - 更新申请
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const body = await request.json();
    const { status, decision, notes, priority, submissionDate, decisionDate } =
      body;

    // 检查申请是否存在
    const existingApplication = await ApplicationService.findById(params.id);
    if (!existingApplication) {
      return createNotFoundResponse('api.applications.notFound', language);
    }

    // 检查用户权限
    if (existingApplication.userId !== user.id && user.role !== 'admin') {
      return createForbiddenResponse('api.auth.forbidden', language);
    }

    // 使用新的update方法
    const updatedApplication = await ApplicationService.update(params.id, {
      status,
      decision,
      notes,
      priority,
      submissionDate,
      decisionDate,
    });

    if (!updatedApplication) {
      return createErrorResponse(
        'api.applications.updateError',
        undefined,
        500,
        language
      );
    }

    return createApiResponse(
      updatedApplication,
      'api.applications.updateSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error updating application:', error);
    return createErrorResponse(
      'api.applications.updateError',
      undefined,
      500,
      language
    );
  }
}

// DELETE /api/applications/[id] - 删除申请
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    // 检查申请是否存在
    const existingApplication = await ApplicationService.findById(params.id);
    if (!existingApplication) {
      return createNotFoundResponse('api.applications.notFound', language);
    }

    // 检查用户权限
    if (existingApplication.userId !== user.id && user.role !== 'admin') {
      return createForbiddenResponse('api.auth.forbidden', language);
    }

    await ApplicationService.delete(params.id);

    return createApiResponse(
      null,
      'api.applications.deleteSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error deleting application:', error);
    return createErrorResponse(
      'api.applications.deleteError',
      undefined,
      500,
      language
    );
  }
}
