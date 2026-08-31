import type { Metadata, Viewport } from 'next';
import { DashboardShell } from '@/components/layout/DashboardShell';
import '../globals.css';

export const metadata: Metadata = {
  title: 'DZ PRIME ACADEMY | منصة تعليمية جزائرية متكاملة',
  description: 'المنصة الأكاديمية الأولى في الجزائر - بوت الامتحانات الذكي، بطاقة العضوية الرقمية، وشبكة سفراء في 58 ولاية.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = locale === 'ar';

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedLocale = localStorage.getItem('dz_prime_locale');
                  if (savedLocale) {
                    document.cookie = "dz_prime_locale=" + savedLocale + "; path=/; max-age=31536000; SameSite=Lax";
                  }
                  var savedTheme = localStorage.getItem('dz_prime_theme');
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F4F6FA] dark:bg-[#040817] text-slate-900 dark:text-white selection:bg-gold-500 selection:text-navy-950 transition-colors duration-300"
      >
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
