# 大学申请跟踪系统

一个基于 Next.js、TypeScript 和 Tailwind CSS 构建的现代化大学申请管理平台。

## 🚀 项目特性

- **现代化技术栈**: Next.js 15 + TypeScript + Tailwind CSS
- **响应式设计**: 完美适配桌面端和移动端
- **权限管理**: 支持学生和管理员两种角色
- **实时状态跟踪**: 申请进度实时更新
- **智能提醒系统**: 截止日期和重要事件提醒
- **文件管理**: 支持多种格式的申请材料上传
- **数据分析**: 申请成功率分析和建议

## 📋 功能模块

### 用户管理

- 用户注册和登录
- 个人信息管理
- 教育背景记录
- 角色权限控制

### 大学搜索

- 全球大学数据库
- 智能筛选和搜索
- 详细大学信息展示
- 申请要求对比

### 申请管理

- 申请进度跟踪
- 材料上传和管理
- 状态更新通知
- 申请历史记录

### 提醒系统

- 截止日期提醒
- 自定义任务提醒
- 多渠道通知
- 优先级管理

## 🛠️ 技术栈

### 前端

- **Next.js 15**: React 框架，支持 SSR 和 SSG
- **TypeScript**: 类型安全的 JavaScript
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Zustand**: 轻量级状态管理
- **React Hook Form**: 表单处理
- **Zod**: 数据验证
- **Lucide React**: 图标库

### UI 组件

- **Radix UI**: 无样式的可访问组件
- **Class Variance Authority**: 组件变体管理
- **Tailwind Merge**: CSS 类名合并

### 开发工具

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查

## 🚀 快速开始

### 环境要求

- Node.js 18.18.0 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── login/             # 登录页面
│   ├── register/          # 注册页面
│   ├── dashboard/         # 仪表板页面
│   ├── universities/      # 大学搜索页面
│   ├── applications/      # 申请管理页面
│   └── admin/            # 管理员页面
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── layout/           # 布局组件
│   └── auth/             # 认证相关组件
├── lib/                  # 工具函数和配置
│   ├── utils.ts          # 通用工具函数
│   ├── constants.ts      # 常量定义
│   └── database.ts       # 数据库操作
├── store/                # 状态管理
│   └── auth-store.ts     # 认证状态
└── types/                # TypeScript 类型定义
    └── index.ts          # 核心类型
```

## 🔐 测试账户

### 管理员账户

- 邮箱: `admin@example.com`
- 密码: `password123`

### 学生账户

- 邮箱: `student@example.com`
- 密码: `password123`

## 🎨 设计系统

项目使用统一的设计系统，包括：

- **颜色系统**: 基于 HSL 的颜色变量
- **间距系统**: 统一的间距和布局
- **组件库**: 可复用的 UI 组件
- **响应式设计**: 移动优先的设计理念

## 📱 响应式支持

- **桌面端**: 1200px+
- **平板端**: 768px - 1199px
- **手机端**: 320px - 767px

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名

### 组件开发

- 使用函数式组件和 Hooks
- 支持 TypeScript 类型定义
- 遵循单一职责原则
- 提供适当的默认值

### 状态管理

- 使用 Zustand 进行全局状态管理
- 本地状态使用 useState
- 复杂状态逻辑使用 useReducer

## 🚀 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 环境变量

```env
# 数据库配置
DATABASE_URL=your_neon_database_url

# 认证配置
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# 文件上传配置
UPLOAD_API_KEY=your_upload_api_key
```

## 📊 数据库设计

### 用户表 (users)

- id: 主键
- email: 邮箱
- name: 姓名
- role: 角色 (student/admin)
- avatar: 头像
- phone: 电话
- address: 地址
- education: 教育背景 (JSON)
- created_at: 创建时间
- updated_at: 更新时间

### 大学表 (universities)

- id: 主键
- name: 大学名称
- country: 国家
- state: 州/省
- city: 城市
- ranking: 排名
- acceptance_rate: 录取率
- tuition: 学费信息 (JSON)
- programs: 专业信息 (JSON)
- requirements: 申请要求 (JSON)
- description: 描述
- website: 官网
- logo: 校徽
- images: 图片 (JSON)
- created_at: 创建时间
- updated_at: 更新时间

### 申请表 (applications)

- id: 主键
- user_id: 用户ID
- university_id: 大学ID
- program_id: 专业ID
- status: 申请状态
- submission_date: 提交日期
- decision_date: 决定日期
- decision: 录取决定
- materials: 申请材料 (JSON)
- notes: 备注
- priority: 优先级
- created_at: 创建时间
- updated_at: 更新时间

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师。
