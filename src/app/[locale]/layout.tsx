import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingBotWidget } from '@/components/bot/FloatingBotWidget';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'DZ PRIME ACADEMY | منصة تعليمية جزائرية متكاملة',
  description: 'المنصة الأكاديمية الأولى في الجزائر - بوت الامتحانات الذكي، بطاقة العضوية الرقمية، وشبكة سفراء في 58 ولاية.',
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
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#040711] text-slate-900 dark:text-white selection:bg-gold-500 selection:text-navy-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <FloatingBotWidget />
      </body>
    </html>
  );
}
