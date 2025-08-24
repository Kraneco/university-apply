# 数据库操作指南

本文档提供了大学申请跟踪系统的数据库操作指南，包括表结构、常用查询和操作示例。

## 📊 数据库表结构

### 1. 用户表 (users)

```sql
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
```

### 2. 大学表 (universities)

```sql
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
```

### 3. 申请表 (applications)

```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    program_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    submission_date TIMESTAMP WITH TIME ZONE,
    decision_date TIMESTAMP WITH TIME ZONE,
    decision VARCHAR(20),
    materials JSONB NOT NULL DEFAULT '[]',
    notes TEXT,
    priority VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 通知表 (notifications)

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. 提醒表 (reminders)

```sql
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔍 常用查询

### 用户相关查询

#### 1. 获取所有学生用户

```sql
SELECT * FROM users WHERE role = 'student';
```

#### 2. 根据邮箱查找用户

```sql
SELECT * FROM users WHERE email = 'student@example.com';
```

#### 3. 更新用户信息

```sql
UPDATE users
SET name = '新姓名', phone = '+86 139 0000 0001', updated_at = CURRENT_TIMESTAMP
WHERE id = 'user-uuid';
```

#### 4. 删除用户（会级联删除相关数据）

```sql
DELETE FROM users WHERE id = 'user-uuid';
```

### 大学相关查询

#### 1. 获取所有美国大学

```sql
SELECT * FROM universities WHERE country = '美国' ORDER BY ranking;
```

#### 2. 按排名获取前10大学

```sql
SELECT name, country, ranking, acceptance_rate
FROM universities
WHERE ranking IS NOT NULL
ORDER BY ranking
LIMIT 10;
```

#### 3. 搜索大学（模糊匹配）

```sql
SELECT * FROM universities
WHERE name ILIKE '%哈佛%' OR description ILIKE '%哈佛%';
```

#### 4. 按学费范围筛选

```sql
SELECT name, tuition->>'international' as international_tuition
FROM universities
WHERE (tuition->>'international')::numeric BETWEEN 40000 AND 60000;
```

### 申请相关查询

#### 1. 获取用户的所有申请

```sql
SELECT
    a.*,
    u.name as university_name,
    u.country as university_country
FROM applications a
JOIN universities u ON a.university_id = u.id
WHERE a.user_id = 'user-uuid'
ORDER BY a.created_at DESC;
```

#### 2. 获取特定状态的申请

```sql
SELECT * FROM applications WHERE status = 'submitted';
```

#### 3. 统计用户申请数量

```sql
SELECT
    user_id,
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_count,
    COUNT(CASE WHEN decision = 'accepted' THEN 1 END) as accepted_count
FROM applications
GROUP BY user_id;
```

#### 4. 更新申请状态

```sql
UPDATE applications
SET status = 'submitted', submission_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
WHERE id = 'application-uuid';
```

### 通知相关查询

#### 1. 获取用户未读通知

```sql
SELECT * FROM notifications
WHERE user_id = 'user-uuid' AND is_read = FALSE
ORDER BY created_at DESC;
```

#### 2. 标记通知为已读

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 'notification-uuid';
```

#### 3. 获取用户最近的通知

```sql
SELECT * FROM notifications
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 10;
```

### 提醒相关查询

#### 1. 获取用户未完成的提醒

```sql
SELECT * FROM reminders
WHERE user_id = 'user-uuid' AND is_completed = FALSE
ORDER BY due_date ASC;
```

#### 2. 获取即将到期的提醒

```sql
SELECT * FROM reminders
WHERE user_id = 'user-uuid'
  AND is_completed = FALSE
  AND due_date BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'
ORDER BY due_date ASC;
```

#### 3. 标记提醒为已完成

```sql
UPDATE reminders
SET is_completed = TRUE, updated_at = CURRENT_TIMESTAMP
WHERE id = 'reminder-uuid';
```

## 📈 统计查询

### 1. 申请统计视图

```sql
-- 查看申请统计
SELECT * FROM application_stats;
```

### 2. 大学统计视图

```sql
-- 查看大学申请统计
SELECT * FROM university_stats;
```

### 3. 自定义统计查询

#### 按国家统计申请数量

```sql
SELECT
    u.country,
    COUNT(a.id) as total_applications,
    COUNT(CASE WHEN a.status = 'submitted' THEN 1 END) as submitted_count,
    COUNT(CASE WHEN a.decision = 'accepted' THEN 1 END) as accepted_count
