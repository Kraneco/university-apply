-- 大学申请跟踪系统数据库表结构
-- 适用于 PostgreSQL (Neon 数据库)

-- 创建用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
    avatar VARCHAR(500),
    phone VARCHAR(50),
    address TEXT,
    education JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建大学表
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    ranking INTEGER,
    acceptance_rate DECIMAL(5,2),
    tuition JSONB NOT NULL,
    programs JSONB NOT NULL,
    application_deadlines JSONB NOT NULL,
    requirements JSONB NOT NULL,
    description TEXT,
    website VARCHAR(500),
    logo VARCHAR(500),
    images JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建申请表
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    program_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN (
        'not_started', 'in_progress', 'materials_uploaded', 
        'submitted', 'under_review', 'interview_scheduled', 
        'decision_made', 'completed'
    )),
    submission_date TIMESTAMP WITH TIME ZONE,
    decision_date TIMESTAMP WITH TIME ZONE,
    decision VARCHAR(20) CHECK (decision IN ('accepted', 'rejected', 'waitlisted', 'deferred')),
    materials JSONB NOT NULL DEFAULT '[]',
    notes TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建通知表
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'deadline_reminder', 'status_update', 'decision_notification', 'system_alert'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建提醒表
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    category VARCHAR(20) NOT NULL CHECK (category IN ('application', 'test', 'document', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_ranking ON universities(ranking);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_university_id ON applications(university_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_reminders_is_completed ON reminders(is_completed);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要自动更新 updated_at 的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入初始数据

-- 插入管理员用户
INSERT INTO users (id, email, name, role, avatar, phone, address) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'admin@example.com',
    '管理员',
    'admin',
    '/avatars/admin.jpg',
    '+86 138 0000 0000',
    '北京市朝阳区'
);

-- 插入学生用户
INSERT INTO users (id, email, name, role, avatar, phone, address, education) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'student@example.com',
    '张三',
    'student',
    '/avatars/student.jpg',
    '+86 139 0000 0000',
    '上海市浦东新区',
    '{
        "highSchool": "上海中学",
        "graduationYear": 2024,
        "gpa": 3.8,
        "satScore": 1450,
        "toeflScore": 105,
        "extracurriculars": ["学生会主席", "数学竞赛获奖", "志愿者服务"]
    }'
);

-- 插入大学数据
INSERT INTO universities (id, name, country, state, city, ranking, acceptance_rate, tuition, programs, application_deadlines, requirements, description, website, logo, images) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '哈佛大学',
    '美国',
    'Massachusetts',
    'Cambridge',
    1,
    4.6,
    '{
        "domestic": 54768,
        "international": 54768,
        "currency": "USD"
    }',
    '[
        {
            "id": "1",
            "name": "计算机科学",
            "degree": "bachelor",
            "duration": 4,
            "tuition": 54768,
            "requirements": {
                "minGPA": 3.8,
                "minSAT": 1500,
                "minTOEFL": 100,
                "requiredDocuments": ["成绩单", "推荐信", "个人陈述", "SAT成绩"],
                "optionalDocuments": ["AP成绩", "作品集"]
            }
        }
    ]',
    '[
        {
            "id": "1",
            "type": "early_decision",
            "deadline": "2024-11-01",
            "description": "早申请截止日期"
        },
        {
            "id": "2",
            "type": "regular_decision",
            "deadline": "2025-01-01",
            "description": "常规申请截止日期"
        }
    ]',
    '{
        "minGPA": 3.8,
        "minSAT": 1500,
        "minTOEFL": 100,
        "requiredDocuments": ["成绩单", "推荐信", "个人陈述", "SAT成绩"],
        "optionalDocuments": ["AP成绩", "作品集"]
    }',
    '哈佛大学是一所位于美国马萨诸塞州剑桥市的私立研究型大学，为著名的常春藤盟校成员。',
    'https://www.harvard.edu',
    '/universities/harvard.png',
    '["/universities/harvard1.jpg", "/universities/harvard2.jpg"]'
);

