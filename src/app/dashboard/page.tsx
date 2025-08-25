'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  GraduationCap,
  Plus,
  Search,
  User,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Target,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Application, Notification, Reminder } from '@/types';

function DashboardContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    inProgress: 0,
    submitted: 0,
    decisionsReceived: 0,
  });

  // 获取申请数据
  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const result = await response.json();

      if (result.success) {
        setApplications(result.data);
        setStats({
          totalApplications: result.data.length,
          inProgress: result.data.filter(
            (app: Application) => app.status === 'in_progress'
          ).length,
          submitted: result.data.filter(
            (app: Application) => app.status === 'submitted'
          ).length,
          decisionsReceived: result.data.filter(
            (app: Application) => app.decision
          ).length,
        });
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: t('common.error'),
        description: t('api.applications.fetchError'),
        variant: 'destructive',
      });
    }
  };

  // 获取通知数据
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=5');
      const result = await response.json();

      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // 获取提醒数据
  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders?upcoming=true&days=7');
      const result = await response.json();

      if (result.success) {
        setReminders(result.data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchApplications(),
        fetchNotifications(),
        fetchReminders(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // 获取状态颜色
  const getStatusColor = (
    status: string
  ): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (status) {
      case 'not_started':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'submitted':
        return 'default';
      case 'under_review':
        return 'default';
      case 'interview_scheduled':
        return 'default';
      case 'decision_made':
        return 'default';
      case 'completed':
        return 'default';
      default:
        return 'secondary';
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (
    priority: string
  ): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // 计算剩余天数
  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 快速操作
  const quickActions = [
    {
      title: t('dashboard.quickActions.newApplication'),
      description: t('dashboard.quickActions.newApplicationDesc'),
      icon: Plus,
      action: () => router.push(ROUTES.APPLICATIONS),
      color: 'bg-blue-500',
    },
    {
      title: t('dashboard.quickActions.browseUniversities'),
      description: t('dashboard.quickActions.browseUniversitiesDesc'),
      icon: GraduationCap,
      action: () => router.push(ROUTES.UNIVERSITIES),
      color: 'bg-green-500',
    },
    {
      title: t('dashboard.quickActions.addReminder'),
      description: t('dashboard.quickActions.addReminderDesc'),
      icon: Clock,
      action: () => router.push(ROUTES.REMINDERS),
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 欢迎信息 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('dashboard.welcome')}, {user?.name}!
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalApplications')}
              </CardTitle>
              <FileText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalApplications}
              </div>
              <p className="text-muted-foreground text-xs">
                {t('dashboard.totalApplicationsDesc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.applicationsInProgress')}
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-muted-foreground text-xs">
                {t('dashboard.applicationsInProgressDesc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.upcomingDeadlinesCount')}
              </CardTitle>
              <Calendar className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reminders.length}</div>
              <p className="text-muted-foreground text-xs">
                {t('dashboard.upcomingDeadlinesDesc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.recentNotifications')}
              </CardTitle>
              <Bell className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-muted-foreground text-xs">
                {t('dashboard.recentNotificationsDesc')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作 */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-lg p-3 ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 最近申请 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{t('dashboard.recentApplications')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">
                    {t('dashboard.noApplications')}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push(ROUTES.APPLICATIONS)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t('dashboard.createFirstApplication')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {application.universityName}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {application.programName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(application.status)}>
                          {t(
                            `dashboard.applicationStatus.${application.status}`
                          )}
                        </Badge>
                        <Badge variant={getPriorityColor(application.priority)}>
                          {t(`dashboard.priority.${application.priority}`)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(ROUTES.APPLICATIONS)}
                    >
                      {t('dashboard.viewAllApplications')}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 即将到期的提醒 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{t('dashboard.upcomingDeadlines')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">
                    {t('dashboard.noDeadlines')}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push(ROUTES.REMINDERS)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t('dashboard.addReminder')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.slice(0, 5).map((reminder) => {
                    const daysLeft = getDaysLeft(reminder.dueDate);
                    const isOverdue = daysLeft < 0;

                    return (
                      <div
                        key={reminder.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{reminder.title}</h4>
                          <p className="text-muted-foreground text-sm">
                            {reminder.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={isOverdue ? 'destructive' : 'default'}
                          >
                            {isOverdue
                              ? `${Math.abs(daysLeft)} ${t('dashboard.daysOverdue')}`
                              : `${daysLeft} ${t('dashboard.daysLeft')}`}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  {reminders.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(ROUTES.REMINDERS)}
                    >
                      {t('dashboard.viewAllReminders')}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 最近通知 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>{t('dashboard.recentNotifications')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  {t('dashboard.noNotifications')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-4 rounded-lg border p-3"
                  >
                    <Bell className="text-muted-foreground mt-1 h-5 w-5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {notification.message}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Badge
                        variant="default"
                        className="bg-primary text-primary-foreground"
                      >
                        {t('dashboard.new')}
                      </Badge>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(ROUTES.NOTIFICATIONS)}
                >
                  {t('dashboard.viewAllNotifications')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
