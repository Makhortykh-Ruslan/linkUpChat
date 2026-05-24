'use client';

import { Icon } from '@core/components';
import type { UserDTO } from '@core/dto';

import { searchedUserStyles } from './SearchedUser.styles';

export type SearchedUserProps = Pick<
  UserDTO,
  'fullName' | 'email' | 'avatarUrl' | 'isOnline'
> & {
  onClick?: () => void;
  ariaLabel?: string;
};

export const SearchedUser = ({
  fullName,
  email,
  avatarUrl,
  isOnline,
  onClick,
  ariaLabel,
}: SearchedUserProps) => {
  const styles = searchedUserStyles;
  const defaultLabel = `Select user ${fullName}`;

  return (
    <button
      type="button"
      data-component="SearchedUser"
      className={styles.button}
      onClick={onClick}
      aria-label={ariaLabel ?? defaultLabel}
    >
      <div className={styles.avatarWrap}>
        {/*<Avatar src={avatarUrl} alt={fullName || 'Avatar'} size="lg" />*/}
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{fullName}</span>
          <span
            className={`${styles.statusDot} ${isOnline ? styles.statusOnline : styles.statusOffline}`}
            aria-hidden
          />
        </div>
        <p className={styles.email}>{email}</p>
      </div>
      <span className={styles.plus} aria-hidden>
        <Icon name="plus" className={styles.plusIcon} />
      </span>
    </button>
  );
};
