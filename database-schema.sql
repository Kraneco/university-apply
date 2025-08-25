-- 数据库表结构
-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    phone VARCHAR(50),
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 大学表
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100),
    ranking INTEGER,
    acceptance_rate DECIMAL(5,2),
    tuition_fee DECIMAL(10,2),
    website_url TEXT,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 专业表
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    degree_type VARCHAR(50) NOT NULL, -- bachelor, master, phd
    duration INTEGER NOT NULL, -- 年数
    tuition_fee DECIMAL(10,2),
    min_gpa DECIMAL(3,2),
    min_sat INTEGER,
    min_act INTEGER,
    min_toefl INTEGER,
    min_ielts DECIMAL(3,1),
    required_documents TEXT[],
    optional_documents TEXT[],
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 申请截止日期表
CREATE TABLE IF NOT EXISTS application_deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    deadline_type VARCHAR(50) NOT NULL, -- early_decision, early_action, regular_decision, rolling
    deadline_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 申请表
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started',
    submission_date TIMESTAMP WITH TIME ZONE,
    decision_date TIMESTAMP WITH TIME ZONE,
    decision VARCHAR(50), -- accepted, rejected, waitlisted, deferred
    notes TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 申请材料表
CREATE TABLE IF NOT EXISTS application_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    material_type VARCHAR(50) NOT NULL, -- transcript, recommendation_letter, personal_statement, resume, test_score, other
    name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, uploaded, verified, rejected
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- deadline_reminder, status_update, decision_notification, system_alert
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 提醒表
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    category VARCHAR(50) NOT NULL, -- application, test, document, other
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户设置表
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'zh',
    theme VARCHAR(20) DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
CREATE INDEX IF NOT EXISTS idx_programs_university_id ON programs(university_id);

-- 插入初始数据
INSERT INTO users (id, email, password_hash, name, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', '$2b$12$Ii2xqL3QL8xhPYBAX6McM.LQC/atDb97N4BZgngAteMbnLyRsBxp.', '管理员', 'admin', '+86 138 0000 0000'),
('550e8400-e29b-41d4-a716-446655440002', 'student@example.com', '$2b$12$Ii2xqL3QL8xhPYBAX6McM.LQC/atDb97N4BZgngAteMbnLyRsBxp.', '张三', 'student', '+86 139 0000 0000')
ON CONFLICT (email) DO NOTHING;

-- 插入示例大学数据
INSERT INTO universities (id, name, country, state, city, ranking, acceptance_rate, tuition_fee, website_url, description) VALUES
('uni-001', '哈佛大学', '美国', '马萨诸塞州', '剑桥市', 1, 4.6, 54000, 'https://www.harvard.edu', '哈佛大学是一所位于美国马萨诸塞州剑桥市的私立研究型大学'),
('uni-002', '斯坦福大学', '美国', '加利福尼亚州', '斯坦福', 2, 4.3, 56000, 'https://www.stanford.edu', '斯坦福大学是一所位于美国加利福尼亚州斯坦福的私立研究型大学'),
('uni-003', '麻省理工学院', '美国', '马萨诸塞州', '剑桥市', 3, 6.7, 55000, 'https://www.mit.edu', '麻省理工学院是一所位于美国马萨诸塞州剑桥市的私立研究型大学'),
('uni-004', '牛津大学', '英国', '英格兰', '牛津', 4, 17.5, 45000, 'https://www.ox.ac.uk', '牛津大学是一所位于英国牛津的公立研究型大学'),
('uni-005', '剑桥大学', '英国', '英格兰', '剑桥', 5, 21.0, 44000, 'https://www.cam.ac.uk', '剑桥大学是一所位于英国剑桥的公立研究型大学')
ON CONFLICT DO NOTHING;

-- 插入示例专业数据
INSERT INTO programs (id, university_id, name, degree_type, duration, tuition_fee, min_gpa, min_sat, min_toefl, description) VALUES
('prog-001', 'uni-001', '计算机科学', 'bachelor', 4, 54000, 3.8, 1500, 100, '计算机科学专业培养学生掌握计算机科学的基础理论和实践技能'),
('prog-002', 'uni-001', '商业管理', 'bachelor', 4, 54000, 3.7, 1450, 100, '商业管理专业培养学生掌握现代商业管理的理论和实践'),
('prog-003', 'uni-002', '工程学', 'bachelor', 4, 56000, 3.8, 1500, 100, '工程学专业培养学生掌握工程设计和分析的能力'),
('prog-004', 'uni-003', '物理学', 'bachelor', 4, 55000, 3.9, 1550, 100, '物理学专业培养学生掌握物理学的基础理论和实验技能'),
('prog-005', 'uni-004', '经济学', 'bachelor', 3, 45000, 3.7, 1450, 100, '经济学专业培养学生掌握经济学的基本理论和分析方法')
ON CONFLICT DO NOTHING;

-- 插入示例申请截止日期
INSERT INTO application_deadlines (id, university_id, program_id, deadline_type, deadline_date, description) VALUES
('deadline-001', 'uni-001', 'prog-001', 'early_decision', '2025-11-01', '提前决定申请截止日期'),
('deadline-002', 'uni-001', 'prog-001', 'regular_decision', '2026-01-01', '常规申请截止日期'),
('deadline-003', 'uni-002', 'prog-003', 'early_action', '2025-11-15', '提前行动申请截止日期'),
('deadline-004', 'uni-002', 'prog-003', 'regular_decision', '2026-01-15', '常规申请截止日期')
ON CONFLICT DO NOTHING;

-- 插入示例申请数据
INSERT INTO applications (id, user_id, university_id, program_id, status, submission_date, notes, priority) VALUES
('app-001', '550e8400-e29b-41d4-a716-446655440002', 'uni-001', 'prog-001', 'submitted', '2025-01-15 10:00:00+00', '申请材料已提交，等待审核', 'high'),
('app-002', '550e8400-e29b-41d4-a716-446655440002', 'uni-002', 'prog-003', 'in_progress', NULL, '正在准备申请材料', 'medium')
ON CONFLICT DO NOTHING;

-- 插入示例通知数据
INSERT INTO notifications (id, user_id, type, title, message, is_read) VALUES
('notif-001', '550e8400-e29b-41d4-a716-446655440002', 'status_update', '申请状态更新', '您的哈佛大学申请已进入审核阶段', false),
('notif-002', '550e8400-e29b-41d4-a716-446655440002', 'deadline_reminder', '截止日期提醒', '斯坦福大学申请截止日期还有3天', true)
ON CONFLICT DO NOTHING;

-- 插入示例提醒数据
INSERT INTO reminders (id, user_id, title, description, due_date, is_completed, priority, category) VALUES
('reminder-001', '550e8400-e29b-41d4-a716-446655440002', '准备推荐信', '联系教授获取推荐信', '2025-01-25 00:00:00+00', false, 'high', 'document'),
('reminder-002', '550e8400-e29b-41d4-a716-446655440002', '托福考试', '参加托福考试', '2025-02-01 00:00:00+00', false, 'medium', 'test')
ON CONFLICT DO NOTHING;

-- 插入用户设置
INSERT INTO user_settings (id, user_id, language, theme, email_notifications, push_notifications) VALUES
('settings-001', '550e8400-e29b-41d4-a716-446655440001', 'zh', 'system', true, true),
('settings-002', '550e8400-e29b-41d4-a716-446655440002', 'zh', 'system', true, true)
ON CONFLICT DO NOTHING;
