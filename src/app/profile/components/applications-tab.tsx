'use client';

import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { User } from '@/types';

interface ApplicationsTabProps {
  user: User;
}

export function ApplicationsTab({ user }: ApplicationsTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{t('settings.profile.applications')}</span>
          </CardTitle>
          {/* <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            查看申请
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">暂无申请记录</h3>
            <p className="text-muted-foreground mb-4">
              开始您的大学申请之旅，跟踪申请进度
            </p>
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              开始申请
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
