import type { UserModel } from '@/src/core/models';
import type { TLang, TTheme } from '@/src/core/types';

export type UserDTO = Pick<UserModel, 'id' | 'email'> & {
  fullName: string;
  avatarUrl: string;
  createdAt?: string | undefined;
  language: string;
  theme: TTheme;
  locale: TLang;
  isOnline: boolean;
};
