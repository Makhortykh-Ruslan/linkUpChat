import type { TTheme } from '@/src/core/types';

export type UserModel = {
  email: string;
  id: string;
  user_name: string;
  avatar_url: string;
  created_at?: string;
  language: string;
  theme: TTheme;
  is_online?: boolean;
};
