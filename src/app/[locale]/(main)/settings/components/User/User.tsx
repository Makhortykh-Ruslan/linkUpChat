'use client';

import { Avatar, Button, Input, Loader } from '@core/components';
import type { UserDTO } from '@core/dto';
import { useRouter } from '@i18n/routing';
import { useState } from 'react';

import { ChangeAvatarModal } from './components';
import { useUserForm } from './hooks';
import { UserStyles } from './User.styles';

export const User = (userData: UserDTO) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const router = useRouter();

  const {
    translate,
    register,
    errors,
    handleSubmit,
    isDisableSubmit,
    isLoading,
  } = useUserForm(userData);

  const styles = UserStyles;

  return (
    <>
      <form
        data-component="User"
        onSubmit={handleSubmit}
        className={styles.component}
      >
        <h2 className={styles.component_title}>{translate.titles('user')}</h2>

        <div className={styles.component_header}>
          <Avatar
            src={userData.avatarUrl}
            alt={userData.fullName || 'Avatar'}
            size="xl"
          />

          <div className={styles.component_header_info}>
            <p className={styles.component_header_info_title}>
              {userData.fullName}
            </p>
            <p className={styles.component_header_info_description}>
              {userData.email}
            </p>
            <Button
              type="button"
              color="transparent"
              className={styles.component_header_info_btn}
              onClick={() => setIsAvatarModalOpen(true)}
            >
              {translate.button('changeAvatar')}
            </Button>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.component_input}>
          <Input
            leftIcon="user"
            id="fullName"
            label={translate.labels('fullName')}
            placeholder={translate.placeholders('fullName')}
            {...register('fullName')}
            error={
              errors.fullName?.message
                ? translate.validations(errors.fullName?.message)
                : ''
            }
          />
        </div>

        <Input
          leftIcon="email"
          id="email"
          label={translate.labels('email')}
          placeholder={translate.placeholders('email')}
          {...register('email')}
          error={
            errors.email?.message
              ? translate.validations(errors.email?.message)
              : ''
          }
        />

        <Button
          className={styles.component_btn}
          disabled={isDisableSubmit}
          color="blue"
          type="submit"
        >
          {isLoading && <Loader />}
          {isLoading ? translate.button('pending') : translate.button('save')}
        </Button>
      </form>

      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        fullName={userData.fullName}
        avatarUrl={userData.avatarUrl}
        onAvatarUploaded={() => {
          router.refresh();
        }}
      />
    </>
  );
};
