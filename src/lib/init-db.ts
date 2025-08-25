import { sql } from './db';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    // 创建用户表
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'student',
        phone VARCHAR(50),
        avatar VARCHAR(500),
        address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // 创建教育信息表
    await sql`
      CREATE TABLE IF NOT EXISTS education (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        high_school VARCHAR(255),
        graduation_year INTEGER,
        gpa DECIMAL(3,2),
        sat_score INTEGER,
        toefl_score INTEGER,
        extracurriculars TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // 创建大学表
    await sql`
      CREATE TABLE IF NOT EXISTS universities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        state VARCHAR(100),
        city VARCHAR(100),
        website VARCHAR(500),
        description TEXT,
        ranking INTEGER,
        acceptance_rate DECIMAL(5,2),
        tuition_domestic DECIMAL(10,2),
        tuition_international DECIMAL(10,2),
        application_deadline DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // 创建申请表
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
        program_id UUID,
        status VARCHAR(50) NOT NULL DEFAULT 'not_started',
        priority VARCHAR(20) DEFAULT 'medium',
        application_fee DECIMAL(10,2),
        submission_date DATE,
        decision_date DATE,
        decision VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // 创建文档表
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500),
        file_size INTEGER,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'pending'
      )
    `;

    // 创建通知表
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // 创建提醒事项表
    await sql`
      CREATE TABLE IF NOT EXISTS reminders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(20) DEFAULT 'medium',
        category VARCHAR(50) DEFAULT 'other',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log('数据库表创建成功');

    // 插入示例用户数据
    await insertSampleUsers();

    // 插入一些示例大学数据
    await insertSampleUniversities();

    // 插入示例通知数据
    await insertSampleNotifications();

    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

async function insertSampleUsers() {
  // 创建admin用户
  const adminPassword = 'admin123'; // 默认密码
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await sql`
    INSERT INTO users (email, password_hash, name, role, phone, address, created_at, updated_at)
    VALUES ('admin@example.com', ${adminPasswordHash}, '管理员', 'admin', '+86 138 0000 0000', '北京市朝阳区', NOW(), NOW())
  `;

  // 创建学生用户
  const studentPassword = 'student123'; // 默认密码
  const studentPasswordHash = await bcrypt.hash(studentPassword, 12);

  await sql`
    INSERT INTO users (email, password_hash, name, role, phone, address, created_at, updated_at)
    VALUES ('student@example.com', ${studentPasswordHash}, '张三', 'student', '+86 139 0000 0000', '上海市浦东新区', NOW(), NOW())
  `;

  console.log('示例用户数据插入完成');
}

