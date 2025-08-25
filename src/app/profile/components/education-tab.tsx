'use client';

import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus } from 'lucide-react';
import { User } from '@/types';

interface EducationTabProps {
  user: User;
}

export function EducationTab({ user }: EducationTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>{t('settings.profile.education')}</span>
          </CardTitle>
          {/* <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            添加教育信息
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <GraduationCap className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">暂无教育信息</h3>
            <p className="text-muted-foreground mb-4">
              添加您的高中信息、标准化考试成绩和课外活动
            </p>
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              开始添加
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
