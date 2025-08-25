'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Save,
  X,
  Upload,
  Trash2,
} from 'lucide-react';
import { User as UserType } from '@/types';

interface BasicInfoTabProps {
  user: UserType;
}

export function BasicInfoTab({ user }: BasicInfoTabProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    bio: (user as any).bio || '',
    backupEmail: (user as any).backupEmail || '',
    emergencyContact: (user as any).emergencyContact || '',
    website: (user as any).website || '',
  });

  // 获取用户头像的初始字母
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
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
          description: t('settings.profile.saveSuccess'),
        });
        setIsEditing(false);
      } else {
        toast({
          title: t('common.error'),
          description: t('settings.profile.saveError'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t('common.error'),
        description: t('settings.profile.saveError'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      bio: (user as any).bio || '',
      backupEmail: (user as any).backupEmail || '',
      emergencyContact: (user as any).emergencyContact || '',
      website: (user as any).website || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* 个人信息卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{t('settings.profile.personalInfo')}</span>
          </CardTitle>
          {/* {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('settings.profile.editProfile')}
            </Button>
          )} */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 头像部分 */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {/* <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                {t('settings.profile.uploadAvatar')}
              </Button>
              {user.avatarUrl && (
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('settings.profile.removeAvatar')}
                </Button>
              )}
            </div> */}
          </div>

          {/* 基本信息表单 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.profile.name')}</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t('settings.profile.name')}
                />
              ) : (
                <div className="bg-muted flex items-center space-x-2 rounded p-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span>{user.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.profile.email')}</Label>
              <div className="bg-muted flex items-center space-x-2 rounded p-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span>{user.email}</span>
                <Badge variant="secondary" className="text-xs">
                  主要邮箱
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder={t('settings.profile.phone')}
                />
              ) : (
                <div className="bg-muted flex items-center space-x-2 rounded p-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span>{user.phone || '未设置'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupEmail">
                {t('settings.profile.backupEmail')}
              </Label>
              {isEditing ? (
                <Input
                  id="backupEmail"
                  value={formData.backupEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, backupEmail: e.target.value })
                  }
                  placeholder={t('settings.profile.backupEmail')}
                />
              ) : (
                <div className="bg-muted flex items-center space-x-2 rounded p-2">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span>{(user as any).backupEmail || '未设置'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">{t('settings.profile.address')}</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder={t('settings.profile.address')}
                />
              ) : (
                <div className="bg-muted flex items-center space-x-2 rounded p-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{user.address || '未设置'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">{t('settings.profile.bio')}</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder={t('settings.profile.bio')}
                  rows={3}
                />
              ) : (
                <div className="bg-muted rounded p-2">
                  <span>{(user as any).bio || '未设置个人简介'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t('settings.profile.website')}</Label>
              {isEditing ? (
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder={t('settings.profile.website')}
                />
              ) : (
                <div className="bg-muted flex items-center space-x-2 rounded p-2">
                  <Globe className="text-muted-foreground h-4 w-4" />
                  <span>{(user as any).website || '未设置'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">
                {t('settings.profile.emergencyContact')}
              </Label>
              {isEditing ? (
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: e.target.value,
                    })
                  }
                  placeholder={t('settings.profile.emergencyContact')}
                />
              ) : (
                <div className="bg-muted flex items-center space-x-2 rounded p-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span>{(user as any).emergencyContact || '未设置'}</span>
                </div>
              )}
            </div>
          </div>

          {/* 编辑操作按钮 */}
          {isEditing && (
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                {t('settings.profile.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving
                  ? t('common.saving')
                  : t('settings.profile.saveChanges')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
