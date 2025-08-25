import { NextRequest } from 'next/server';
import { NotificationService } from '@/lib/services/notification-service';
import { getCurrentUser } from '@/lib/auth';
import {
  createApiResponse,
  createErrorResponse,
  createUnauthorizedResponse,
} from '@/lib/api-response';
import { getTranslation, type Language } from '@/lib/i18n';

// 获取请求的语言
function getRequestLanguage(request: NextRequest): Language {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('en')) return 'en';
  return 'zh';
}

// GET /api/notifications/unread-count - 获取用户未读通知数量
export async function GET(request: NextRequest) {
  try {
    const language = getRequestLanguage(request);
    const user = await getCurrentUser(request);
    if (!user) {
      return createUnauthorizedResponse('api.auth.unauthorized', language);
    }

    const unreadCount = await NotificationService.getUnreadCount(user.id);

    return createApiResponse(
      { unreadCount },
      'api.notifications.unreadCountSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching unread count:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.notifications.unreadCountError',
      undefined,
      500,
      language
    );
  }
}
