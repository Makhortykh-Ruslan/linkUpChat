'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  ERROR_DEFAULT_RESPONSE_MODEL,
  SUCCESS_DEFAULT_RESPONSE_MODEL,
} from '@/src/core/constants';
import { appRoutes } from '@/src/core/constants/router-paths';
import type { SignInModel, SignUpModel } from '@/src/core/models';
import type { ResponseEmptyModel } from '@/src/core/types';
import {
  insertSystemSettingsRepository,
  insertUserRepository,
  signIn,
  signOut,
  signUp,
} from '@/src/infrastructure/supabase';

export async function signInService(
  _state: ResponseEmptyModel,
  model: SignInModel,
): Promise<ResponseEmptyModel> {
  let redirectPath: string | null = null;

  try {
    const { email, password } = model;

    const { error } = await signIn(email, password);

    if (error) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'authError',
      };
    }

    redirectPath = appRoutes.main.chat;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
    };
  }

  if (redirectPath) {
    revalidatePath(redirectPath);
    redirect(redirectPath);
  }

  return {
    ...SUCCESS_DEFAULT_RESPONSE_MODEL,
    message: '',
  };
}

export async function signUpService(
  _state: ResponseEmptyModel,
  model: SignUpModel,
): Promise<ResponseEmptyModel> {
  let redirectPath: string | null = null;

  try {
    const {
      error: signUpError,
      data: { user },
    } = await signUp(model.email, model.password);

    if (signUpError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'authError',
      };
    }

    const authUserId = user?.id;

    if (!authUserId) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'authError',
      };
    }

    const { error: userError } = await insertUserRepository({
      id: authUserId,
      email: model.email,
      user_name: model.fullName,
      avatar_url: '',
      language: 'en',
      theme: 'light',
    });

    if (userError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'authError',
      };
    }

    const { error: settingsError } = await insertSystemSettingsRepository({
      user_id: authUserId,
      language: 'en',
      theme: 'light',
    });

    if (settingsError) {
      return {
        ...ERROR_DEFAULT_RESPONSE_MODEL,
        message: 'authError',
      };
    }

    redirectPath = appRoutes.main.chat;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ...ERROR_DEFAULT_RESPONSE_MODEL,
      message,
    };
  }

  if (redirectPath) {
    revalidatePath(redirectPath);
    redirect(redirectPath);
  }

  return {
    ...SUCCESS_DEFAULT_RESPONSE_MODEL,
    message: '',
  };
}

export async function signOutService() {
  await signOut();

  const pathRedirect = appRoutes.auth.signIn;

  revalidatePath(pathRedirect);
  redirect(pathRedirect);
}
