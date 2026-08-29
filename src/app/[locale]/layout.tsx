import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { FloatingBotWidget } from '@/components/bot/FloatingBotWidget';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'DZ PRIME ACADEMY • المنصة الأكاديمية الأولى في الجزائر | BAC & Univ 2026',
  description: 'المنصة الأكاديمية الجزائرية الأولى للتحضير للامتحانات والمسابقات - دورات التحضير المباشرة، بوت الامتحانات الذكي، بطاقة العضوية الرقمية، وشبكة سفراء 58 ولاية.',
  icons: {
    icon: '/favicon.ico',
  },
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
        className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B16] text-slate-900 dark:text-white selection:bg-gold-500 selection:text-navy-950 transition-colors duration-300"
      >
        <AppShell>
          {children}
        </AppShell>
        <FloatingBotWidget />
      </body>
    </html>
  );
}
