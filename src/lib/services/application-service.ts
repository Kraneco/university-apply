import { sql } from '@/lib/db';
import { Application } from '@/types';

export class ApplicationService {
  // 根据用户ID获取申请列表
  static async findByUserId(userId: string): Promise<Application[]> {
    try {
      const result = await sql`
        SELECT 
          a.*,
          u.name as university_name
        FROM applications a
        LEFT JOIN universities u ON a.university_id = u.id
        WHERE a.user_id = ${userId}
        ORDER BY a.created_at DESC
      `;

      return result.map((row) => ({
        id: row.id,
        userId: row.user_id,
        universityId: row.university_id,
        programId: row.program_id,
        status: row.status,
        submissionDate: row.submission_date,
        decisionDate: row.decision_date,
        decision: row.decision,
        materials: [], // 暂时返回空数组
        notes: row.notes,
        priority: row.priority,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        universityName: row.university_name,
        programName: undefined, // 暂时设为undefined
        degreeType: undefined, // 暂时设为undefined
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  // 根据ID获取申请详情
  static async findById(id: string): Promise<Application | null> {
    try {
      const result = await sql`
        SELECT 
          a.*,
          u.name as university_name
        FROM applications a
        LEFT JOIN universities u ON a.university_id = u.id
        WHERE a.id = ${id}
      `;

      if (result.length === 0) {
        return null;
      }

      const row = result[0];
      return {
        id: row.id,
        userId: row.user_id,
        universityId: row.university_id,
        programId: row.program_id,
        status: row.status,
        submissionDate: row.submission_date,
        decisionDate: row.decision_date,
        decision: row.decision,
        materials: [], // 暂时返回空数组
        notes: row.notes,
        priority: row.priority,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        universityName: row.university_name,
        programName: undefined, // 暂时设为undefined
        degreeType: undefined, // 暂时设为undefined
      };
    } catch (error) {
      console.error('Error fetching application:', error);
      return null;
    }
  }

  // 创建新申请
  static async create(data: {
    userId: string;
    universityId: string;
    programId?: string;
    notes?: string;
    priority: string;
  }): Promise<Application> {
    try {
      const result = await sql`
        INSERT INTO applications (user_id, university_id, program_id, notes, priority)
        VALUES (${data.userId}, ${data.universityId}, ${data.programId || null}, ${data.notes}, ${data.priority})
        RETURNING *
      `;

      const row = result[0];
      return {
        id: row.id,
        userId: row.user_id,
        universityId: row.university_id,
        programId: row.program_id,
        status: row.status,
        submissionDate: row.submission_date,
        decisionDate: row.decision_date,
        decision: row.decision,
        materials: [],
        notes: row.notes,
        priority: row.priority,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  // 更新申请状态
  static async updateStatus(id: string, status: string): Promise<boolean> {
    try {
      await sql`
        UPDATE applications 
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      return false;
    }
  }

  // 更新申请决定
  static async updateDecision(
    id: string,
    decision: string,
    decisionDate?: string
  ): Promise<boolean> {
    try {
      await sql`
        UPDATE applications 
        SET decision = ${decision}, decision_date = ${decisionDate || new Date().toISOString()}, updated_at = NOW()
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error updating application decision:', error);
      return false;
    }
  }

  // 更新申请信息
  static async update(
    id: string,
    data: {
      status?: string;
      decision?: string;
      notes?: string;
      priority?: string;
      submissionDate?: string;
      decisionDate?: string;
    }
  ): Promise<Application | null> {
    try {
      const result = await sql`
        UPDATE applications 
        SET 
          status = COALESCE(${data.status}, status),
          decision = COALESCE(${data.decision}, decision),
          notes = COALESCE(${data.notes}, notes),
          priority = COALESCE(${data.priority}, priority),
          submission_date = COALESCE(${data.submissionDate}, submission_date),
          decision_date = COALESCE(${data.decisionDate}, decision_date),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        return null;
      }

      const row = result[0];
      return {
        id: row.id,
        userId: row.user_id,
        universityId: row.university_id,
        programId: row.program_id,
        status: row.status,
        submissionDate: row.submission_date,
        decisionDate: row.decision_date,
        decision: row.decision,
        materials: [],
        notes: row.notes,
        priority: row.priority,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error updating application:', error);
      return null;
    }
  }

  // 删除申请
  static async delete(id: string): Promise<boolean> {
    try {
      await sql`
        DELETE FROM applications 
        WHERE id = ${id}
      `;
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      return false;
    }
  }

  // 获取申请统计
  static async getStats(userId: string): Promise<{
    total: number;
    inProgress: number;
    submitted: number;
    decisionsReceived: number;
  }> {
    try {
      const result = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
          COUNT(CASE WHEN decision IS NOT NULL THEN 1 END) as decisions_received
        FROM applications 
        WHERE user_id = ${userId}
      `;

      const row = result[0];
      return {
        total: parseInt(row.total),
        inProgress: parseInt(row.in_progress),
        submitted: parseInt(row.submitted),
        decisionsReceived: parseInt(row.decisions_received),
      };
    } catch (error) {
      console.error('Error fetching application stats:', error);
      return {
        total: 0,
        inProgress: 0,
        submitted: 0,
        decisionsReceived: 0,
      };
    }
  }
}
