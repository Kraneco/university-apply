import { sql } from '@/lib/db';
import { Reminder } from '@/types';

export class ReminderService {
  // 根据用户ID获取提醒列表
  static async findByUserId(userId: string): Promise<Reminder[]> {
    try {
      const result = await sql`
        SELECT * FROM reminders 
        WHERE user_id = ${userId}
        ORDER BY 
          is_completed ASC,  -- 未完成的排在前面
          CASE 
            WHEN due_date < NOW() THEN 1  -- 过期的排在前面
            WHEN due_date::date = NOW()::date THEN 2  -- 今天的排在前面
            WHEN due_date::date = (NOW() + INTERVAL '1 day')::date THEN 3  -- 明天的排在前面
            WHEN due_date <= NOW() + INTERVAL '7 days' THEN 4  -- 本周的排在前面
            ELSE 5  -- 更远的排在后面
          END ASC,
          CASE priority
            WHEN 'high' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 3
            ELSE 4
          END ASC,
          due_date ASC  -- 最后按到期日期排序
      `;

      return result.map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description,
        dueDate: row.due_date,
        isCompleted: row.is_completed,
        priority: row.priority,
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  }

  // 获取即将到期的提醒
  static async getUpcoming(
    userId: string,
    days: number = 7
  ): Promise<Reminder[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const result = await sql`
        SELECT * FROM reminders 
        WHERE user_id = ${userId} 
          AND due_date <= ${futureDate.toISOString()}
          AND is_completed = false
        ORDER BY due_date ASC
      `;

      return result.map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description,
        dueDate: row.due_date,
        isCompleted: row.is_completed,
        priority: row.priority,
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      return [];
    }
  }

  // 根据ID获取提醒详情
  static async findById(id: string): Promise<Reminder | null> {
    try {
      const result = await sql`
        SELECT * FROM reminders 
        WHERE id = ${id}
      `;

      if (result.length === 0) {
        return null;
      }

      const row = result[0];
      return {
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description,
        dueDate: row.due_date,
        isCompleted: row.is_completed,
        priority: row.priority,
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error fetching reminder:', error);
      return null;
    }
  }

  // 创建新提醒
  static async create(data: {
    userId: string;
    title: string;
    description?: string;
    dueDate: string;
    priority: string;
    category: string;
  }): Promise<Reminder> {
    try {
      const result = await sql`
        INSERT INTO reminders (user_id, title, description, due_date, priority, category)
        VALUES (${data.userId}, ${data.title}, ${data.description}, ${data.dueDate}, ${data.priority}, ${data.category})
        RETURNING *
      `;

      const row = result[0];
      return {
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description,
        dueDate: row.due_date,
        isCompleted: row.is_completed,
        priority: row.priority,
        category: row.category,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  // 更新提醒
  static async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: string;
      priority?: string;
      category?: string;
      isCompleted?: boolean;
    }
  ): Promise<Reminder | null> {
    try {
      console.log('🔧 开始更新提醒:', { id, data });

      // 检查是否有需要更新的字段
      const hasUpdates = Object.values(data).some(
        (value) => value !== undefined
      );
      if (!hasUpdates) {
        console.log('🔧 没有需要更新的字段，直接返回当前提醒');
        return await this.findById(id);
      }

      // 使用 sql 模板字符串来避免 SQL 注入
      let updateQuery = sql`UPDATE reminders SET `;
      const updateParts = [];

      if (data.title !== undefined) {
        updateParts.push(sql`title = ${data.title}`);
      }
      if (data.description !== undefined) {
        updateParts.push(sql`description = ${data.description}`);
      }
      if (data.dueDate !== undefined) {
        updateParts.push(sql`due_date = ${data.dueDate}`);
      }
      if (data.priority !== undefined) {
        updateParts.push(sql`priority = ${data.priority}`);
      }
      if (data.category !== undefined) {
        updateParts.push(sql`category = ${data.category}`);
      }
      if (data.isCompleted !== undefined) {
        updateParts.push(sql`is_completed = ${data.isCompleted}`);
      }

      // 构建完整的查询
      for (let i = 0; i < updateParts.length; i++) {
        if (i > 0) updateQuery = sql`${updateQuery}, `;
        updateQuery = sql`${updateQuery}${updateParts[i]}`;
      }

      updateQuery = sql`${updateQuery}, updated_at = NOW() WHERE id = ${id}`;

      console.log('🔧 执行更新查询...');

      await updateQuery;

      console.log('🔧 更新完成，获取更新后的提醒');
      // 返回更新后的提醒
      const updatedReminder = await this.findById(id);
      console.log('🔧 更新后的提醒:', updatedReminder);
      return updatedReminder;
    } catch (error) {
      console.error('❌ Error updating reminder:', error);
      return null;
    }
  }

  // 标记提醒为完成
  static async markAsCompleted(id: string): Promise<boolean> {
    try {
      await sql`
        UPDATE reminders 
        SET is_completed = true, updated_at = NOW()
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error marking reminder as completed:', error);
      return false;
    }
  }

  // 删除提醒
  static async delete(id: string): Promise<boolean> {
    try {
      await sql`
        DELETE FROM reminders 
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  }

  // 获取提醒统计
  static async getStats(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  }> {
    try {
      const result = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN is_completed = true THEN 1 END) as completed,
          COUNT(CASE WHEN is_completed = false AND due_date > NOW() THEN 1 END) as pending,
          COUNT(CASE WHEN is_completed = false AND due_date <= NOW() THEN 1 END) as overdue
        FROM reminders 
        WHERE user_id = ${userId}
      `;

      const row = result[0];
      return {
        total: parseInt(row.total),
        completed: parseInt(row.completed),
        pending: parseInt(row.pending),
        overdue: parseInt(row.overdue),
      };
    } catch (error) {
      console.error('Error fetching reminder stats:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
      };
    }
  }
}
