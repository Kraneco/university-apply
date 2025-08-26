import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 从请求中获取当前用户
export async function getCurrentUser(
  request: NextRequest
): Promise<User | null> {
  try {
    // 从Cookie中获取token
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // 这里应该从数据库获取用户信息
    // 为了简化，我们返回一个模拟的用户对象
    // 在实际应用中，你需要从数据库查询用户信息
    return {
      id: decoded.userId,
      email: decoded.email || 'user@example.com',
      name: '用户',
      role: (decoded.role as 'student' | 'admin') || 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// 生成JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// 验证JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// 检查用户权限
export function checkPermission(
  user: User | null,
  requiredRole: 'student' | 'admin'
): boolean {
  if (!user) {
    return false;
  }

  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }

  return true; // 学生可以访问学生权限的内容
}

// 检查资源所有权
export function checkOwnership(
  user: User | null,
  resourceUserId: string
): boolean {
  if (!user) {
    return false;
  }

  // 管理员可以访问所有资源
  if (user.role === 'admin') {
    return true;
  }

  // 普通用户只能访问自己的资源
  return user.id === resourceUserId;
}
