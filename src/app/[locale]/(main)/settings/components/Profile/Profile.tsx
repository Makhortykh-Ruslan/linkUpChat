'use client';

import { Avatar, Button, Input, Loader } from '@/src/core/components';
import type { ProfileDTO } from '@/src/core/dto';

import { useProfileForm } from './hooks';
import { ProfileStyles } from './Profile.styles';

export const Profile = (profileData: ProfileDTO) => {
  const {
    translate,
    register,
    errors,
    handleSubmit,
    isDisableSubmit,
    isLoading,
  } = useProfileForm(profileData);

  const styles = ProfileStyles;

  return (
    <form onSubmit={handleSubmit} className={styles.component}>
      <h2 className={styles.component_title}>{translate.titles('profile')}</h2>

      <div className={styles.component_header}>
        <Avatar
          src={profileData.avatarUrl}
          alt={profileData.fullName || 'Avatar'}
          size="xl"
        />

        <div className={styles.component_header_info}>
          <p className={styles.component_header_info_title}>
            {profileData.fullName}
          </p>
          <p className={styles.component_header_info_description}>
            {profileData.email}
          </p>
          <Button
            color="transparent"
            className={styles.component_header_info_btn}
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
  );
};
