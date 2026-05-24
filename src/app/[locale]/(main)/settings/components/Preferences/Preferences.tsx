'use client';

import { Select, Toggle } from '@core/components';
import { DEFAULT_SELECTED_LANG, LANGUAGES_MOCK } from '@core/constants';
import { useThemeContext } from '@core/context';
import type { UserDTO } from '@core/dto';
import { updateSystemService } from '@core/services';
import type { TIdName } from '@core/types';
import { usePathname, useRouter } from '@i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PreferencesStyles } from './Preferences.styles';

export const Preferences = (userData: UserDTO) => {
  const titles = useTranslations('titles');
  const descriptions = useTranslations('descriptions');
  const placeholders = useTranslations('placeholders');

  const pathname = usePathname();
  const router = useRouter();

  const foundLang =
    LANGUAGES_MOCK.find((el) => el.id === userData.language) ||
    DEFAULT_SELECTED_LANG;

  const { changeTheme, theme } = useThemeContext();
  const [toggle, setToggle] = useState(theme === 'dark');
  const [language, setLanguage] = useState<TIdName<string, string> | null>(
    foundLang,
  );

  const handleToggleChange = async (isDark: boolean) => {
    setToggle(isDark);
    const newTheme = isDark ? 'dark' : 'light';
    changeTheme(newTheme);

    if (language && newTheme) {
      await updateSystemService({
        language: language.id,
        theme: newTheme,
        user_id: userData.id,
      });
    }
  };

  const handleChangeLanguages = async (value: TIdName<string, string>) => {
    setLanguage(value);

    if (value && theme) {
      await updateSystemService({
        language: value.id,
        theme,
        user_id: userData.id,
      });
    }

    router.replace({ pathname }, { locale: value.id, scroll: false });
  };

  const styles = PreferencesStyles;

  return (
    <section data-component="Preferences" className={styles.component}>
      <h2 className={styles.component_title}>{titles('preferences')}</h2>

      <Select value={language} onChange={handleChangeLanguages}>
        <Select.Trigger placeholder={placeholders('chooseLang')} />
        <Select.Content>
          {LANGUAGES_MOCK.map((el) => (
            <Select.Option key={el.id} value={el}>
              {el.value}
            </Select.Option>
          ))}
        </Select.Content>
      </Select>

      <div className={styles.component_row}>
        <div>
          <p className={styles.component_subtitle}>{titles('darkMode')}</p>
          <p className={styles.component_description}>
            {descriptions('darkModeDescription')}
          </p>
        </div>

        <Toggle value={toggle} onChange={handleToggleChange} />
      </div>
    </section>
  );
};
