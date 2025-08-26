'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/store/notification-store';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import { LoadingSpinner, Loading } from '@/components/ui/loading';
import {
  Bell,
  CheckCircle,
  Trash2,
  Clock,
  AlertCircle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Notification } from '@/types';

function NotificationsContent() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { decrementUnreadCount, resetUnreadCount } = useNotificationStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMarkAsReadDialog, setShowMarkAsReadDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // 获取通知列表
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      const result = await response.json();

      if (result.success) {
        setNotifications(result.data);
        setUnreadCount(
          result.data.filter((n: Notification) => !n.isRead).length
        );
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: t('common.error'),
        description: t('api.notifications.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 打开标记为已读确认弹窗
  const handleOpenMarkAsReadDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowMarkAsReadDialog(true);
  };

  // 标记通知为已读
  const handleMarkAsRead = async () => {
    console.log('✅ 开始标记通知为已读:', {
      selectedNotificationId: selectedNotification?.id,
    });
    if (!selectedNotification) {
      console.log('❌ 标记为已读失败: 未选择通知');
      return;
    }
    console.log('✅ 开始标记为已读操作');
    setMarkingAsRead(true);
    try {
      const url = `/api/notifications/${selectedNotification.id}`;
      console.log('📡 发送标记为已读请求:', { url, method: 'PUT' });
      const response = await fetch(url, { method: 'PUT' });
      console.log('📥 收到标记为已读响应:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
      const result = await response.json();
      console.log('📄 标记为已读响应数据:', result);
      if (result.success) {
        console.log('✅ 标记为已读成功:', result.message);
        // 更新全局未读数量
        decrementUnreadCount();
        toast({
          title: t('common.success'),
          description: t('api.notifications.markReadSuccess'),
        });
        setShowMarkAsReadDialog(false);
        setSelectedNotification(null);
        console.log('🔄 刷新通知列表');
        await fetchNotifications();
      } else {
        console.log('❌ 标记为已读失败:', result.message);
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('💥 标记为已读网络错误:', error);
      toast({
        title: t('common.error'),
        description: t('api.notifications.markReadError'),
        variant: 'destructive',
      });
    } finally {
      console.log('🏁 标记为已读操作完成，重置加载状态');
      setMarkingAsRead(false);
    }
  };

  // 标记所有通知为已读
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        // 重置全局未读数量
        resetUnreadCount();
        toast({
          title: t('common.success'),
          description: t('api.notifications.markAllReadSuccess'),
        });
        fetchNotifications();
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: t('common.error'),
        description: t('api.notifications.markAllReadError'),
        variant: 'destructive',
      });
    }
  };

  // 打开删除确认弹窗
  const handleOpenDeleteDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDeleteDialog(true);
  };

  // 删除通知
  const handleDeleteNotification = async () => {
    console.log('✅ 开始删除通知:', {
      selectedNotificationId: selectedNotification?.id,
    });
    if (!selectedNotification) {
      console.log('❌ 删除失败: 未选择通知');
      return;
    }
    console.log('✅ 开始删除操作');
    setDeleting(true);
    try {
      const url = `/api/notifications/${selectedNotification.id}`;
      console.log('📡 发送删除请求:', { url, method: 'DELETE' });
      const response = await fetch(url, { method: 'DELETE' });
      console.log('📥 收到删除响应:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
      const result = await response.json();
      console.log('📄 删除响应数据:', result);
      if (result.success) {
        console.log('✅ 删除成功:', result.message);
        // 如果删除的是未读通知，减少未读数量
        if (!selectedNotification.isRead) {
          decrementUnreadCount();
        }
        toast({
          title: t('common.success'),
          description: t('api.notifications.deleteSuccess'),
        });
        setShowDeleteDialog(false);
        setSelectedNotification(null);
        console.log('🔄 刷新通知列表');
        await fetchNotifications();
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
        description: t('api.notifications.deleteError'),
        variant: 'destructive',
      });
    } finally {
      console.log('🏁 删除操作完成，重置加载状态');
      setDeleting(false);
    }
  };

  // 获取通知类型图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline_reminder':
        return <Clock className="text-warning h-5 w-5" />;
      case 'status_update':
        return <Info className="text-info h-5 w-5" />;
      case 'decision_notification':
        return <AlertCircle className="text-success h-5 w-5" />;
      case 'system_alert':
        return <Bell className="text-destructive h-5 w-5" />;
      default:
        return <Bell className="text-muted-foreground h-5 w-5" />;
    }
  };

  // 获取通知类型颜色
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'deadline_reminder':
        return 'secondary';
      case 'status_update':
        return 'secondary';
      case 'decision_notification':
        return 'secondary';
      case 'system_alert':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return t('notifications.justNow');
    } else if (diffInHours < 24) {
      return `${diffInHours} ${t('notifications.hoursAgo')}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${t('notifications.daysAgo')}`;
    }
  };

  // 过滤通知
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
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
            <h1 className="text-3xl font-bold">{t('notifications.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('notifications.description')}
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('notifications.allNotifications')}
                </SelectItem>
                <SelectItem value="unread">
                  {t('notifications.unreadNotifications')}
                </SelectItem>
                <SelectItem value="read">
                  {t('notifications.readNotifications')}
                </SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('notifications.markAllAsRead')}
              </Button>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        {notifications.length > 0 && (
          <div className="mt-8 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {notifications.length}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {t('notifications.total')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {unreadCount}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {t('notifications.unread')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {notifications.length - unreadCount}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {t('notifications.read')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {
                        notifications.filter(
                          (n) => n.type === 'deadline_reminder'
                        ).length
                      }
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {t('notifications.deadlineReminders')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 通知列表 */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                {t('notifications.noNotifications')}
              </h3>
              <p className="text-muted-foreground text-center">
                {filter === 'all'
                  ? t('notifications.noNotificationsDescription')
                  : filter === 'unread'
                    ? t('notifications.noUnreadNotifications')
                    : t('notifications.noReadNotifications')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-shadow hover:shadow-md ${
                  !notification.isRead ? 'border-l-primary border-l-4' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3
                            className={`text-lg font-semibold ${
                              !notification.isRead
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <Badge
                            variant={getNotificationColor(notification.type)}
                          >
                            {t(`notifications.type.${notification.type}`)}
                          </Badge>
                          {!notification.isRead && (
                            <Badge
                              variant="default"
                              className="bg-primary text-primary-foreground"
                            >
                              {t('notifications.new')}
                            </Badge>
                          )}
                        </div>
                        <p
                          className={`mb-3 ${
                            !notification.isRead
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                          <span>{formatTime(notification.createdAt)}</span>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0"
                              onClick={() =>
                                window.open(notification.actionUrl, '_blank')
                              }
                            >
                              {t('notifications.viewDetails')}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleOpenMarkAsReadDialog(notification)
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(notification)}
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

        {/* 删除确认弹窗 */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('notifications.confirmDelete')}</DialogTitle>
              <DialogDescription>
                {t('notifications.deleteWarning')}
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
                onClick={handleDeleteNotification}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    {t('common.deleting')}
                  </>
                ) : (
                  t('common.confirm')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 标记为已读确认弹窗 */}
        <Dialog
          open={showMarkAsReadDialog}
          onOpenChange={setShowMarkAsReadDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('notifications.confirmMarkAsRead')}</DialogTitle>
              <DialogDescription>
                {t('notifications.markAsReadWarning')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowMarkAsReadDialog(false)}
                disabled={markingAsRead}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="default"
                onClick={handleMarkAsRead}
                disabled={markingAsRead}
              >
                {markingAsRead ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    {t('common.markingAsRead')}
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

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
