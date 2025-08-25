import bcrypt from 'bcryptjs';
import { sql } from './db';
import { User, UserWithPassword, RegisterData } from '@/types';

export class UserService {
  // 创建用户
  static async createUser(userData: RegisterData): Promise<User> {
    const { email, password, name, role = 'student', phone } = userData;

    // 检查邮箱是否已存在
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      throw new Error('api.auth.emailAlreadyExists');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 插入新用户
    const result = await sql`
      INSERT INTO users (email, password_hash, name, role, phone, created_at, updated_at)
      VALUES (${email}, ${hashedPassword}, ${name}, ${role}, ${phone}, NOW(), NOW())
      RETURNING id, email, name, role, phone, created_at, updated_at
    `;

    const user = result[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await sql`
      SELECT id, email, password_hash, name, role, phone, created_at, updated_at
      FROM users WHERE email = ${email}
    `;

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      passwordHash: user.password_hash, // 添加密码hash字段
    };
  }

  // 验证用户密码
  static async verifyPassword(user: UserWithPassword, password: string): Promise<boolean> {
    // 如果User对象中有passwordHash字段，直接使用
    if (user.passwordHash) {
      return bcrypt.compare(password, user.passwordHash);
    }

    // 否则重新查询数据库（向后兼容）
    const result = await sql`
      SELECT password_hash FROM users WHERE id = ${user.id}
    `;

    if (result.length === 0) {
      return false;
    }

    return bcrypt.compare(password, result[0].password_hash);
  }

  // 根据 ID 查找用户
  static async findById(id: string): Promise<User | null> {
    const result = await sql`
      SELECT id, email, name, role, phone, created_at, updated_at
      FROM users WHERE id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  // 更新用户信息
  static async updateUser(
    id: string,
    updates: Partial<User>
  ): Promise<User | null> {
    const { name, phone } = updates;

    const result = await sql`
      UPDATE users 
      SET name = COALESCE(${name}, name),
          phone = COALESCE(${phone}, phone),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, email, name, role, phone, created_at, updated_at
    `;

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
