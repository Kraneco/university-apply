// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  education?: EducationBackground;
  createdAt: string;
  updatedAt: string;
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
  city: string;
  ranking?: number;
  acceptanceRate?: number;
  tuition: {
    domestic: number;
    international: number;
    currency: string;
  };
  programs: Program[];
  applicationDeadlines: ApplicationDeadline[];
  requirements: AdmissionRequirements;
  description: string;
  website: string;
  logo?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  degree: 'bachelor' | 'master' | 'phd';
  duration: number; // 年数
  tuition: number;
  requirements: ProgramRequirements;
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
  status: ApplicationStatus;
  submissionDate?: string;
  decisionDate?: string;
  decision?: 'accepted' | 'rejected' | 'waitlisted' | 'deferred';
  materials: ApplicationMaterial[];
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
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
  type:
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
  createdAt: string;
  actionUrl?: string;
}

// 提醒相关类型
export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'application' | 'test' | 'document' | 'other';
  createdAt: string;
  updatedAt: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
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
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'student';
  phone?: string;
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
