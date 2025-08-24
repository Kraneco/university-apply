'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  GraduationCap,
  Search,
  FileText,
  Bell,
  TrendingUp,
  Users,
  Globe,
  Award,
  Clock,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Search,
      title: t('home.features.search.title'),
      description: t('home.features.search.description'),
    },
    {
      icon: FileText,
      title: t('home.features.documents.title'),
      description: t('home.features.documents.description'),
    },
    {
      icon: Bell,
      title: t('home.features.tracking.title'),
      description: t('home.features.tracking.description'),
    },
    {
      icon: TrendingUp,
      title: t('home.features.analysis.title'),
      description: t('home.features.analysis.description'),
    },
  ];

  const stats = [
    { number: '1000+', label: t('home.stats.universities'), icon: Globe },
    { number: '50,000+', label: t('home.stats.cases'), icon: Award },
    { number: '95%', label: t('home.stats.satisfaction'), icon: Users },
    { number: '24/7', label: t('home.stats.support'), icon: Clock },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <GraduationCap className="h-20 w-20" />
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push(ROUTES.REGISTER)}
                className="px-8 py-3 text-lg"
              >
                {t('home.getStarted')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push(ROUTES.LOGIN)}
                className="border-white bg-transparent px-8 py-3 text-lg text-white hover:bg-white hover:text-blue-600"
              >
                {t('home.loginAccount')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t('home.whyChooseUs')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              {t('home.whyChooseUsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-4 flex justify-center">
                    <feature.icon className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <stat.icon className="h-12 w-12 text-blue-600" />
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            {t('home.cta.title')}
          </h2>
          <p className="mb-8 text-xl">{t('home.cta.subtitle')}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push(ROUTES.REGISTER)}
              className="px-8 py-3 text-lg"
            >
              {t('home.cta.freeRegister')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent px-8 py-3 text-lg text-white hover:bg-white hover:text-blue-600"
            >
              {t('home.learnMore')}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
