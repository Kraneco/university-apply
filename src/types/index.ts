// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  phone?: string;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 包含密码hash的用户类型（仅内部使用）
export interface UserWithPassword extends User {
  passwordHash?: string;
}

export interface EducationBackground {
  highSchool: string;
  graduationYear: number;
  gpa: number;
  satScore?: number;
  actScore?: number;
  toeflScore?: number;
  ieltsScore?: number;
  extracurriculars: string[];
}

// 学校相关类型
export interface University {
  id: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  ranking?: number;
  acceptanceRate?: number;
  tuitionFee?: number;
  websiteUrl?: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  degreeType: string;
  duration: number;
  tuitionFee?: number;
  minGpa?: number;
  minSat?: number;
  minAct?: number;
  minToefl?: number;
  minIelts?: number;
  requiredDocuments?: string[];
  optionalDocuments?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramRequirements {
  minGPA: number;
  minSAT?: number;
  minACT?: number;
  minTOEFL?: number;
  minIELTS?: number;
  requiredDocuments: string[];
  optionalDocuments: string[];
}

export interface ApplicationDeadline {
  id: string;
  type: 'early_decision' | 'early_action' | 'regular_decision' | 'rolling';
  deadline: string;
  description: string;
}

export interface AdmissionRequirements {
  minGPA: number;
  minSAT?: number;
  minACT?: number;
  minTOEFL?: number;
  minIELTS?: number;
  requiredDocuments: string[];
  optionalDocuments: string[];
}

// 申请相关类型
export interface Application {
  id: string;
  userId: string;
  universityId: string;
  programId: string;
  status:
    | 'not_started'
    | 'in_progress'
    | 'submitted'
    | 'under_review'
    | 'interview_scheduled'
    | 'decision_made'
    | 'completed';
  submissionDate?: string;
  decisionDate?: string;
  decision?: 'accepted' | 'rejected' | 'waitlisted' | 'deferred';
  materials: ApplicationMaterial[];
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  // 关联数据
  universityName?: string;
  programName?: string;
  degreeType?: string;
}

export type ApplicationStatus =
  | 'not_started'
  | 'in_progress'
  | 'materials_uploaded'
  | 'submitted'
  | 'under_review'
  | 'interview_scheduled'
  | 'decision_made'
  | 'completed';

export interface ApplicationMaterial {
  id: string;
  applicationId: string;
  materialType:
    | 'transcript'
    | 'recommendation_letter'
    | 'personal_statement'
    | 'resume'
    | 'test_score'
    | 'other';
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  notes?: string;
}

// 通知相关类型
export interface Notification {
  id: string;
  userId: string;
  type:
    | 'deadline_reminder'
    | 'status_update'
    | 'decision_notification'
    | 'system_alert';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// 提醒相关类型
export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'application' | 'test' | 'document' | 'other';
  createdAt: string;
  updatedAt: string;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 搜索和筛选类型
export interface SearchFilters {
  country?: string;
  state?: string;
  program?: string;
  minTuition?: number;
  maxTuition?: number;
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
  ranking?: number;
}

// 认证相关类型
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'student' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 仪表板统计类型
export interface DashboardStats {
  totalApplications: number;
  applicationsInProgress: number;
  applicationsSubmitted: number;
  decisionsReceived: number;
  upcomingDeadlines: number;
  recentNotifications: number;
}

// 文件上传类型
export interface FileUpload {
  file: File;
  type: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

// Mock data for demonstration
export const mockApplications: Application[] = [
  {
    id: '1',
    userId: 'user1',
    universityId: 'uni1',
    programId: 'prog1',
    status: 'submitted',
    submissionDate: '2025-01-15T00:00:00Z',
    decisionDate: undefined,
    decision: undefined,
    materials: [],
    notes: '申请材料已提交，等待审核',
    priority: 'high',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    universityName: '哈佛大学',
    programName: '计算机科学',
    degreeType: 'bachelor',
  },
  {
    id: '2',
    userId: 'user1',
    universityId: 'uni2',
    programId: 'prog2',
    status: 'in_progress',
    submissionDate: undefined,
    decisionDate: undefined,
    decision: undefined,
    materials: [],
    notes: '正在准备申请材料',
    priority: 'medium',
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z',
    universityName: '斯坦福大学',
    programName: '工程学',
    degreeType: 'bachelor',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'status_update',
    title: '申请状态更新',
    message: '您的哈佛大学申请已进入审核阶段',
    isRead: false,
    createdAt: '2025-01-20T10:30:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    type: 'deadline_reminder',
    title: '截止日期提醒',
    message: '斯坦福大学申请截止日期还有3天',
    isRead: true,
    createdAt: '2025-01-19T15:45:00Z',
  },
];

export const mockReminders: Reminder[] = [
  {
    id: '1',
    userId: 'user1',
    title: '准备推荐信',
    description: '联系教授获取推荐信',
    dueDate: '2025-01-25T00:00:00Z',
    isCompleted: false,
    priority: 'high',
    category: 'document',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    title: '托福考试',
    description: '参加托福考试',
    dueDate: '2025-02-01T00:00:00Z',
    isCompleted: false,
    priority: 'medium',
    category: 'test',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
];
