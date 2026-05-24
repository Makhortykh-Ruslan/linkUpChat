import type { TTheme } from '@core/types';
import {
  getAuthData,
  getSystemSettingByUserIdRepository,
} from '@infrastructure/supabase';

export async function getMessages(locale: string) {
  return (await import(`../../../../messages/${locale}.json`)).default;
}

export async function appConfig(urlLocale: string) {
  const authUser = await getAuthData();

  let theme: TTheme = 'light';
  let dbLocale = urlLocale;

  if (authUser) {
    const { data: profile } = await getSystemSettingByUserIdRepository(
      authUser.id,
    );

    if (profile) {
      theme = profile.theme;
      dbLocale = profile.language;
    }
  }

  const messages = await getMessages(urlLocale);

  return {
    theme,
    dbLocale,
    messages,
  };
}
