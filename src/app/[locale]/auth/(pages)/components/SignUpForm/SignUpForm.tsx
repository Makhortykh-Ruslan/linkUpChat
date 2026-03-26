'use client';

import Link from 'next/link';

import { useSignUpForm } from '@/src/app/[locale]/auth/(pages)/components/SignUpForm/hooks';
import { Button, Input, Loader } from '@/src/core/components';
import { appRoutes } from '@/src/core/constants/router-paths';

import { getAuthFormStyles } from '../../styles';

export const SignUpForm = () => {
  const {
    handleSubmit,
    isDisableSubmit,
    errors,
    register,
    translate,
    isLoading,
  } = useSignUpForm();

  const styles = getAuthFormStyles();

  return (
    <section className={styles.component}>
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
