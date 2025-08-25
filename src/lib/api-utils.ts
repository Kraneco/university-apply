import { getTranslation, type Language } from './i18n';
import { useLanguageStore } from '@/store/language-store';

// API 响应接口
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// 处理国际化的 API 响应
export function handleApiResponse<T>(
  response:
    | ApiResponse<T>
    | { success: boolean; message: string; data?: T; error?: string },
  language: Language = 'zh'
): ApiResponse<T> {
  // 确保响应有 timestamp
  const responseWithTimestamp: ApiResponse<T> = {
    ...response,
    timestamp:
      'timestamp' in response ? response.timestamp : new Date().toISOString(),
  };

  // 如果消息是 API 键（以 'api.' 开头），则翻译它
  if (responseWithTimestamp.message.startsWith('api.')) {
    const translatedMessage = getTranslation(
      language,
      responseWithTimestamp.message
    );
    return {
      ...responseWithTimestamp,
      message: translatedMessage,
    };
  }

  // 如果错误消息也是 API 键，则翻译它
  if (
    responseWithTimestamp.error &&
    responseWithTimestamp.error.startsWith('api.')
  ) {
    const translatedError = getTranslation(
      language,
      responseWithTimestamp.error
    );
    return {
      ...responseWithTimestamp,
      error: translatedError,
    };
  }

  return responseWithTimestamp;
}

// 获取当前语言的 API 响应处理函数
export function useApiResponseHandler() {
  const { language } = useLanguageStore();

  return (response: ApiResponse) => handleApiResponse(response, language);
}

// 通用的 API 请求函数
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  language: Language = 'zh'
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse: ApiResponse<T> = {
        success: false,
        message: data.message || getTranslation(language, 'api.general.error'),
        error:
          data.error || getTranslation(language, 'api.general.serverError'),
        timestamp: data.timestamp || new Date().toISOString(),
      };

      return handleApiResponse(errorResponse, language);
    }

    return handleApiResponse(data, language);
  } catch (error) {
    const networkErrorResponse: ApiResponse<T> = {
      success: false,
      message: getTranslation(language, 'api.general.networkError'),
      error:
        error instanceof Error
          ? error.message
          : getTranslation(language, 'api.general.unknownError'),
      timestamp: new Date().toISOString(),
    };

    return networkErrorResponse;
  }
}

// 创建成功响应
export function createSuccessResponse<T>(
  data: T,
  messageKey: string = 'api.general.success',
  language: Language = 'zh'
): ApiResponse<T> {
  return {
    success: true,
    message: getTranslation(language, messageKey),
    data,
    timestamp: new Date().toISOString(),
  };
}

// 创建错误响应
export function createErrorResponse<T>(
  messageKey: string = 'api.general.error',
  errorKey?: string,
  language: Language = 'zh'
): ApiResponse<T> {
  return {
    success: false,
    message: getTranslation(language, messageKey),
    error: errorKey ? getTranslation(language, errorKey) : undefined,
    timestamp: new Date().toISOString(),
  };
}
