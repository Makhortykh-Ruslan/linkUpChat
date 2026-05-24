'use client';

import { Button, Input, Loader } from '@core/components';

import { ChangePasswordStyles } from './ChangePassword.styles';
import { useChangePasswordForm } from './hooks';

export const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isDisableSubmit,
    translate,
  } = useChangePasswordForm();

  const styles = ChangePasswordStyles;

  return (
    <form
      data-component="ChangePassword"
      onSubmit={handleSubmit}
      className={styles.component}
    >
      <h2 className={styles.component_title}>
        {translate.titles('changePassword')}
      </h2>

      <Input
        isPasswordFlow
        id="password"
        leftIcon="lock"
        label={translate.labels('password')}
        placeholder={translate.placeholders('password')}
        {...register('oldPassword')}
        error={
          errors.oldPassword?.message
            ? translate.validations(errors.oldPassword?.message)
            : ''
        }
      />

      <Input
        isPasswordFlow
        id="newPassword"
        leftIcon="lock"
        label={translate.labels('newPassword')}
        placeholder={translate.placeholders('newPassword')}
        {...register('newPassword')}
        error={
          errors.newPassword?.message
            ? translate.validations(errors.newPassword?.message)
            : ''
        }
      />

      <Input
        isPasswordFlow
        id="confirmNewPassword"
        leftIcon="lock"
        label={translate.labels('confirmNewPassword')}
        placeholder={translate.placeholders('confirmNewPassword')}
        {...register('confirmNewPassword')}
        error={
          errors.confirmNewPassword?.message
            ? translate.validations(errors.confirmNewPassword?.message)
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
        {isLoading
          ? translate.button('pending')
          : translate.button('updatePassword')}
      </Button>
    </form>
  );
};
