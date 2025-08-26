'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  ArrowLeft,
  MapPin,
  Globe,
  DollarSign,
  GraduationCap,
  Star,
  Calendar,
  BookOpen,
  Building,
  Clock,
  Target,
  FileText,
  Plus,
  Eye,
} from 'lucide-react';
import { University, Program } from '@/types';

function UniversityDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [university, setUniversity] = useState<University | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const universityId = params.id as string;

  // 获取大学详情
  const fetchUniversityDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/universities/${universityId}`);
      const result = await response.json();

      if (result.success) {
        setUniversity(result.data);
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
        router.push('/universities');
      }
    } catch (error) {
      console.error('Error fetching university detail:', error);
      toast({
        title: t('common.error'),
        description: t('api.universities.fetchDetailError'),
        variant: 'destructive',
      });
      router.push('/universities');
    } finally {
      setLoading(false);
    }
  };

  // 获取大学专业列表
  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        `/api/universities/${universityId}/programs`
      );
      const result = await response.json();

      if (result.success) {
        setPrograms(result.data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  useEffect(() => {
    if (universityId) {
      fetchUniversityDetail();
      fetchPrograms();
    }
  }, [universityId]);

  // 格式化排名
  const formatRanking = (ranking: number | undefined | null) => {
    if (!ranking) return 'N/A';
    return `#${ranking}`;
  };

  // 获取排名颜色
  const getRankingColor = (ranking: number | undefined | null) => {
    if (!ranking) return 'secondary';
    if (ranking <= 10) return 'destructive';
    if (ranking <= 50) return 'outline';
    if (ranking <= 100) return 'default';
    return 'secondary';
  };

  // 格式化录取率
  const formatAcceptanceRate = (rate: number | undefined | null) => {
    if (!rate) return 'N/A';
    return `${rate}%`;
  };

  // 格式化学费
  const formatTuitionFee = (fee: number | undefined | null) => {
    if (!fee) return 'N/A';
    return `$${fee.toLocaleString()}`;
  };

  // 格式化GPA
  const formatGPA = (gpa: number | undefined | null) => {
    if (!gpa) return 'N/A';
    return gpa.toFixed(1);
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

  if (!university) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {t('universities.universityNotFound')}
            </h1>
            <Button
              onClick={() => router.push('/universities')}
              className="mt-4"
            >
              {t('common.back')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/universities')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        {/* 大学基本信息 */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {university.logoUrl && (
                  <img
                    src={university.logoUrl}
                    alt={university.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{university.name}</h1>
                  <div className="text-muted-foreground mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {university.city}, {university.country}
                      </span>
                    </div>
                    <Badge variant={getRankingColor(university.ranking)}>
                      {formatRanking(university.ranking)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 lg:mt-0">
              {university.websiteUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(university.websiteUrl, '_blank')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {t('universities.visitWebsite')}
                </Button>
              )}
              {/* <Button
                onClick={() =>
                  router.push(`/applications/new?universityId=${university.id}`)
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('universities.applyNow')}
              </Button> */}
            </div>
          </div>
        </div>

        {/* 主要统计信息 */}
        <div className="mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Target className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {t('universities.acceptanceRate')}
                    </p>
                    <p className="text-xl font-bold">
                      {formatAcceptanceRate(university.acceptanceRate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <DollarSign className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {t('universities.tuitionFee')}
                    </p>
                    <p className="text-xl font-bold">
                      {formatTuitionFee(university.tuitionFee)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <GraduationCap className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {t('universities.programs')}
                    </p>
                    <p className="text-xl font-bold">{programs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Star className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {t('universities.ranking')}
                    </p>
                    <p className="text-xl font-bold">
                      {formatRanking(university.ranking)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 详细信息标签页 */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              {t('universities.overview')}
            </TabsTrigger>
            <TabsTrigger value="programs">
              {t('universities.programs')}
            </TabsTrigger>
            <TabsTrigger value="requirements">
              {t('universities.requirements')}
            </TabsTrigger>
          </TabsList>

          {/* 概览标签页 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* 大学描述 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {t('universities.about')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {university.description || t('universities.noDescription')}
                  </p>
                </CardContent>
              </Card>

              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t('universities.basicInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t('universities.location')}
                    </span>
                    <span className="font-medium">
                      {university.city}, {university.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t('universities.ranking')}
                    </span>
                    <Badge variant={getRankingColor(university.ranking)}>
                      {formatRanking(university.ranking)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t('universities.acceptanceRate')}
                    </span>
                    <span className="font-medium">
                      {formatAcceptanceRate(university.acceptanceRate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t('universities.tuitionFee')}
                    </span>
                    <span className="font-medium">
                      {formatTuitionFee(university.tuitionFee)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 专业标签页 */}
          <TabsContent value="programs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {t('universities.availablePrograms')}
              </h3>
              <span className="text-muted-foreground">
                {programs.length} {t('universities.programs')}
              </span>
            </div>

            {programs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {t('universities.noPrograms')}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {t('universities.noProgramsDescription')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {programs.map((program) => (
                  <Card
                    key={program.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {program.name}
                          </CardTitle>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline">
                              {program.degreeType}
                            </Badge>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">
                                {program.duration} {t('universities.years')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {program.tuitionFee && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">
                              {t('universities.tuitionFee')}
                            </span>
                            <span className="text-sm font-medium">
                              {formatTuitionFee(program.tuitionFee)}
                            </span>
                          </div>
                        )}
                        {program.minGpa && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">
                              {t('universities.minGPA')}
                            </span>
                            <span className="text-sm font-medium">
                              {formatGPA(program.minGpa)}
                            </span>
                          </div>
                        )}
                        {program.description && (
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {program.description}
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            router.push(
                              `/universities/${university.id}/programs/${program.id}`
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t('universities.viewProgram')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 申请要求标签页 */}
          <TabsContent value="requirements" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* 学术要求 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t('universities.academicRequirements')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t('universities.minGPA')}
                    </span>
                    <span className="font-medium">3.0+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">SAT</span>
                    <span className="font-medium">1400+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ACT</span>
                    <span className="font-medium">30+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">TOEFL</span>
                    <span className="font-medium">100+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">IELTS</span>
                    <span className="font-medium">7.0+</span>
                  </div>
                </CardContent>
              </Card>

              {/* 申请材料 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('universities.requiredDocuments')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      {t('universities.transcript')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      {t('universities.recommendationLetters')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      {t('universities.personalStatement')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      {t('universities.testScores')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      {t('universities.resume')}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 申请截止日期 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('universities.applicationDeadlines')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold">
                      {t('universities.earlyDecision')}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      November 1, 2025
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold">
                      {t('universities.earlyAction')}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      November 15, 2025
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold">
                      {t('universities.regularDecision')}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      January 15, 2025
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold">
                      {t('universities.rolling')}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {t('universities.ongoing')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default function UniversityDetailPage() {
  return (
    <ProtectedRoute>
      <UniversityDetailContent />
    </ProtectedRoute>
  );
}
