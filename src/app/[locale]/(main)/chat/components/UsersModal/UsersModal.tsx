'use client';

import { useTranslations } from 'next-intl';

import { Icon, Input, Loader, Modal } from '@/src/core/components';
import type { UserDTO } from '@/src/core/dto';

import { SearchedUser } from './components';
import { useUsersSearch } from './hooks';
import { UsersModalStyles } from './UsersModal.styles';

type UsersModalProps = {
  isOpen: boolean;
  onClose: (user?: UserDTO) => void;
};

export const UsersModal = ({ isOpen, onClose }: UsersModalProps) => {
  const titles = useTranslations('titles');
  const placeholders = useTranslations('placeholders');

  const { search, users, isShowLoader, handleSearchChange } = useUsersSearch();

  const styles = UsersModalStyles;

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()} variant="fixed">
      <section className={styles.component} data-component="UsersModal">
        <header className={styles.header}>
          <h2 className={styles.title}>{titles('searchUsers')}</h2>
          <button
            type="button"
            className={styles.close}
            onClick={() => onClose()}
            aria-label="Close"
          >
            <Icon className={styles.close_icon} name="close" />
          </button>
        </header>
        <main className={styles.main}>
          <div className={styles.input}>
            <Input
              id="search-users"
              placeholder={placeholders('searchUsers')}
              leftIcon="search"
              aria-label={titles('searchUsers')}
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          {isShowLoader && (
            <div className={styles.loader}>
              <Loader />
            </div>
          )}
          {!isShowLoader && users.length > 0 && (
            <div className={styles.list}>
              {users.map((user) => (
                <SearchedUser
                  key={user.id}
                  fullName={user.fullName}
                  email={user.email}
                  avatarUrl={user.avatarUrl}
                  isOnline={user.isOnline}
                  onClick={() => onClose(user)}
                />
              ))}
            </div>
          )}
        </main>
      </section>
    </Modal>
  );
};
