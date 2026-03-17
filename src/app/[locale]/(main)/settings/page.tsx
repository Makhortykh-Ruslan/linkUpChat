import { getUserInfoService } from '@/src/core/services';

import {
  ChangePassword,
  Preferences,
  Session,
  SettingsHeader,
  User,
} from './components';
import { SettingsPageStyles } from './page.styles';

export default async function SettingsPage() {
  const userData = await getUserInfoService();

  if (!userData.success || !userData.data) {
    throw new Error(userData.message || 'Failed to load user');
  }

  const styles = SettingsPageStyles;

  return (
    <section data-compoennt="SettingsPage" className={styles.page}>
      <header className={styles.page_header}>
        <div className={styles.page_header_item}>
          <SettingsHeader />
        </div>
      </header>

      <main className={styles.page_main}>
        <User {...userData.data} />
        <ChangePassword />
        <Preferences {...userData.data} />
        <Session />
      </main>
    </section>
  );
}
