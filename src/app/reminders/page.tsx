'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { LoadingSpinner, Loading } from '@/components/ui/loading';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Tag,
  GraduationCap,
} from 'lucide-react';
import { Reminder } from '@/types';

function RemindersContent() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: '',
    dueDate: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'other',
  });

  // 获取提醒列表
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reminders');
      const result = await response.json();

      if (result.success) {
        setReminders(result.data);
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: t('common.error'),
        description: t('api.reminders.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // 打开创建弹窗
  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'other',
    });
    setShowCreateDialog(true);
  };

  // 打开编辑弹窗
  const handleOpenEditDialog = (reminder: Reminder) => {
    setIsEditing(true);
    setSelectedReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      dueDate: reminder.dueDate
        ? new Date(reminder.dueDate).toISOString().slice(0, 16)
        : '',
      priority: reminder.priority,
      category: reminder.category,
    });
    setShowCreateDialog(true);
  };

  // 验证表单
  const validateForm = () => {
    const errors = {
      title: '',
      dueDate: '',
    };

    if (!formData.title.trim()) {
      errors.title = t('reminders.titleRequired');
    }

    if (!formData.dueDate) {
      errors.dueDate = t('reminders.dueDateRequired');
    }

    setFormErrors(errors);
    return !errors.title && !errors.dueDate;
  };

  // 创建或更新提醒
  const handleCreateReminder = async () => {
    console.log('🚀 开始处理提醒操作:', { isEditing, formData });

    // 客户端表单验证
    if (!validateForm()) {
      console.log('❌ 表单验证失败');
      return;
    }

    console.log('✅ 表单验证通过，开始API请求');
    setSaving(true);

    try {
      const url = isEditing
        ? `/api/reminders/${selectedReminder?.id}`
        : '/api/reminders';

      const method = isEditing ? 'PUT' : 'POST';
      const requestBody = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      };

      console.log('📡 发送API请求:', {
        url,
        method,
        requestBody,
        selectedReminderId: selectedReminder?.id,
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 收到API响应:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const result = await response.json();
      console.log('📄 API响应数据:', result);

      if (result.success) {
        console.log('✅ 操作成功:', result.message);
        toast({
          title: t('common.success'),
          description: isEditing
            ? t('api.reminders.updateSuccess')
            : t('api.reminders.createSuccess'),
        });

        // 清理状态
        setShowCreateDialog(false);
        setIsEditing(false);
        setSelectedReminder(null);
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          category: 'other',
        });

        console.log('🔄 刷新提醒列表');
        await fetchReminders();
      } else {
        console.log('❌ API返回错误:', result.message);
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('💥 网络错误或异常:', error);
      toast({
        title: t('common.error'),
        description: isEditing
          ? t('api.reminders.updateError')
          : t('api.reminders.createError'),
        variant: 'destructive',
      });
    } finally {
      console.log('🏁 操作完成，重置加载状态');
      setSaving(false);
    }
  };

  // 打开标记完成确认对话框
  const handleOpenCompleteDialog = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setShowCompleteDialog(true);
  };

  // 标记提醒为完成
  const handleCompleteReminder = async () => {
    console.log('✅ 开始标记完成提醒:', {
      selectedReminderId: selectedReminder?.id,
    });

    if (!selectedReminder) {
      console.log('❌ 标记完成失败: 未选择提醒');
      return;
    }

    console.log('✅ 开始标记完成操作');
    setCompleting(true);

    try {
      const url = `/api/reminders/${selectedReminder.id}/complete`;

      console.log('📡 发送标记完成请求:', { url, method: 'PUT' });

      const response = await fetch(url, {
        method: 'PUT',
      });

      console.log('📥 收到标记完成响应:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const result = await response.json();
      console.log('📄 标记完成响应数据:', result);

      if (result.success) {
        console.log('✅ 标记完成成功:', result.message);
        toast({
          title: t('common.success'),
          description: t('api.reminders.completeSuccess'),
        });

        // 清理状态
        setShowCompleteDialog(false);
        setSelectedReminder(null);

        console.log('🔄 刷新提醒列表');
        await fetchReminders();
      } else {
        console.log('❌ 标记完成失败:', result.message);
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('💥 标记完成网络错误:', error);
      toast({
        title: t('common.error'),
        description: t('api.reminders.completeError'),
        variant: 'destructive',
      });
    } finally {
      console.log('🏁 标记完成操作完成，重置加载状态');
      setCompleting(false);
    }
  };

  // 删除提醒
  const handleDeleteReminder = async () => {
    console.log('🗑️ 开始删除提醒:', {
      selectedReminderId: selectedReminder?.id,
    });

    if (!selectedReminder) {
      console.log('❌ 删除失败: 未选择提醒');
      return;
    }

    console.log('✅ 开始删除操作');
    setDeleting(true);

    try {
      const url = `/api/reminders/${selectedReminder.id}`;

      console.log('📡 发送删除请求:', { url, method: 'DELETE' });

      const response = await fetch(url, {
        method: 'DELETE',
      });

      console.log('📥 收到删除响应:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const result = await response.json();
      console.log('📄 删除响应数据:', result);

      if (result.success) {
        console.log('✅ 删除成功:', result.message);
        toast({
          title: t('common.success'),
          description: t('api.reminders.deleteSuccess'),
        });

        // 清理状态
        setShowDeleteDialog(false);
        setSelectedReminder(null);

        console.log('🔄 刷新提醒列表');
        await fetchReminders();
      } else {
        console.log('❌ 删除失败:', result.message);
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('💥 删除网络错误:', error);
      toast({
        title: t('common.error'),
        description: t('api.reminders.deleteError'),
        variant: 'destructive',
      });
    } finally {
      console.log('🏁 删除操作完成，重置加载状态');
      setDeleting(false);
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
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

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'application':
        return <GraduationCap className="h-4 w-4" />;
      case 'test':
        return <Calendar className="h-4 w-4" />;
      case 'document':
        return <Tag className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  // 获取状态颜色
  const getStatusColor = (reminder: Reminder) => {
    if (reminder.isCompleted) return 'default';
    const daysLeft = getDaysLeft(reminder.dueDate);
    if (daysLeft < 0) return 'destructive';
    if (daysLeft <= 3) return 'default';
    return 'secondary';
  };

  // 过滤提醒
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' ||
      !categoryFilter ||
      reminder.category === categoryFilter;
    const matchesPriority =
      priorityFilter === 'all' ||
      !priorityFilter ||
      reminder.priority === priorityFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      !statusFilter ||
      (statusFilter === 'completed' && reminder.isCompleted) ||
      (statusFilter === 'pending' && !reminder.isCompleted);

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
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
            <h1 className="text-3xl font-bold">{t('reminders.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('reminders.description')}
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                {t('reminders.newReminder')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing
                    ? t('reminders.editReminder')
                    : t('reminders.newReminder')}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? t('reminders.editReminderDescription')
                    : t('reminders.createDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="flex items-center gap-1">
                    {t('reminders.title')}
                    <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs">
                      ({t('applications.required')})
                    </span>
                  </label>
                  <Input
                    id="title"
                    placeholder={t('reminders.titlePlaceholder')}
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (e.target.value.trim()) {
                        setFormErrors({ ...formErrors, title: '' });
                      }
                    }}
                    className={formErrors.title ? 'border-red-500' : ''}
                    required
                  />
                  {formErrors.title && (
                    <p className="text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="description"
                    className="flex items-center gap-1"
                  >
                    {t('reminders.description')}
                    <span className="text-muted-foreground text-xs">
                      ({t('applications.optional')})
                    </span>
                  </label>
                  <Textarea
                    id="description"
                    placeholder={t('reminders.descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="dueDate" className="flex items-center gap-1">
                    {t('reminders.dueDate')}
                    <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs">
                      ({t('applications.required')})
                    </span>
                  </label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => {
                      setFormData({ ...formData, dueDate: e.target.value });
                      if (e.target.value) {
                        setFormErrors({ ...formErrors, dueDate: '' });
                      }
                    }}
                    className={formErrors.dueDate ? 'border-red-500' : ''}
                    required
                  />
                  {formErrors.dueDate && (
                    <p className="text-sm text-red-500">{formErrors.dueDate}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="priority" className="flex items-center gap-1">
                    {t('reminders.priority')}
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
                        placeholder={t('reminders.selectPriority')}
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
                  <label htmlFor="category" className="flex items-center gap-1">
                    {t('reminders.category')}
                    <span className="text-muted-foreground text-xs">
                      ({t('applications.optional')})
                    </span>
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('reminders.selectCategory')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="application">
                        {t('reminders.application')}
                      </SelectItem>
                      <SelectItem value="test">
                        {t('reminders.test')}
                      </SelectItem>
                      <SelectItem value="document">
                        {t('reminders.document')}
                      </SelectItem>
                      <SelectItem value="other">
                        {t('reminders.other')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setIsEditing(false);
                    setSelectedReminder(null);
                    setFormData({
                      title: '',
                      description: '',
                      dueDate: '',
                      priority: 'medium',
                      category: 'other',
                    });
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateReminder} disabled={saving}>
                  {saving ? (
                    <>
                      <Loading size="sm" className="mr-2" />
                      {t('common.saving')}
                    </>
                  ) : isEditing ? (
                    t('common.save')
                  ) : (
                    t('reminders.create')
                  )}
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
                placeholder={t('reminders.searchReminders')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('reminders.filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('reminders.allCategories')}
                </SelectItem>
                <SelectItem value="application">
                  {t('reminders.application')}
                </SelectItem>
                <SelectItem value="test">{t('reminders.test')}</SelectItem>
                <SelectItem value="document">
                  {t('reminders.document')}
                </SelectItem>
                <SelectItem value="other">{t('reminders.other')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('reminders.filterByPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('reminders.allPriorities')}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('reminders.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('reminders.allStatuses')}
                </SelectItem>
                <SelectItem value="pending">
                  {t('reminders.pending')}
                </SelectItem>
                <SelectItem value="completed">
                  {t('reminders.completed')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 提醒列表 */}
        {filteredReminders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                {t('reminders.noReminders')}
              </h3>
              <p className="text-muted-foreground mb-4 text-center">
                {t('reminders.createFirstReminder')}
              </p>
              <Button onClick={handleOpenCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                {t('reminders.newReminder')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredReminders.map((reminder) => {
              const daysLeft = getDaysLeft(reminder.dueDate);
              const isOverdue = daysLeft < 0;
              const isUrgent = daysLeft <= 3 && daysLeft >= 0;

              return (
                <Card
                  key={reminder.id}
                  className={`transition-shadow hover:shadow-md ${
                    reminder.isCompleted ? 'opacity-75' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {getCategoryIcon(reminder.category)}
                          <h3
                            className={`text-lg font-semibold ${
                              reminder.isCompleted ? 'line-through' : ''
                            }`}
                          >
                            {reminder.title}
                          </h3>
                          <Badge variant={getPriorityColor(reminder.priority)}>
                            {t(`dashboard.priority.${reminder.priority}`)}
                          </Badge>
                          <Badge variant={getStatusColor(reminder)}>
                            {reminder.isCompleted
                              ? t('reminders.completed')
                              : isOverdue
                                ? t('reminders.overdue')
                                : isUrgent
                                  ? t('reminders.urgent')
                                  : t('reminders.pending')}
                          </Badge>
                        </div>
                        {reminder.description && (
                          <p
                            className={`text-muted-foreground mb-3 ${
                              reminder.isCompleted ? 'line-through' : ''
                            }`}
                          >
                            {reminder.description}
                          </p>
                        )}
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(reminder.dueDate).toLocaleDateString()}
                          </div>
                          {!reminder.isCompleted && (
                            <div
                              className={`flex items-center gap-1 ${
                                isOverdue
                                  ? 'text-destructive'
                                  : isUrgent
                                    ? 'text-warning'
                                    : ''
                              }`}
                            >
                              {isOverdue ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                              {isOverdue
                                ? `${Math.abs(daysLeft)} ${t('reminders.daysOverdue')}`
                                : `${daysLeft} ${t('reminders.daysLeft')}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!reminder.isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenCompleteDialog(reminder)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {!reminder.isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(reminder)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReminder(reminder);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* 删除确认对话框 */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('reminders.confirmDelete')}</DialogTitle>
              <DialogDescription>
                {t('reminders.deleteWarning')}
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
                onClick={handleDeleteReminder}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    {t('common.deleting')}
                  </>
                ) : (
                  t('common.delete')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 标记完成确认对话框 */}
        <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('reminders.confirmComplete')}</DialogTitle>
              <DialogDescription>
                {t('reminders.completeWarning')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCompleteDialog(false)}
                disabled={completing}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="default"
                onClick={handleCompleteReminder}
                disabled={completing}
              >
                {completing ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    {t('common.completing')}
                  </>
                ) : (
                  t('common.confirm')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

export default function RemindersPage() {
  return (
    <ProtectedRoute>
      <RemindersContent />
    </ProtectedRoute>
  );
}
