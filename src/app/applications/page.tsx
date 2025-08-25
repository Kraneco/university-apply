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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  GraduationCap,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Application, University, Program } from '@/types';

function ApplicationsContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    universityId: '',
  });
  const [formData, setFormData] = useState({
    universityId: '',
    notes: '',
    priority: 'medium',
  });

  // 获取申请列表
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications');
      const result = await response.json();

      if (result.success) {
        setApplications(result.data);
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
    } finally {
      setLoading(false);
    }
  };

  // 获取大学列表
  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities');
      const result = await response.json();

      if (result.success) {
        setUniversities(result.data);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchUniversities();
  }, []);

  // 验证表单
  const validateForm = () => {
    const errors = {
      universityId: '',
    };

    if (!formData.universityId) {
      errors.universityId = t('applications.universityRequired');
    }

    setFormErrors(errors);
    return !errors.universityId;
  };

  // 创建新申请
  const handleCreateApplication = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setSaving(true);
      console.log('开始创建申请...', formData);

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // 不传递programId，让后端处理为null
        }),
      });

      const result = await response.json();
      console.log('申请创建结果:', result);

      if (result.success) {
        toast({
          title: t('common.success'),
          description: t('api.applications.createSuccess'),
        });
        setShowCreateDialog(false);
        setFormData({
          universityId: '',
          notes: '',
          priority: 'medium',
        });
        fetchApplications();
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: t('common.error'),
        description: t('api.applications.createError'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // 删除申请
  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;

    try {
      setDeleting(true);
      console.log('开始删除申请...', selectedApplication.id);

      const response = await fetch(
        `/api/applications/${selectedApplication.id}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();
      console.log('申请删除结果:', result);

      if (result.success) {
        toast({
          title: t('common.success'),
          description: t('api.applications.deleteSuccess'),
        });
        setShowDeleteDialog(false);
        setSelectedApplication(null);
        fetchApplications();
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: t('common.error'),
        description: t('api.applications.deleteError'),
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

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

  // 过滤申请
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.universityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.programName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || !statusFilter || app.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' ||
      !priorityFilter ||
      app.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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
        {/* 页面标题 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('applications.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('applications.overview')}
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('applications.newApplication')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('applications.newApplication')}</DialogTitle>
                <DialogDescription>
                  {t('applications.createDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="university"
                    className="flex items-center gap-1"
                  >
                    {t('applications.university')}
                    <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs">
                      ({t('applications.required')})
                    </span>
                  </label>
                  <Select
                    value={formData.universityId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, universityId: value });
                      if (value) {
                        setFormErrors({ ...formErrors, universityId: '' });
                      }
                    }}
                  >
                    <SelectTrigger
                      className={
                        formErrors.universityId ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue
                        placeholder={t('applications.selectUniversity')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem key={university.id} value={university.id}>
                          {university.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.universityId && (
                    <p className="text-sm text-red-500">
                      {formErrors.universityId}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="priority" className="flex items-center gap-1">
                    {t('applications.priority')}
                    <span className="text-muted-foreground text-xs">
                      ({t('applications.optional')})
                    </span>
                  </label>
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
                  <label htmlFor="notes" className="flex items-center gap-1">
                    {t('applications.notes')}
                    <span className="text-muted-foreground text-xs">
                      ({t('applications.optional')})
                    </span>
                  </label>
                  <Textarea
                    id="notes"
                    placeholder={t('applications.notesPlaceholder')}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={saving}
                >
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateApplication} disabled={saving}>
                  {saving ? t('common.saving') : t('applications.create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder={t('applications.searchApplications')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('applications.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('applications.allStatuses')}
                </SelectItem>
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
                <SelectItem value="decision_made">
                  {t('dashboard.applicationStatus.decision_made')}
                </SelectItem>
                <SelectItem value="completed">
                  {t('dashboard.applicationStatus.completed')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('applications.filterByPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('applications.allPriorities')}
                </SelectItem>
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
        </div>

        {/* 申请列表 */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                {t('applications.noApplications')}
              </h3>
              <p className="text-muted-foreground mb-4 text-center">
                {t('applications.createFirstApplication')}
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('applications.newApplication')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((application) => (
              <Card
                key={application.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {application.universityName}
                        </h3>
                        <Badge variant={getStatusColor(application.status)}>
                          {t(
                            `dashboard.applicationStatus.${application.status}`
                          )}
                        </Badge>
                        <Badge variant={getPriorityColor(application.priority)}>
                          {t(`dashboard.priority.${application.priority}`)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {application.programName}
                      </p>
                      {application.notes && (
                        <p className="text-muted-foreground mb-3 text-sm">
                          {application.notes}
                        </p>
                      )}
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        {application.submissionDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(
                              application.submissionDate
                            ).toLocaleDateString()}
                          </div>
                        )}
                        {application.decision && (
                          <Badge variant="outline">
                            {t(
                              `dashboard.decisionStatus.${application.decision}`
                            )}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/applications/${application.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/applications/${application.id}/edit`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 删除确认对话框 */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('applications.confirmDelete')}</DialogTitle>
              <DialogDescription>
                {t('applications.deleteWarning')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteApplication}
                disabled={deleting}
              >
                {deleting ? t('common.deleting') : t('common.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <ApplicationsContent />
    </ProtectedRoute>
  );
}
