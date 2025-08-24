// 应用常量
export const APP_NAME = '大学申请跟踪系统';
export const APP_DESCRIPTION = '一站式大学申请管理平台';

// 路由常量
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  UNIVERSITIES: '/universities',
  APPLICATIONS: '/applications',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
} as const;

// 权限常量
export const PERMISSIONS = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;

// 申请状态常量
export const APPLICATION_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  MATERIALS_UPLOADED: 'materials_uploaded',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  DECISION_MADE: 'decision_made',
  COMPLETED: 'completed',
} as const;

// 申请决定常量
export const APPLICATION_DECISION = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
  DEFERRED: 'deferred',
} as const;

// 优先级常量
export const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// 材料类型常量
export const MATERIAL_TYPES = {
  TRANSCRIPT: 'transcript',
  RECOMMENDATION_LETTER: 'recommendation_letter',
  PERSONAL_STATEMENT: 'personal_statement',
  RESUME: 'resume',
  TEST_SCORE: 'test_score',
  OTHER: 'other',
} as const;

// 通知类型常量
export const NOTIFICATION_TYPES = {
  DEADLINE_REMINDER: 'deadline_reminder',
  STATUS_UPDATE: 'status_update',
  DECISION_NOTIFICATION: 'decision_notification',
  SYSTEM_ALERT: 'system_alert',
} as const;

// 提醒类别常量
export const REMINDER_CATEGORIES = {
  APPLICATION: 'application',
  TEST: 'test',
  DOCUMENT: 'document',
  OTHER: 'other',
} as const;

// 学位类型常量
export const DEGREE_TYPES = {
  BACHELOR: 'bachelor',
  MASTER: 'master',
  PHD: 'phd',
} as const;

// 申请截止日期类型常量
export const DEADLINE_TYPES = {
  EARLY_DECISION: 'early_decision',
  EARLY_ACTION: 'early_action',
  REGULAR_DECISION: 'regular_decision',
  ROLLING: 'rolling',
} as const;

// 国家常量
export const COUNTRIES = [
  '美国',
  '加拿大',
  '英国',
  '澳大利亚',
  '新西兰',
  '德国',
  '法国',
  '荷兰',
  '瑞士',
  '新加坡',
  '日本',
  '韩国',
  '中国',
] as const;

// 美国州常量
export const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
] as const;

// 文件上传限制
export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  MAX_FILES_PER_UPLOAD: 5,
} as const;

// 分页常量
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// API端点
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
  },
  UNIVERSITIES: {
    LIST: '/api/universities',
    DETAIL: '/api/universities/[id]',
    SEARCH: '/api/universities/search',
  },
  APPLICATIONS: {
    LIST: '/api/applications',
    CREATE: '/api/applications',
    UPDATE: '/api/applications/[id]',
    DELETE: '/api/applications/[id]',
    MATERIALS: '/api/applications/[id]/materials',
  },
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: '/api/notifications/[id]/read',
    MARK_ALL_READ: '/api/notifications/read-all',
  },
  REMINDERS: {
    LIST: '/api/reminders',
    CREATE: '/api/reminders',
    UPDATE: '/api/reminders/[id]',
    DELETE: '/api/reminders/[id]',
  },
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查您的网络连接',
  UNAUTHORIZED: '未授权访问，请重新登录',
  FORBIDDEN: '没有权限访问此资源',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据验证失败',
  SERVER_ERROR: '服务器内部错误',
  FILE_TOO_LARGE: '文件大小超过限制',
  INVALID_FILE_TYPE: '不支持的文件类型',
  EMAIL_ALREADY_EXISTS: '邮箱已被注册',
  INVALID_CREDENTIALS: '邮箱或密码错误',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '退出登录成功',
  PROFILE_UPDATED: '个人信息更新成功',
  APPLICATION_CREATED: '申请创建成功',
  APPLICATION_UPDATED: '申请更新成功',
  APPLICATION_DELETED: '申请删除成功',
  MATERIAL_UPLOADED: '材料上传成功',
  REMINDER_CREATED: '提醒创建成功',
  REMINDER_UPDATED: '提醒更新成功',
  REMINDER_DELETED: '提醒删除成功',
} as const;
