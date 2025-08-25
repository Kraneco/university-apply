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

// GET /api/reminders/[id] - 获取单个提醒
export async function GET(
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

    const reminder = await ReminderService.findById(id);

    if (!reminder) {
      return createNotFoundResponse('api.reminders.notFound', language);
    }

    // 检查用户权限
    if (reminder.userId !== user.id && user.role !== 'admin') {
      return createForbiddenResponse('api.auth.forbidden', language);
    }

    return createApiResponse(
      reminder,
      'api.reminders.fetchSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching reminder:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.reminders.fetchError',
      undefined,
      500,
      language
    );
  }
}

// PUT /api/reminders/[id] - 更新提醒
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

    const body = await request.json();
    const { title, description, dueDate, priority, category, isCompleted } =
      body;

    console.log('title', title);
    console.log('description', description);
    console.log('dueDate', dueDate);
    console.log('priority', priority);
    console.log('category', category);
    console.log('isCompleted', isCompleted);

    // 检查提醒是否存在
    const existingReminder = await ReminderService.findById(id);
    if (!existingReminder) {
      return createNotFoundResponse('api.reminders.notFound', language);
    }

    // 检查用户权限
    if (existingReminder.userId !== user.id && user.role !== 'admin') {
      return createForbiddenResponse('api.auth.forbidden', language);
    }

    console.log('existingReminder', existingReminder, user.id, user.role);

    const updatedReminder = await ReminderService.update(id, {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority,
      category,
      isCompleted,
    });

    console.log('updatedReminder', updatedReminder);

    if (!updatedReminder) {
      return createErrorResponse(
        'api.reminders.updateError',
        undefined,
        500,
        language
      );
    }

    return createApiResponse(
      updatedReminder,
      'api.reminders.updateSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error updating reminder:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.reminders.updateError',
      undefined,
      500,
      language
    );
  }
}

// DELETE /api/reminders/[id] - 删除提醒
export async function DELETE(
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

    const success = await ReminderService.delete(id);

    if (!success) {
      return createErrorResponse(
        'api.reminders.deleteError',
        undefined,
        500,
        language
      );
    }

    return createApiResponse(
      null,
      'api.reminders.deleteSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error deleting reminder:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.reminders.deleteError',
      undefined,
      500,
      language
    );
  }
}
