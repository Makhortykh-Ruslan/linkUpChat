'use client';

import { useTranslations } from 'next-intl';

import { Icon, Input, Modal } from '@/src/core/components';

import { UsersModalStyles } from './UsersModal.styles';

type UsersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const UsersModal = ({ isOpen, onClose }: UsersModalProps) => {
  const titles = useTranslations('titles');
  const placeholders = useTranslations('placeholders');
  const styles = UsersModalStyles;

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="fixed">
      <section className={styles.component} data-component="UsersModal">
        <header className={styles.header}>
          <h2 className={styles.title}>{titles('searchUsers')}</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon className={styles.close_icon} name="close" />
          </button>
        </header>
        <main className={styles.main}>
          <div className={styles.input}>
            <Input
              id="search-users"
              type="search"
              placeholder={placeholders('searchUsers')}
              leftIcon="search"
              aria-label={titles('searchUsers')}
            />
          </div>
        </main>
      </section>
    </Modal>
  );
};
