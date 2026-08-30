import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('dz_prime_locale')?.value;
  const targetLocale =
    savedLocale === 'fr' || savedLocale === 'en' || savedLocale === 'ar'
      ? savedLocale
      : 'ar';

  redirect(`/${targetLocale}`);
}
