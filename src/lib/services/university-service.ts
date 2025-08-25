import { sql } from '@/lib/db';
import { University, Program } from '@/types';

export class UniversityService {
  // 获取所有大学
  static async findAll(): Promise<University[]> {
    try {
      const result = await sql`
        SELECT * FROM universities 
        ORDER BY ranking ASC, name ASC
      `;

      return result.map((row) => ({
        id: row.id,
        name: row.name,
        country: row.country,
        state: row.state,
        city: row.city,
        ranking: row.ranking,
        acceptanceRate: row.acceptance_rate,
        tuitionFee: row.tuition_domestic,
        websiteUrl: row.website,
        description: row.description,
        logoUrl: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
  }

  // 根据国家获取大学
  static async findByCountry(country: string): Promise<University[]> {
    try {
      const result = await sql`
        SELECT * FROM universities 
        WHERE country = ${country}
        ORDER BY ranking ASC, name ASC
      `;

      return result.map((row) => ({
        id: row.id,
        name: row.name,
        country: row.country,
        state: row.state,
        city: row.city,
        ranking: row.ranking,
        acceptanceRate: row.acceptance_rate,
        tuitionFee: row.tuition_domestic,
        websiteUrl: row.website,
        description: row.description,
        logoUrl: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching universities by country:', error);
      return [];
    }
  }

  // 根据ID获取大学详情
  static async findById(id: string): Promise<University | null> {
    try {
      const result = await sql`
        SELECT * FROM universities 
        WHERE id = ${id}
      `;

      if (result.length === 0) {
        return null;
      }

      const row = result[0];
      return {
        id: row.id,
        name: row.name,
        country: row.country,
        state: row.state,
        city: row.city,
        ranking: row.ranking,
        acceptanceRate: row.acceptance_rate,
        tuitionFee: row.tuition_domestic,
        websiteUrl: row.website,
        description: row.description,
        logoUrl: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error fetching university:', error);
      return null;
    }
  }

  // 搜索大学
  static async search(query: string): Promise<University[]> {
    try {
      const result = await sql`
        SELECT * FROM universities 
        WHERE name ILIKE ${`%${query}%`} 
           OR country ILIKE ${`%${query}%`}
           OR city ILIKE ${`%${query}%`}
        ORDER BY ranking ASC, name ASC
      `;

      return result.map((row) => ({
        id: row.id,
        name: row.name,
        country: row.country,
        state: row.state,
        city: row.city,
        ranking: row.ranking,
        acceptanceRate: row.acceptance_rate,
        tuitionFee: row.tuition_domestic,
        websiteUrl: row.website,
        description: row.description,
        logoUrl: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Error searching universities:', error);
      return [];
    }
  }

  // 获取大学的专业列表
  static async getPrograms(universityId: string): Promise<Program[]> {
    try {
      const result = await sql`
        SELECT * FROM programs 
        WHERE university_id = ${universityId}
        ORDER BY name ASC
      `;

      return result.map((row) => ({
        id: row.id,
        universityId: row.university_id,
        name: row.name,
        degreeType: row.degree_type,
        duration: row.duration,
        tuitionFee: row.tuition_fee,
        minGpa: row.min_gpa,
        minSat: row.min_sat,
        minAct: row.min_act,
        minToefl: row.min_toefl,
        minIelts: row.min_ielts,
        requiredDocuments: row.required_documents,
        optionalDocuments: row.optional_documents,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
  }

  // 获取所有国家列表
  static async getCountries(): Promise<string[]> {
    try {
      const result = await sql`
        SELECT DISTINCT country FROM universities 
        WHERE country IS NOT NULL 
        ORDER BY country ASC
      `;

      return result.map((row) => row.country);
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  }
}
