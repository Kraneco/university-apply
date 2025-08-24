import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { ROUTES } from '@/lib/constants';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">{t('home.title')}</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={ROUTES.HOME}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('navigation.home')}
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.UNIVERSITIES}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('navigation.universities')}
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.APPLICATIONS}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('navigation.applications')}
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.PROFILE}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('navigation.profile')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              {t('footer.support')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.help')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-8 border-t pt-8 text-center">
          <p className="text-muted-foreground">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
