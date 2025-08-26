import { NextRequest } from 'next/server';
import { ReminderService } from '@/lib/services/reminder-service';
import { getCurrentUser } from '@/lib/auth';
import {
  createApiResponse,
  createErrorResponse,
  createUnauthorizedResponse,
  getRequestLanguage,
  handleApiError,
} from '@/lib/api-response';

// GET /api/reminders - 获取用户的提醒
export async function GET(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming');
    const days = searchParams.get('days');

    let reminders;

    if (upcoming === 'true' && days) {
      const daysCount = parseInt(days) || 7;
      reminders = await ReminderService.getUpcoming(user.id, daysCount);
    } else {
      reminders = await ReminderService.findByUserId(user.id);
    }

    return createApiResponse(
      reminders,
      'api.reminders.fetchSuccess',
      200,
      language
    );
  } catch (error) {
    const language = getRequestLanguage(request);
    return handleApiError(error, 'api.reminders.fetchError', language);
  }
}

// POST /api/reminders - 创建新提醒
export async function POST(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const body = await request.json();
    const { title, description, dueDate, priority, category } = body;

    if (!title || !dueDate) {
      return createErrorResponse(
        'api.reminders.missingFields',
        undefined,
        400,
        language
      );
    }

    const reminder = await ReminderService.create({
      userId: user.id,
      title,
      description,
      dueDate: dueDate,
      priority: priority || 'medium',
      category: category || 'other',
    });

    return createApiResponse(
      reminder,
      'api.reminders.createSuccess',
      201,
      language
    );
  } catch (error) {
    const language = getRequestLanguage(request);
    return handleApiError(error, 'api.reminders.createError', language);
  }
}
