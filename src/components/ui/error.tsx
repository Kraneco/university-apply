'use client';

import Link from 'next/link';
import { Button } from './button';
import { useTranslation } from '@/lib/i18n';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function Error({ title, message, onRetry, className }: ErrorProps) {
  const { t } = useTranslation();

  const defaultTitle = title || t('common.error');
  const defaultMessage = message || t('common.error');
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
      <h2 className="text-foreground mb-2 text-2xl font-semibold">
        {defaultTitle}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">{defaultMessage}</p>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          {t('common.refresh')}
        </Button>
      )}
    </div>
  );
}

export function ErrorPage({ title, message, onRetry }: ErrorProps) {
  const { t } = useTranslation();

  const defaultTitle = title || t('error.pageLoadFailed');
  const defaultMessage = message || t('error.pageLoadFailedDescription');
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Error title={defaultTitle} message={defaultMessage} onRetry={onRetry} />
    </div>
  );
}

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-muted-foreground mb-4 text-6xl font-bold">404</h1>
        <h2 className="text-foreground mb-2 text-2xl font-semibold">
          {t('error.notFound')}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t('error.notFoundDescription')}
        </p>
        <Button asChild>
          <Link href="/">{t('error.backToHome')}</Link>
        </Button>
      </div>
    </div>
  );
}
