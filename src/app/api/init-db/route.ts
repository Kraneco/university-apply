import { initializeDatabase } from '@/lib/init-db';

export async function POST() {
  try {
    console.log('开始初始化数据库...');
    await initializeDatabase();

    return new Response(
      JSON.stringify({
        success: true,
        message: '数据库初始化完成',
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
    console.error('数据库初始化失败:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: '数据库初始化失败',
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
