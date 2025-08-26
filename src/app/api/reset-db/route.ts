import { sql } from '@/lib/db';

export async function POST() {
  try {
    console.log('开始重置数据库...');

    // 删除所有表（按依赖关系顺序）
    await sql`DROP TABLE IF EXISTS documents CASCADE`;
    await sql`DROP TABLE IF EXISTS applications CASCADE`;
    await sql`DROP TABLE IF EXISTS notifications CASCADE`;
    await sql`DROP TABLE IF EXISTS reminders CASCADE`;
    await sql`DROP TABLE IF EXISTS education CASCADE`;
    await sql`DROP TABLE IF EXISTS universities CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    console.log('数据库表删除完成');

    // 重新初始化数据库
    const { initializeDatabase } = await import('@/lib/init-db');
    await initializeDatabase();

    return new Response(
      JSON.stringify({
        success: true,
        message: '数据库重置完成',
        users: {
          admin: {
            email: 'admin@example.com',
            password: 'admin123',
          },
          student: {
            email: 'student@example.com',
            password: 'student123',
          },
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('数据库重置失败:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: '数据库重置失败',
        error: error instanceof Error ? error.message : '未知错误',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
