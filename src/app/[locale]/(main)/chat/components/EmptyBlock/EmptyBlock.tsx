import { Icon } from '@core/components';
import { getTranslations } from 'next-intl/server';

import { emptyBlockStyles } from './EmptyBlock.styles';

type Props = {
  locale: string;
  titleKey: string;
  descriptionKey: string;
};

export const EmptyBlock = async ({
  titleKey,
  descriptionKey,
  locale,
}: Props) => {
  const titles = await getTranslations({ locale, namespace: 'titles' });
  const descriptions = await getTranslations({
    locale,
    namespace: 'descriptions',
  });

  const styles = emptyBlockStyles();

  return (
    <section data-component="EmptyBlock" className={styles.component}>
      <div className={styles.component_icon_container}>
        <Icon name="users" className={styles.component_icon} />
      </div>
      <h2 className={styles.component_title}>{titles(titleKey)}</h2>
      <p className={styles.component_description}>
        {descriptions(descriptionKey)}
      </p>
    </section>
  );
};
