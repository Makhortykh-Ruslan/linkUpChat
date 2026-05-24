'use client';

import { Button, Input, Loader } from '@core/components';
import { appRoutes } from '@core/constants/router-paths';
import { Link } from '@i18n/routing';

import { useSignInForm } from './hooks';
import { getSignInFormStyles } from './SignInFrom.styles';

export const SignInFrom = () => {
  const {
    handleSubmit,
    isDisableSubmit,
    errors,
    register,
    translate,
    isLoading,
  } = useSignInForm();

  const styles = getSignInFormStyles();

  return (
    <section data-component="SignInForm" className={styles.component}>
      <form onSubmit={handleSubmit}>
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

        <Button
          className={styles.component_button}
          disabled={isDisableSubmit}
          color="blue"
          type="submit"
        >
          {isLoading && <Loader />}
          {isLoading ? translate.button('pending') : translate.button('logIn')}
        </Button>
      </form>
      <div className={styles.component_link_container}>
        {translate.descriptions('notHaveAccount')}
        <Link className={styles.component_link} href={appRoutes.auth.signUp}>
          {translate.descriptions('signUp')}
        </Link>
      </div>
    </section>
  );
};
