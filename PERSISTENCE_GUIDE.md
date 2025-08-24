# 持久化数据管理指南

## 概述

本项目使用 Zustand 的 persist 中间件来实现数据持久化，确保用户设置和状态在页面刷新后保持不变。

## 已实现的持久化数据

### 1. 主题设置 (theme-store.ts)

- **存储键**: `theme-storage`
- **数据**:
  - `theme`: 'light' | 'dark' | 'system'
- **默认值**: 'system' (跟随系统)
- **用途**: 用户选择的主题模式

### 2. 语言设置 (language-store.ts)

- **存储键**: `language-storage`
- **数据**:
  - `language`: 'zh' | 'en'
- **默认值**: 'zh' (中文)
- **用途**: 用户选择的界面语言

### 3. 用户认证状态 (auth-store.ts)

- **存储键**: `auth-storage`
- **数据**:
  - `user`: 用户信息对象
  - `isAuthenticated`: 认证状态
  - `isLoading`: 加载状态
- **用途**: 保持用户登录状态

## 需要持久化的数据

### 1. 用户偏好设置

- 通知设置
- 隐私设置
- 界面布局偏好

### 2. 应用数据

- 大学申请记录
- 申请进度
- 收藏的大学
- 搜索历史

### 3. 表单数据

- 草稿保存
- 未完成的申请

## 实现建议

### 1. 用户偏好设置 Store

```typescript
// src/store/preferences-store.ts
interface PreferencesState {
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  privacy: {
    shareProfile: boolean;
    allowAnalytics: boolean;
  };
  layout: {
    sidebarCollapsed: boolean;
    compactMode: boolean;
  };
}
```

### 2. 申请数据 Store

```typescript
// src/store/applications-store.ts
interface ApplicationsState {
  applications: Application[];
  favorites: University[];
  searchHistory: string[];
  drafts: ApplicationDraft[];
}
```

### 3. 表单数据 Store

```typescript
// src/store/form-store.ts
interface FormState {
  currentForm: string;
  formData: Record<string, any>;
  lastSaved: Date;
}
```

## 存储策略

### 1. 本地存储 (localStorage)

- 用户偏好设置
- 主题和语言设置
- 认证状态

### 2. 会话存储 (sessionStorage)

- 临时表单数据
- 搜索历史
- 页面状态

### 3. 服务器存储

- 用户数据
- 申请记录
- 重要业务数据

## 注意事项

1. **敏感数据**: 不要在本地存储中保存密码等敏感信息
2. **数据大小**: 注意 localStorage 的存储限制 (通常 5-10MB)
3. **数据同步**: 确保本地数据与服务器数据的一致性
4. **错误处理**: 处理存储失败的情况
5. **数据迁移**: 考虑版本更新时的数据迁移策略

## 最佳实践

1. **类型安全**: 使用 TypeScript 确保数据类型正确
2. **默认值**: 为所有持久化数据提供合理的默认值
3. **验证**: 在读取数据时进行验证
4. **清理**: 定期清理过期或无效的数据
5. **备份**: 重要数据考虑备份策略
