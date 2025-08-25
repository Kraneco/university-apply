'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading';
import { ArrowLeft, Save, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Application } from '@/types';

function ApplicationEditContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    notes: '',
    submissionDate: '',
    decision: '',
    decisionDate: '',
  });

  // 获取申请详情
  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${id}`);
      const result = await response.json();

      if (result.success) {
        const app = result.data;
        setApplication(app);
        setFormData({
          status: app.status || '',
          priority: app.priority || '',
          notes: app.notes || '',
          submissionDate: app.submissionDate
            ? new Date(app.submissionDate).toISOString().split('T')[0]
            : '',
          decision: app.decision || '',
          decisionDate: app.decisionDate
            ? new Date(app.decisionDate).toISOString().split('T')[0]
            : '',
        });
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
        router.push(ROUTES.APPLICATIONS);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast({
        title: t('common.error'),
        description: t('api.applications.fetchError'),
        variant: 'destructive',
      });
      router.push(ROUTES.APPLICATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  // 保存申请
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('common.success'),
          description: t('api.applications.updateSuccess'),
        });
        router.push(`/applications/${id}`);
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: t('common.error'),
        description: t('api.applications.updateError'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('applications.notFound')}</h1>
            <Button
              onClick={() => router.push(ROUTES.APPLICATIONS)}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToApplications')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/applications/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {t('applications.editApplication')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {application.universityName} - {application.programName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('applications.basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="status">{t('applications.status')}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('applications.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">
                      {t('dashboard.applicationStatus.not_started')}
                    </SelectItem>
                    <SelectItem value="in_progress">
                      {t('dashboard.applicationStatus.in_progress')}
                    </SelectItem>
                    <SelectItem value="submitted">
                      {t('dashboard.applicationStatus.submitted')}
                    </SelectItem>
                    <SelectItem value="under_review">
                      {t('dashboard.applicationStatus.under_review')}
                    </SelectItem>
                    <SelectItem value="interview_scheduled">
                      {t('dashboard.applicationStatus.interview_scheduled')}
                    </SelectItem>
                    <SelectItem value="decision_made">
                      {t('dashboard.applicationStatus.decision_made')}
                    </SelectItem>
                    <SelectItem value="completed">
                      {t('dashboard.applicationStatus.completed')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">{t('applications.priority')}</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('applications.selectPriority')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      {t('dashboard.priority.high')}
                    </SelectItem>
                    <SelectItem value="medium">
                      {t('dashboard.priority.medium')}
                    </SelectItem>
                    <SelectItem value="low">
                      {t('dashboard.priority.low')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="submissionDate">
                  {t('applications.submissionDate')}
                </Label>
                <Input
                  id="submissionDate"
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, submissionDate: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 决定信息 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('applications.decisionInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="decision">{t('applications.decision')}</Label>
                <Select
                  value={formData.decision}
                  onValueChange={(value) =>
                    setFormData({ ...formData, decision: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('applications.selectDecision')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">
                      {t('dashboard.decisionStatus.accepted')}
                    </SelectItem>
                    <SelectItem value="rejected">
                      {t('dashboard.decisionStatus.rejected')}
                    </SelectItem>
                    <SelectItem value="waitlisted">
                      {t('dashboard.decisionStatus.waitlisted')}
                    </SelectItem>
                    <SelectItem value="deferred">
                      {t('dashboard.decisionStatus.deferred')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="decisionDate">
                  {t('applications.decisionDate')}
                </Label>
                <Input
                  id="decisionDate"
                  type="date"
                  value={formData.decisionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, decisionDate: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 备注 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('applications.notes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="notes">{t('applications.notes')}</Label>
                <Textarea
                  id="notes"
                  placeholder={t('applications.notesPlaceholder')}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/applications/${id}`)}
            disabled={saving}
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default function ApplicationEditPage() {
  return (
    <ProtectedRoute>
      <ApplicationEditContent />
    </ProtectedRoute>
  );
}
