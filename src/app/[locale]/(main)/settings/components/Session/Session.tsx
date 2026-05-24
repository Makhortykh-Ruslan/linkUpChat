'use client';

import { Button, Loader } from '@core/components';
import { signOutService } from '@core/services';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

import { SessionStyles } from './Session.styles';

export const Session = () => {
  const titles = useTranslations('titles');
  const button = useTranslations('button');
  const descriptions = useTranslations('descriptions');

  const [state, formAction, isPending] = useActionState(signOutService, null);

  const styles = SessionStyles;

  return (
    <form
      data-component="Session"
      action={formAction}
      className={styles.component}
    >
      <h2 className={styles.component_title}>{titles('session')}</h2>
      <p className={styles.component_description}>
        {descriptions('signOutDescription')}
      </p>

      <Button color="red" type="submit">
        {isPending && <Loader />}
        {isPending ? '' : button('signOut')}
      </Button>
    </form>
  );
};
