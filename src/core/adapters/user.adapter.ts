import type { UserDTO } from '@/src/core/dto';
import type { UserModel } from '@/src/core/models';

export const mapUserToDTO = (data: UserModel): UserDTO => {
  return {
    ...data,
    id: data.id,
    email: data.email,
    createdAt: data.created_at,
    fullName: data.user_name,
    avatarUrl: data.avatar_url,
    isOnline: data.is_online ?? false,
  };
};