INSERT INTO universities (id, name, country, state, city, ranking, acceptance_rate, tuition, programs, application_deadlines, requirements, description, website, logo, images) VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    '斯坦福大学',
    '美国',
    'California',
    'Stanford',
    2,
    4.3,
    '{
        "domestic": 56169,
        "international": 56169,
        "currency": "USD"
    }',
    '[
        {
            "id": "2",
            "name": "工程学",
            "degree": "bachelor",
            "duration": 4,
            "tuition": 56169,
            "requirements": {
                "minGPA": 3.9,
                "minSAT": 1480,
                "minTOEFL": 100,
                "requiredDocuments": ["成绩单", "推荐信", "个人陈述", "SAT成绩"],
                "optionalDocuments": ["AP成绩", "作品集"]
            }
        }
    ]',
    '[
        {
            "id": "3",
            "type": "early_action",
            "deadline": "2024-11-01",
            "description": "早行动申请截止日期"
        },
        {
            "id": "4",
            "type": "regular_decision",
            "deadline": "2025-01-02",
            "description": "常规申请截止日期"
        }
    ]',
    '{
        "minGPA": 3.9,
        "minSAT": 1480,
        "minTOEFL": 100,
        "requiredDocuments": ["成绩单", "推荐信", "个人陈述", "SAT成绩"],
        "optionalDocuments": ["AP成绩", "作品集"]
    }',
    '斯坦福大学是一所位于美国加利福尼亚州斯坦福的私立研究型大学，以其在科技和创新方面的卓越表现而闻名。',
    'https://www.stanford.edu',
    '/universities/stanford.png',
    '["/universities/stanford1.jpg", "/universities/stanford2.jpg"]'
);

-- 插入申请数据
INSERT INTO applications (id, user_id, university_id, program_id, status, materials, notes, priority) VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '1',
    'in_progress',
    '[
        {
            "id": "1",
            "type": "transcript",
            "name": "高中成绩单",
            "fileName": "transcript.pdf",
            "fileUrl": "/materials/transcript.pdf",
            "fileSize": 1024000,
            "status": "uploaded",
            "uploadedAt": "2024-01-15T00:00:00Z",
            "notes": "已上传，等待审核"
        },
        {
            "id": "2",
            "type": "personal_statement",
            "name": "个人陈述",
            "fileName": "personal_statement.pdf",
            "fileUrl": "/materials/personal_statement.pdf",
            "fileSize": 512000,
            "status": "pending",
            "uploadedAt": "2024-01-16T00:00:00Z",
            "notes": "草稿版本，需要修改"
        }
    ]',
    '哈佛大学计算机科学专业申请，需要准备面试',
    'high'
);

-- 插入通知数据
INSERT INTO notifications (id, user_id, type, title, message, is_read, action_url) VALUES (
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440002',
    'deadline_reminder',
    '申请截止日期提醒',
    '哈佛大学早申请截止日期还有15天，请尽快完成申请材料',
    FALSE,
    '/applications/550e8400-e29b-41d4-a716-446655440005'
);

INSERT INTO notifications (id, user_id, type, title, message, is_read, action_url) VALUES (
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440002',
    'status_update',
    '材料状态更新',
    '您的成绩单已通过审核，可以继续下一步',
    TRUE,
    '/applications/550e8400-e29b-41d4-a716-446655440005'
);

-- 插入提醒数据
INSERT INTO reminders (id, user_id, title, description, due_date, is_completed, priority, category) VALUES (
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440002',
    '准备推荐信',
    '联系老师准备哈佛大学申请推荐信',
    '2024-10-25T00:00:00Z',
    FALSE,
    'high',
    'application'
);

INSERT INTO reminders (id, user_id, title, description, due_date, is_completed, priority, category) VALUES (
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440002',
    'SAT考试',
    '参加SAT考试',
    '2024-11-02T00:00:00Z',
    FALSE,
    'medium',
    'test'
);

-- 创建视图用于统计
CREATE VIEW application_stats AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    COUNT(a.id) as total_applications,
    COUNT(CASE WHEN a.status = 'submitted' THEN 1 END) as submitted_applications,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_applications,
    COUNT(CASE WHEN a.decision = 'accepted' THEN 1 END) as accepted_applications
FROM users u
LEFT JOIN applications a ON u.id = a.user_id
WHERE u.role = 'student'
GROUP BY u.id, u.name;

-- 创建视图用于大学统计
CREATE VIEW university_stats AS
SELECT 
    uni.id,
    uni.name,
    uni.country,
    COUNT(a.id) as total_applications,
    COUNT(CASE WHEN a.status = 'submitted' THEN 1 END) as submitted_count,
    COUNT(CASE WHEN a.decision = 'accepted' THEN 1 END) as accepted_count,
    CASE 
        WHEN COUNT(a.id) > 0 THEN 
            ROUND(COUNT(CASE WHEN a.decision = 'accepted' THEN 1 END)::DECIMAL / COUNT(a.id) * 100, 2)
        ELSE 0 
    END as acceptance_rate
FROM universities uni
LEFT JOIN applications a ON uni.id = a.university_id
GROUP BY uni.id, uni.name, uni.country;