FROM universities u
LEFT JOIN applications a ON u.id = a.university_id
GROUP BY u.country
ORDER BY total_applications DESC;
```

#### 按月份统计申请数量

```sql
SELECT
    DATE_TRUNC('month', a.created_at) as month,
    COUNT(*) as applications_count
FROM applications a
GROUP BY DATE_TRUNC('month', a.created_at)
ORDER BY month DESC;
```

## 🔧 数据操作示例

### 1. 插入新用户

```sql
INSERT INTO users (email, name, role, phone, address) VALUES (
    'newstudent@example.com',
    '李四',
    'student',
    '+86 137 0000 0000',
    '广州市天河区'
);
```

### 2. 插入新大学

```sql
INSERT INTO universities (name, country, state, city, ranking, acceptance_rate, tuition, programs, application_deadlines, requirements, description, website) VALUES (
    '麻省理工学院',
    '美国',
    'Massachusetts',
    'Cambridge',
    3,
    6.7,
    '{"domestic": 53790, "international": 53790, "currency": "USD"}',
    '[{"id": "3", "name": "计算机科学与工程", "degree": "bachelor", "duration": 4, "tuition": 53790}]',
    '[{"id": "5", "type": "regular_decision", "deadline": "2025-01-01", "description": "常规申请截止日期"}]',
    '{"minGPA": 3.9, "minSAT": 1520, "minTOEFL": 100, "requiredDocuments": ["成绩单", "推荐信", "个人陈述", "SAT成绩"]}',
    '麻省理工学院是一所位于美国马萨诸塞州剑桥市的私立研究型大学，以其在工程和科学领域的卓越表现而闻名。',
    'https://www.mit.edu'
);
```

### 3. 创建新申请

```sql
INSERT INTO applications (user_id, university_id, program_id, status, priority, notes) VALUES (
    'user-uuid',
    'university-uuid',
    'program-id',
    'not_started',
    'high',
    'MIT计算机科学专业申请'
);
```

### 4. 添加申请材料

```sql
UPDATE applications
SET materials = materials || '[
    {
        "id": "3",
        "type": "transcript",
        "name": "高中成绩单",
        "fileName": "transcript_mit.pdf",
        "fileUrl": "/materials/transcript_mit.pdf",
        "fileSize": 2048000,
        "status": "uploaded",
        "uploadedAt": "2024-01-20T00:00:00Z"
    }
]'::jsonb
WHERE id = 'application-uuid';
```

### 5. 创建提醒

```sql
INSERT INTO reminders (user_id, title, description, due_date, priority, category) VALUES (
    'user-uuid',
    '准备MIT申请材料',
    '整理MIT申请所需的所有材料',
    '2024-12-15T00:00:00Z',
    'high',
    'application'
);
```

## 🛠️ 维护操作

### 1. 备份数据库

```bash
pg_dump -h your-host -U your-username -d your-database > backup.sql
```

### 2. 恢复数据库

```bash
psql -h your-host -U your-username -d your-database < backup.sql
```

### 3. 清理旧数据

```sql
-- 删除30天前的已读通知
DELETE FROM notifications
WHERE is_read = TRUE
  AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- 删除已完成的提醒
DELETE FROM reminders
WHERE is_completed = TRUE
  AND updated_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
```

### 4. 优化查询性能

```sql
-- 分析表统计信息
ANALYZE users;
ANALYZE universities;
ANALYZE applications;
ANALYZE notifications;
ANALYZE reminders;

-- 重建索引
REINDEX TABLE users;
REINDEX TABLE universities;
REINDEX TABLE applications;
```

## 🔐 安全注意事项

1. **参数化查询**: 始终使用参数化查询防止SQL注入
2. **权限控制**: 确保数据库用户只有必要的权限
3. **数据验证**: 在应用层验证所有输入数据
4. **备份策略**: 定期备份数据库
5. **监控**: 监控数据库性能和异常访问

## 📞 技术支持

如果在使用过程中遇到问题，请参考：

- PostgreSQL 官方文档
- Neon 数据库文档
- 项目 README 文件