async function insertSampleUniversities() {
  const universities = [
    {
      name: '哈佛大学',
      country: '美国',
      state: '马萨诸塞州',
      city: '剑桥',
      website: 'https://www.harvard.edu',
      description: '世界顶尖的私立研究型大学',
      ranking: 1,
      acceptance_rate: 4.6,
      tuition_domestic: 54768,
      tuition_international: 54768,
      application_deadline: '2024-01-01',
    },
    {
      name: '斯坦福大学',
      country: '美国',
      state: '加利福尼亚州',
      city: '斯坦福',
      website: 'https://www.stanford.edu',
      description: '世界著名的私立研究型大学',
      ranking: 2,
      acceptance_rate: 4.3,
      tuition_domestic: 56169,
      tuition_international: 56169,
      application_deadline: '2024-01-02',
    },
    {
      name: '麻省理工学院',
      country: '美国',
      state: '马萨诸塞州',
      city: '剑桥',
      website: 'https://www.mit.edu',
      description: '世界顶尖的理工类大学',
      ranking: 3,
      acceptance_rate: 6.7,
      tuition_domestic: 55878,
      tuition_international: 55878,
      application_deadline: '2024-01-03',
    },
    // 日本大学
    {
      name: '东京大学',
      country: '日本',
      state: '东京都',
      city: '东京',
      website: 'https://www.u-tokyo.ac.jp',
      description: '日本最顶尖的国立大学，亚洲排名第一',
      ranking: 23,
      acceptance_rate: 35.2,
      tuition_domestic: 535800,
      tuition_international: 535800,
      application_deadline: '2024-01-15',
    },
    {
      name: '京都大学',
      country: '日本',
      state: '京都府',
      city: '京都',
      website: 'https://www.kyoto-u.ac.jp',
      description: '日本历史最悠久的大学之一，以研究实力著称',
      ranking: 33,
      acceptance_rate: 38.1,
      tuition_domestic: 535800,
      tuition_international: 535800,
      application_deadline: '2024-01-20',
    },
    {
      name: '大阪大学',
      country: '日本',
      state: '大阪府',
      city: '大阪',
      website: 'https://www.osaka-u.ac.jp',
      description: '日本顶尖的国立大学，在医学和工程领域表现突出',
      ranking: 71,
      acceptance_rate: 42.3,
      tuition_domestic: 535800,
      tuition_international: 535800,
      application_deadline: '2024-01-25',
    },
    // 英国大学
    {
      name: '牛津大学',
      country: '英国',
      state: '英格兰',
      city: '牛津',
      website: 'https://www.ox.ac.uk',
      description: '英语世界最古老的大学，世界顶尖学府',
      ranking: 4,
      acceptance_rate: 17.5,
      tuition_domestic: 9250,
      tuition_international: 39000,
      application_deadline: '2024-01-10',
    },
    {
      name: '剑桥大学',
      country: '英国',
      state: '英格兰',
      city: '剑桥',
      website: 'https://www.cam.ac.uk',
      description: '世界顶尖的研究型大学，与牛津并称为牛剑',
      ranking: 5,
      acceptance_rate: 21.0,
      tuition_domestic: 9250,
      tuition_international: 39000,
      application_deadline: '2024-01-12',
    },
    {
      name: '帝国理工学院',
      country: '英国',
      state: '英格兰',
      city: '伦敦',
      website: 'https://www.imperial.ac.uk',
      description: '世界顶尖的理工类大学，在科学、工程、医学领域领先',
      ranking: 6,
      acceptance_rate: 14.3,
      tuition_domestic: 9250,
      tuition_international: 39000,
      application_deadline: '2024-01-14',
    },
    // 加拿大大学
    {
      name: '多伦多大学',
      country: '加拿大',
      state: '安大略省',
      city: '多伦多',
      website: 'https://www.utoronto.ca',
      description: '加拿大最顶尖的大学，在研究和教学方面表现卓越',
      ranking: 18,
      acceptance_rate: 43.0,
      tuition_domestic: 6100,
      tuition_international: 45000,
      application_deadline: '2024-01-30',
    },
    {
      name: '不列颠哥伦比亚大学',
      country: '加拿大',
      state: '不列颠哥伦比亚省',
      city: '温哥华',
      website: 'https://www.ubc.ca',
      description: '加拿大顶尖的研究型大学，在可持续发展领域领先',
      ranking: 31,
      acceptance_rate: 52.4,
      tuition_domestic: 5500,
      tuition_international: 42000,
      application_deadline: '2024-02-05',
    },
    {
      name: '麦吉尔大学',
      country: '加拿大',
      state: '魁北克省',
      city: '蒙特利尔',
      website: 'https://www.mcgill.ca',
      description: '加拿大历史最悠久的大学之一，在医学和法学领域享有盛誉',
      ranking: 27,
      acceptance_rate: 46.2,
      tuition_domestic: 2900,
      tuition_international: 45000,
      application_deadline: '2024-02-10',
    },
  ];

  for (const uni of universities) {
    await sql`
      INSERT INTO universities (name, country, state, city, website, description, ranking, acceptance_rate, tuition_domestic, tuition_international, application_deadline)
      VALUES (${uni.name}, ${uni.country}, ${uni.state}, ${uni.city}, ${uni.website}, ${uni.description}, ${uni.ranking}, ${uni.acceptance_rate}, ${uni.tuition_domestic}, ${uni.tuition_international}, ${uni.application_deadline})
    `;
  }
}

async function insertSampleNotifications() {
  // 获取学生用户ID
  const studentResult = await sql`
    SELECT id FROM users WHERE email = 'student@example.com'
  `;

  if (studentResult.length === 0) {
    console.log('未找到学生用户，跳过通知数据插入');
    return;
  }

  const studentId = studentResult[0].id;

  const notifications = [
    {
      title: '欢迎使用大学申请跟踪系统',
      message: '恭喜您成功注册！现在您可以开始管理您的大学申请了。',
      type: 'welcome',
      is_read: false,
    },
    {
      title: '哈佛大学申请截止日期提醒',
      message: '哈佛大学的申请截止日期是2024年1月1日，请确保及时提交所有材料。',
      type: 'deadline_reminder',
      is_read: false,
    },
    {
      title: '斯坦福大学申请状态更新',
      message: '您的斯坦福大学申请已进入审核阶段，预计4-6周内会有结果。',
      type: 'status_update',
      is_read: true,
    },
    {
      title: '麻省理工学院录取通知',
      message: '恭喜！您已被麻省理工学院录取。请在30天内确认是否接受录取。',
      type: 'decision_notification',
      is_read: false,
    },
    {
      title: '系统维护通知',
      message: '系统将于今晚22:00-24:00进行维护，期间可能无法访问。',
      type: 'system_maintenance',
      is_read: true,
    },
    {
      title: '新功能上线',
      message: '我们新增了提醒事项功能，帮助您更好地管理申请截止日期。',
      type: 'feature_update',
      is_read: false,
    },
    {
      title: '托福成绩提交提醒',
      message: '请确保在申请截止日期前提交您的托福成绩单。',
      type: 'deadline_reminder',
      is_read: false,
    },
    {
      title: '推荐信状态更新',
      message: '您的推荐信已全部提交完成，感谢推荐人的支持。',
      type: 'status_update',
      is_read: true,
    },
  ];

  for (const notification of notifications) {
    await sql`
      INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
      VALUES (${studentId}, ${notification.title}, ${notification.message}, ${notification.type}, ${notification.is_read}, NOW())
    `;
  }

  console.log('示例通知数据插入完成');
}
