import { NextRequest } from 'next/server';
import { ReminderService } from '@/lib/services/reminder-service';
import { getCurrentUser } from '@/lib/auth';
import {
  createApiResponse,
  createErrorResponse,
  createNotFoundResponse,
  createUnauthorizedResponse,
  createForbiddenResponse,
  getRequestLanguage,
} from '@/lib/api-response';

// PUT /api/reminders/[id]/complete - 标记提醒为完成
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);

    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    // 检查提醒是否存在
    const existingReminder = await ReminderService.findById(id);
    if (!existingReminder) {
      return createNotFoundResponse('api.reminders.notFound', language);
    }

    // 检查用户权限
    if (existingReminder.userId !== user.id && user.role !== 'admin') {
      return createForbiddenResponse('api.auth.forbidden', language);
    }

    const success = await ReminderService.markAsCompleted(id);

    if (!success) {
      return createErrorResponse(
        'api.reminders.completeError',
        undefined,
        500,
        language
      );
    }

    return createApiResponse(
      null,
      'api.reminders.completeSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error completing reminder:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.reminders.completeError',
      undefined,
      500,
      language
    );
  }
}
