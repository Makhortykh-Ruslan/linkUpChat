import type { TAbilityCardProps } from '@app/[locale]/auth/components/AbilityCard/types/t-ability.props';
import { Icon } from '@core/components/Icon/Icon';

import { getAbilityCardStyles } from './AbilityCard.styles';

export const AbilityCard = ({
  iconName,
  title,
  description,
}: TAbilityCardProps) => {
  const styles = getAbilityCardStyles();

  return (
    <div data-component="AbilityCard" className={styles.component}>
      <div className={styles.container}>
        <Icon name={iconName} className={styles.icon}></Icon>

        <p className={styles.title}>{title}</p>
      </div>

      <p className={styles.description}>{description}</p>
    </div>
  );
};
