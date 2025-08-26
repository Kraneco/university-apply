import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { getRequestLanguage } from '@/lib/api-response';
import {
  createApiResponse,
  createErrorResponse,
  createUnauthorizedResponse,
} from '@/lib/api-response';
import { verifyToken } from '@/lib/auth';

// GET /api/profile - 获取用户个人资料
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      const language = getRequestLanguage(request);
      return createUnauthorizedResponse('auth.unauthorized', language);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      const language = getRequestLanguage(request);
      return createUnauthorizedResponse('auth.unauthorized', language);
    }

    const result = await sql`
      SELECT id, name, email, phone, address, avatar, role, created_at, updated_at
      FROM users 
      WHERE id = ${decoded.userId}
    `;

    if (result.length === 0) {
      const language = getRequestLanguage(request);
      return createErrorResponse('auth.userNotFound', undefined, 404, language);
    }

    const user = result[0];
    const language = getRequestLanguage(request);

    return createApiResponse(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatarUrl: user.avatar,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      'api.profile.fetchSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.profile.fetchError',
      undefined,
      500,
      language
    );
  }
}

// PUT /api/profile - 更新用户个人资料
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      const language = getRequestLanguage(request);
      return createUnauthorizedResponse('auth.unauthorized', language);
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      const language = getRequestLanguage(request);
      return createUnauthorizedResponse('auth.unauthorized', language);
    }

    const body = await request.json();
    const { name, phone, address } = body;

    // 验证必填字段
    if (!name || name.trim() === '') {
      const language = getRequestLanguage(request);
      return createErrorResponse(
        'settings.profile.nameRequired',
        undefined,
        400,
        language
      );
    }

    // 更新用户信息
    const result = await sql`
      UPDATE users 
      SET 
        name = ${name.trim()},
        phone = ${phone || null},
        address = ${address || null},
        updated_at = NOW()
      WHERE id = ${decoded.userId}
      RETURNING id, name, email, phone, address, avatar, role, created_at, updated_at
    `;

    if (result.length === 0) {
      const language = getRequestLanguage(request);
      return createErrorResponse('auth.userNotFound', undefined, 404, language);
    }

    const updatedUser = result[0];
    const language = getRequestLanguage(request);

    return createApiResponse(
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatarUrl: updatedUser.avatar,
        role: updatedUser.role,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      },
      'api.profile.updateSuccess',
      200,
      language
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    const language = getRequestLanguage(request);
    return createErrorResponse(
      'api.profile.updateError',
      undefined,
      500,
      language
    );
  }
}
