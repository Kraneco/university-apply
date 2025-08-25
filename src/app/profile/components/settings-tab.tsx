'use client';

import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Bell, Eye } from 'lucide-react';
import { User } from '@/types';

interface SettingsTabProps {
  user: User;
}

export function SettingsTab({ user }: SettingsTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* 安全设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>安全设置</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">修改密码</h4>
              <p className="text-muted-foreground text-sm">
                定期更新密码以确保账户安全
              </p>
            </div>
            <Button variant="outline" size="sm">
              修改
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">两步验证</h4>
              <p className="text-muted-foreground text-sm">
                启用两步验证以提高账户安全性
              </p>
            </div>
            <Button variant="outline" size="sm">
              启用
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>通知设置</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">邮件通知</h4>
              <p className="text-muted-foreground text-sm">
                接收重要的申请更新和提醒
              </p>
            </div>
            <Button variant="outline" size="sm">
              管理
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">应用内通知</h4>
              <p className="text-muted-foreground text-sm">
                在应用内接收实时通知
              </p>
            </div>
            <Button variant="outline" size="sm">
              管理
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 隐私设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>隐私设置</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">数据导出</h4>
              <p className="text-muted-foreground text-sm">
                导出您的个人数据和申请记录
              </p>
            </div>
            <Button variant="outline" size="sm">
              导出
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-destructive font-medium">删除账户</h4>
              <p className="text-muted-foreground text-sm">
                永久删除您的账户和所有数据
              </p>
            </div>
            <Button variant="destructive" size="sm">
              删除
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
