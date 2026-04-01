'use client';

import Link from 'next/link';

import { useSignUpForm } from '@/src/app/[locale]/auth/(pages)/components/SignUpForm/hooks';
import { Button, Input, Loader } from '@/src/core/components';
import { appRoutes } from '@/src/core/constants/router-paths';

import { getSignUpFormStyles } from './SignUpForm.styles';

export const SignUpForm = () => {
  const {
    handleSubmit,
    isDisableSubmit,
    errors,
    touchedFields,
    register,
    translate,
    isLoading,
  } = useSignUpForm();

  const styles = getSignUpFormStyles();

  return (
    <section data-component="SignUpForm" className={styles.component}>
      <form onSubmit={handleSubmit}>
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

        <div className={styles.component_input}>
          <Input
            leftIcon="email"
            id="userNameOrEmail"
            label={translate.labels('email')}
            placeholder={translate.placeholders('email')}
            {...register('email')}
            error={
              errors.email?.message
                ? translate.validations(errors.email?.message)
                : ''
            }
          />
        </div>

        <div className={styles.component_input}>
          <Input
            isPasswordFlow
            id="password"
            leftIcon="lock"
            label={translate.labels('password')}
            placeholder={translate.placeholders('password')}
            {...register('password')}
            error={
              errors.password?.message
                ? translate.validations(errors.password?.message)
                : ''
            }
          />
        </div>

        <div className={styles.component_input}>
          <Input
            isPasswordFlow
            id="confirmPassword"
            leftIcon="lock"
            label={translate.labels('confirmPassword')}
            placeholder={translate.placeholders('confirmPassword')}
            {...register('confirmPassword')}
            error={
              errors.confirmPassword?.message && touchedFields.confirmPassword
                ? translate.validations(errors.confirmPassword.message as Parameters<typeof translate.validations>[0])
                : ''
            }
          />
        </div>

        <Button
          className={styles.component_button}
          disabled={isDisableSubmit}
          color="blue"
          type="submit"
        >
          {isLoading && <Loader />}
          {isLoading ? translate.button('pending') : translate.button('signUp')}
        </Button>
      </form>

      <div className={styles.component_link_container}>
        {translate.descriptions('haveAccount')}
        <Link className={styles.component_link} href={appRoutes.auth.signIn}>
          {translate.descriptions('signIn')}
        </Link>
      </div>
    </section>
  );
};
