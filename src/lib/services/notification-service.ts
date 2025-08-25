import { sql } from '@/lib/db';
import { Notification } from '@/types';

export class NotificationService {
  // 根据用户ID获取通知列表
  static async findByUserId(userId: string): Promise<Notification[]> {
    try {
      const result = await sql`
        SELECT * FROM notifications 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;

      return result.map((row) => ({
        id: row.id,
        userId: row.user_id,
        type: row.type,
        title: row.title,
        message: row.message,
        isRead: row.is_read,
        actionUrl: row.action_url,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // 获取未读通知数量
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await sql`
        SELECT COUNT(*) as count 
        FROM notifications 
        WHERE user_id = ${userId} AND is_read = false
      `;

      return parseInt(result[0].count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // 标记通知为已读
  static async markAsRead(id: string): Promise<boolean> {
    try {
      await sql`
        UPDATE notifications 
        SET is_read = true 
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // 标记所有通知为已读
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await sql`
        UPDATE notifications 
        SET is_read = true 
        WHERE user_id = ${userId}
      `;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // 创建通知
  static async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
  }): Promise<Notification> {
    try {
      const result = await sql`
        INSERT INTO notifications (user_id, type, title, message, action_url)
        VALUES (${data.userId}, ${data.type}, ${data.title}, ${data.message}, ${data.actionUrl})
        RETURNING *
      `;

      const row = result[0];
      return {
        id: row.id,
        userId: row.user_id,
        type: row.type,
        title: row.title,
        message: row.message,
        isRead: row.is_read,
        actionUrl: row.action_url,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // 删除通知
  static async delete(id: string): Promise<boolean> {
    try {
      await sql`
        DELETE FROM notifications 
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // 删除用户的所有通知
  static async deleteAllByUserId(userId: string): Promise<boolean> {
    try {
      await sql`
        DELETE FROM notifications 
        WHERE user_id = ${userId}
      `;
      return true;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return false;
    }
  }
}
