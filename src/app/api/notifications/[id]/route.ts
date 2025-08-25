import { NextRequest } from 'next/server';
import { NotificationService } from '@/lib/services/notification-service';
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

// PUT /api/notifications/[id] - 标记通知为已读
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await NotificationService.markAsRead(params.id);

    const language = getRequestLanguage(request);
    return createApiResponse(
      null,
      'api.notifications.markReadSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.notifications.markReadError',
      undefined,
      500,
      language
    );
  }
}

// DELETE /api/notifications/[id] - 删除通知
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await NotificationService.delete(params.id);

    const language = getRequestLanguage(request);
    return createApiResponse(
      null,
      'api.notifications.deleteSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.notifications.deleteError',
      undefined,
      500,
      language
    );
  }
}
