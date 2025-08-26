'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { LoadingSpinner } from '@/components/ui/loading';
import { Search, MapPin, GraduationCap, ExternalLink, Eye } from 'lucide-react';
import { University } from '@/types';

function UniversitiesContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [universities, setUniversities] = useState<University[]>([]);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [rankingFilter, setRankingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ranking');

  // 获取大学列表
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/universities');
      const result = await response.json();

      if (result.success) {
        setAllUniversities(result.data);
        setUniversities(result.data);

        // 提取国家列表
        const uniqueCountries: string[] = [
          ...new Set<string>(result.data.map((uni: University) => uni.country)),
        ];
        setCountries(uniqueCountries.sort());
      } else {
        toast({
          title: t('common.error'),
          description: t(result.message),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast({
        title: t('common.error'),
        description: t('api.universities.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  // 过滤和排序大学
  useEffect(() => {
    let filtered = [...allUniversities];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (university) =>
          university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (university.city?.toLowerCase() || '').includes(
            searchTerm.toLowerCase()
          ) ||
          university.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          university.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // 国家过滤
    if (countryFilter && countryFilter !== 'all') {
      filtered = filtered.filter(
        (university) => university.country === countryFilter
      );
    }

    // 排名过滤
    if (rankingFilter && rankingFilter !== 'all') {
      filtered = filtered.filter((university) => {
        if (!university.ranking) return false;

        switch (rankingFilter) {
          case 'top10':
            return university.ranking <= 10;
          case 'top25':
            return university.ranking <= 25;
          case 'top50':
            return university.ranking <= 50;
          case 'top100':
            return university.ranking <= 100;
          case 'top200':
            return university.ranking <= 200;
          case 'other':
            return university.ranking > 200;
          default:
            return true;
        }
      });
    }

    // 排序
    switch (sortBy) {
      case 'ranking':
        filtered.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'acceptanceRate':
        filtered.sort(
          (a, b) => (a.acceptanceRate || 100) - (b.acceptanceRate || 100)
        );
        break;
      default:
        break;
    }

    setUniversities(filtered);
  }, [allUniversities, searchTerm, countryFilter, rankingFilter, sortBy]);

  // 格式化排名
  const formatRanking = (ranking: number | undefined | null) => {
    if (!ranking) return 'N/A';
    if (ranking <= 10) return `#${ranking}`;
    if (ranking <= 50) return `#${ranking}`;
    if (ranking <= 100) return `#${ranking}`;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('universities.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('universities.description')}
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder={t('universities.searchUniversities')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('universities.filterByCountry')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('universities.allCountries')}
                </SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={rankingFilter} onValueChange={setRankingFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('universities.filterByRanking')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('universities.allRankings')}
                </SelectItem>
                <SelectItem value="top10">{t('universities.top10')}</SelectItem>
                <SelectItem value="top25">{t('universities.top25')}</SelectItem>
                <SelectItem value="top50">{t('universities.top50')}</SelectItem>
                <SelectItem value="top100">
                  {t('universities.top100')}
                </SelectItem>
                <SelectItem value="top200">
                  {t('universities.top200')}
                </SelectItem>
                <SelectItem value="other">
                  {t('universities.otherRankings')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">
                  {t('universities.sortByRanking')}
                </SelectItem>
                <SelectItem value="name">
                  {t('universities.sortByName')}
                </SelectItem>
                <SelectItem value="acceptanceRate">
                  {t('universities.sortByAcceptanceRate')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 大学列表 */}
        {universities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                {t('universities.noUniversities')}
              </h3>
              <p className="text-muted-foreground text-center">
                {t('universities.noResults')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => (
              <Card
                key={university.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => router.push(`/universities/${university.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 text-lg">
                        {university.name}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-sm">
                          {university.city}, {university.country}
                        </span>
                      </div>
                    </div>
                    <Badge variant={getRankingColor(university.ranking)}>
                      {formatRanking(university.ranking)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {t('universities.acceptanceRate')}
                      </span>
                      <span className="text-sm font-medium">
                        {formatAcceptanceRate(university.acceptanceRate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {t('universities.tuitionFee')}
                      </span>
                      <span className="text-sm font-medium">
                        {formatTuitionFee(university.tuitionFee)}
                      </span>
                    </div>
                    {university.description && (
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {university.description}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/universities/${university.id}`);
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        {t('universities.viewDetails')}
                      </Button>
                      {university.websiteUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(university.websiteUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function UniversitiesPage() {
  return (
    <ProtectedRoute>
      <UniversitiesContent />
    </ProtectedRoute>
  );
}
