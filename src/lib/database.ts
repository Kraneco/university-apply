// 数据库连接配置
// 这里使用模拟数据，实际项目中会连接到Neon数据库

import { User, University, Application, Notification, Reminder } from '@/types';

// 模拟数据库数据
export const mockData = {
  users: [
    {
      id: '1',
      email: 'admin@example.com',
      name: '管理员',
      role: 'admin' as const,
      avatar: '/avatars/admin.jpg',
      phone: '+86 138 0000 0000',
      address: '北京市朝阳区',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'student@example.com',
      name: '张三',
      role: 'student' as const,
      avatar: '/avatars/student.jpg',
      phone: '+86 139 0000 0000',
      address: '上海市浦东新区',
      education: {
        highSchool: '上海中学',
        graduationYear: 2024,
        gpa: 3.8,
        satScore: 1450,
        toeflScore: 105,
        extracurriculars: ['学生会主席', '数学竞赛获奖', '志愿者服务'],
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ] as User[],

  universities: [
    {
      id: '1',
      name: '哈佛大学',
      country: '美国',
      state: 'Massachusetts',
      city: 'Cambridge',
      ranking: 1,
      acceptanceRate: 4.6,
      tuition: {
        domestic: 54768,
        international: 54768,
        currency: 'USD',
      },
      programs: [
        {
          id: '1',
          name: '计算机科学',
          degree: 'bachelor' as const,
          duration: 4,
          tuition: 54768,
          requirements: {
            minGPA: 3.8,
            minSAT: 1500,
            minTOEFL: 100,
            requiredDocuments: ['成绩单', '推荐信', '个人陈述', 'SAT成绩'],
            optionalDocuments: ['AP成绩', '作品集'],
          },
        },
      ],
      applicationDeadlines: [
        {
          id: '1',
          type: 'early_decision' as const,
          deadline: '2024-11-01',
          description: '早申请截止日期',
        },
        {
          id: '2',
          type: 'regular_decision' as const,
          deadline: '2025-01-01',
          description: '常规申请截止日期',
        },
      ],
      requirements: {
        minGPA: 3.8,
        minSAT: 1500,
        minTOEFL: 100,
        requiredDocuments: ['成绩单', '推荐信', '个人陈述', 'SAT成绩'],
        optionalDocuments: ['AP成绩', '作品集'],
      },
      description:
        '哈佛大学是一所位于美国马萨诸塞州剑桥市的私立研究型大学，为著名的常春藤盟校成员。',
      website: 'https://www.harvard.edu',
      logo: '/universities/harvard.png',
      images: ['/universities/harvard1.jpg', '/universities/harvard2.jpg'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: '斯坦福大学',
      country: '美国',
      state: 'California',
      city: 'Stanford',
      ranking: 2,
      acceptanceRate: 4.3,
      tuition: {
        domestic: 56169,
        international: 56169,
        currency: 'USD',
      },
      programs: [
        {
          id: '2',
          name: '工程学',
          degree: 'bachelor' as const,
          duration: 4,
          tuition: 56169,
          requirements: {
            minGPA: 3.9,
            minSAT: 1480,
            minTOEFL: 100,
            requiredDocuments: ['成绩单', '推荐信', '个人陈述', 'SAT成绩'],
            optionalDocuments: ['AP成绩', '作品集'],
          },
        },
      ],
      applicationDeadlines: [
        {
          id: '3',
          type: 'early_action' as const,
          deadline: '2024-11-01',
          description: '早行动申请截止日期',
        },
        {
          id: '4',
          type: 'regular_decision' as const,
          deadline: '2025-01-02',
          description: '常规申请截止日期',
        },
      ],
      requirements: {
        minGPA: 3.9,
        minSAT: 1480,
        minTOEFL: 100,
        requiredDocuments: ['成绩单', '推荐信', '个人陈述', 'SAT成绩'],
        optionalDocuments: ['AP成绩', '作品集'],
      },
      description:
        '斯坦福大学是一所位于美国加利福尼亚州斯坦福的私立研究型大学，以其在科技和创新方面的卓越表现而闻名。',
      website: 'https://www.stanford.edu',
      logo: '/universities/stanford.png',
      images: ['/universities/stanford1.jpg', '/universities/stanford2.jpg'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ] as University[],

  applications: [
    {
      id: '1',
      userId: '2',
      universityId: '1',
      programId: '1',
      status: 'in_progress' as const,
      materials: [
        {
          id: '1',
          type: 'transcript' as const,
          name: '高中成绩单',
          fileName: 'transcript.pdf',
          fileUrl: '/materials/transcript.pdf',
          fileSize: 1024000,
          status: 'uploaded' as const,
          uploadedAt: '2024-01-15T00:00:00Z',
          notes: '已上传，等待审核',
        },
        {
          id: '2',
          type: 'personal_statement' as const,
          name: '个人陈述',
          fileName: 'personal_statement.pdf',
          fileUrl: '/materials/personal_statement.pdf',
          fileSize: 512000,
          status: 'pending' as const,
          uploadedAt: '2024-01-16T00:00:00Z',
          notes: '草稿版本，需要修改',
        },
      ],
      notes: '哈佛大学计算机科学专业申请，需要准备面试',
      priority: 'high' as const,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-16T00:00:00Z',
    },
  ] as Application[],

  notifications: [
    {
      id: '1',
      userId: '2',
      type: 'deadline_reminder' as const,
      title: '申请截止日期提醒',
      message: '哈佛大学早申请截止日期还有15天，请尽快完成申请材料',
      isRead: false,
      createdAt: '2024-10-17T00:00:00Z',
      actionUrl: '/applications/1',
    },
    {
      id: '2',
      userId: '2',
      type: 'status_update' as const,
      title: '材料状态更新',
      message: '您的成绩单已通过审核，可以继续下一步',
      isRead: true,
      createdAt: '2024-01-15T00:00:00Z',
      actionUrl: '/applications/1',
    },
  ] as Notification[],

  reminders: [
    {
      id: '1',
      userId: '2',
      title: '准备推荐信',
      description: '联系老师准备哈佛大学申请推荐信',
      dueDate: '2024-10-25T00:00:00Z',
      isCompleted: false,
      priority: 'high' as const,
      category: 'application' as const,
      createdAt: '2024-10-15T00:00:00Z',
      updatedAt: '2024-10-15T00:00:00Z',
    },
    {
      id: '2',
      userId: '2',
      title: 'SAT考试',
      description: '参加SAT考试',
      dueDate: '2024-11-02T00:00:00Z',
      isCompleted: false,
      priority: 'medium' as const,
      category: 'test' as const,
      createdAt: '2024-10-10T00:00:00Z',
      updatedAt: '2024-10-10T00:00:00Z',
    },
  ] as Reminder[],
};

// 数据库操作函数
export class Database {
  // 用户相关操作
  static async getUserById(id: string): Promise<User | null> {
    await this.delay(100);
    return mockData.users.find((user) => user.id === id) || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    await this.delay(100);
    return mockData.users.find((user) => user.email === email) || null;
  }

  static async createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    await this.delay(200);
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockData.users.push(newUser);
    return newUser;
  }

  static async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<User | null> {
    await this.delay(200);
    const userIndex = mockData.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    mockData.users[userIndex] = {
      ...mockData.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    return mockData.users[userIndex];
  }

  // 大学相关操作
  static async getUniversities(filters?: {
    country?: string;
    state?: string;
    minTuition?: number;
    maxTuition?: number;
  }): Promise<University[]> {
    await this.delay(300);
    let universities = [...mockData.universities];

    if (filters) {
      if (filters.country) {
        universities = universities.filter(
          (u) => u.country === filters.country
        );
      }
      if (filters.state) {
        universities = universities.filter((u) => u.state === filters.state);
      }
      if (filters.minTuition !== undefined) {
        universities = universities.filter(
          (u) => u.tuition.international >= filters.minTuition!
        );
      }
      if (filters.maxTuition !== undefined) {
        universities = universities.filter(
          (u) => u.tuition.international <= filters.maxTuition!
        );
      }
    }

    return universities;
  }

  static async getUniversityById(id: string): Promise<University | null> {
    await this.delay(100);
    return mockData.universities.find((uni) => uni.id === id) || null;
  }

  // 申请相关操作
  static async getApplicationsByUserId(userId: string): Promise<Application[]> {
    await this.delay(200);
    return mockData.applications.filter((app) => app.userId === userId);
  }

  static async getApplicationById(id: string): Promise<Application | null> {
    await this.delay(100);
    return mockData.applications.find((app) => app.id === id) || null;
  }

  static async createApplication(
    applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Application> {
    await this.delay(300);
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockData.applications.push(newApplication);
    return newApplication;
  }

  static async updateApplication(
    id: string,
    applicationData: Partial<Application>
  ): Promise<Application | null> {
    await this.delay(200);
    const appIndex = mockData.applications.findIndex((app) => app.id === id);
    if (appIndex === -1) return null;

    mockData.applications[appIndex] = {
      ...mockData.applications[appIndex],
      ...applicationData,
      updatedAt: new Date().toISOString(),
    };
    return mockData.applications[appIndex];
  }

  static async deleteApplication(id: string): Promise<boolean> {
    await this.delay(200);
    const appIndex = mockData.applications.findIndex((app) => app.id === id);
    if (appIndex === -1) return false;

    mockData.applications.splice(appIndex, 1);
    return true;
  }

  // 通知相关操作
  static async getNotificationsByUserId(
    userId: string
  ): Promise<Notification[]> {
    await this.delay(150);
    return mockData.notifications.filter((notif) => notif.userId === userId);
  }

  static async markNotificationAsRead(id: string): Promise<boolean> {
    await this.delay(100);
    const notifIndex = mockData.notifications.findIndex(
      (notif) => notif.id === id
    );
    if (notifIndex === -1) return false;

    mockData.notifications[notifIndex].isRead = true;
    return true;
  }

  // 提醒相关操作
  static async getRemindersByUserId(userId: string): Promise<Reminder[]> {
    await this.delay(150);
    return mockData.reminders.filter((reminder) => reminder.userId === userId);
  }

  static async createReminder(
    reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Reminder> {
    await this.delay(200);
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockData.reminders.push(newReminder);
    return newReminder;
  }

  static async updateReminder(
    id: string,
    reminderData: Partial<Reminder>
  ): Promise<Reminder | null> {
    await this.delay(200);
    const reminderIndex = mockData.reminders.findIndex(
      (reminder) => reminder.id === id
    );
    if (reminderIndex === -1) return null;

    mockData.reminders[reminderIndex] = {
      ...mockData.reminders[reminderIndex],
      ...reminderData,
      updatedAt: new Date().toISOString(),
    };
    return mockData.reminders[reminderIndex];
  }

  static async deleteReminder(id: string): Promise<boolean> {
    await this.delay(200);
    const reminderIndex = mockData.reminders.findIndex(
      (reminder) => reminder.id === id
    );
    if (reminderIndex === -1) return false;

    mockData.reminders.splice(reminderIndex, 1);
    return true;
  }

  // 模拟网络延迟
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
