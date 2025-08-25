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
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  ArrowLeft,
  Edit,
  Calendar,
  GraduationCap,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Application } from '@/types';

function ApplicationDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取申请详情
  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${id}`);
      const result = await response.json();

      if (result.success) {
        setApplication(result.data);
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

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'submitted':
        return 'info';
      case 'under_review':
        return 'warning';
      case 'interview_scheduled':
        return 'info';
      case 'decision_made':
        return 'success';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // 获取决定状态图标
  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'waitlisted':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
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
            onClick={() => router.push(ROUTES.APPLICATIONS)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {application.universityName}
              </h1>
              <p className="text-muted-foreground mt-2">
                {application.programName}
              </p>
            </div>
            <Button onClick={() => router.push(`/applications/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t('applications.basicInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('applications.status')}
                </span>
                <Badge variant={getStatusColor(application.status)}>
                  {t(`dashboard.applicationStatus.${application.status}`)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('applications.priority')}
                </span>
                <Badge variant={getPriorityColor(application.priority)}>
                  {t(`dashboard.priority.${application.priority}`)}
                </Badge>
              </div>
              {application.submissionDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t('applications.submissionDate')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(application.submissionDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              {application.decision && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t('applications.decision')}
                  </span>
                  <div className="flex items-center gap-2">
                    {getDecisionIcon(application.decision)}
                    <Badge variant="outline">
                      {t(`dashboard.decisionStatus.${application.decision}`)}
                    </Badge>
                  </div>
                </div>
              )}
              {application.decisionDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t('applications.decisionDate')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(application.decisionDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 大学信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t('applications.universityInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-muted-foreground">
                  {t('applications.university')}
                </span>
                <p className="font-medium">{application.universityName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('applications.program')}
                </span>
                <p className="font-medium">{application.programName}</p>
              </div>
              {application.degreeType && (
                <div>
                  <span className="text-muted-foreground">
                    {t('applications.degreeType')}
                  </span>
                  <p className="font-medium">{application.degreeType}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 备注 */}
          {application.notes && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('applications.notes')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{application.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* 时间线 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('applications.timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{t('applications.created')}</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {application.submissionDate && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {t('applications.submitted')}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(
                          application.submissionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {application.decisionDate && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                      {getDecisionIcon(application.decision || '')}
                    </div>
                    <div>
                      <p className="font-medium">
                        {t('applications.decisionReceived')}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(
                          application.decisionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default function ApplicationDetailPage() {
  return (
    <ProtectedRoute>
      <ApplicationDetailContent />
    </ProtectedRoute>
  );
}
