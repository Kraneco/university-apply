import { NextRequest } from 'next/server';
import { NotificationService } from '@/lib/services/notification-service';
import { getCurrentUser } from '@/lib/auth';
import {
  createApiResponse,
  createErrorResponse,
  createUnauthorizedResponse,
} from '@/lib/api-response';
import { type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// GET /api/notifications - 获取用户的通知
export async function GET(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const unreadOnly = searchParams.get('unread') === 'true';

    let notifications = await NotificationService.findByUserId(user.id);

    // 如果只获取未读通知，则过滤
    if (unreadOnly) {
      notifications = notifications.filter(
        (notification) => !notification.isRead
      );
    }

    // 如果指定了限制数量，则截取
    const limitedNotifications = limit
      ? notifications.slice(0, parseInt(limit))
      : notifications;

    return createApiResponse(
      limitedNotifications,
      'api.notifications.fetchSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.notifications.fetchError',
      undefined,
      500,
      language
    );
  }
}

// POST /api/notifications - 标记所有通知为已读
export async function POST(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    await NotificationService.markAllAsRead(user.id);

    return createApiResponse(
      null,
      'api.notifications.markAllReadSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.notifications.markAllReadError',
      undefined,
      500,
      language
    );
  }
}
