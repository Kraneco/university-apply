import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    materials_uploaded: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-green-100 text-green-800',
    under_review: 'bg-purple-100 text-purple-800',
    interview_scheduled: 'bg-indigo-100 text-indigo-800',
    decision_made: 'bg-orange-100 text-orange-800',
    completed: 'bg-gray-100 text-gray-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    waitlisted: 'bg-yellow-100 text-yellow-800',
    deferred: 'bg-blue-100 text-blue-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };
  return priorityColors[priority] || 'bg-gray-100 text-gray-800';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密码至少需要8个字符');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码需要包含至少一个大写字母');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码需要包含至少一个小写字母');
  }

  if (!/\d/.test(password)) {
    errors.push('密码需要包含至少一个数字');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function calculateDaysUntil(date: string | Date): number {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isOverdue(date: string | Date): boolean {
  return calculateDaysUntil(date) < 0;
}

export function getApplicationProgress(status: string): number {
  const progressMap: Record<string, number> = {
    not_started: 0,
    in_progress: 25,
    materials_uploaded: 50,
    submitted: 75,
    under_review: 85,
    interview_scheduled: 90,
    decision_made: 95,
    completed: 100,
  };
  return progressMap[status] || 0;
}
