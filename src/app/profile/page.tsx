'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/store/auth-store';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  User,
  GraduationCap,
  FileText,
  Settings,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import { BasicInfoTab } from './components/basic-info-tab';
import { EducationTab } from './components/education-tab';
import { ApplicationsTab } from './components/applications-tab';
import { SettingsTab } from './components/settings-tab';

function ProfileContent() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('basic-info');

  if (!user) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  // 获取用户头像的初始字母
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('settings.profile.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('settings.profile.description')}
          </p>
        </div>

        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  <div className="text-muted-foreground mt-2 flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <Badge variant="outline">
                      {user.role === 'student' ? '学生' : '管理员'}
                    </Badge>
                    <div className="text-muted-foreground flex items-center space-x-1 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        加入时间:{' '}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                {t('settings.profile.editProfile')}
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* 标签页导航 */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="basic-info"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('settings.profile.basicInfo')}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="flex items-center space-x-2"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('settings.profile.education')}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('settings.profile.applications')}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('settings.profile.settings')}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* 基本信息标签页 */}
          <TabsContent value="basic-info" className="space-y-6">
            <BasicInfoTab user={user} />
          </TabsContent>

          {/* 教育背景标签页 */}
          <TabsContent value="education" className="space-y-6">
            <EducationTab user={user} />
          </TabsContent>

          {/* 申请进度标签页 */}
          <TabsContent value="applications" className="space-y-6">
            <ApplicationsTab user={user} />
          </TabsContent>

          {/* 账户设置标签页 */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsTab user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
