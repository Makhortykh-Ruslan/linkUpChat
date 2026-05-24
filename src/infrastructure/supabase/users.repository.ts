'use server';

import { EBDTableName } from '@core/enums';
import type { UserModel } from '@core/models';
import type { PostgrestUserResponse } from '@core/types';
import { createClient } from '@infrastructure/supabase/server.supabase';

export async function insertUserRepository(data: Partial<UserModel>) {
  const supabase = await createClient();
  return supabase.from(EBDTableName.USERS).insert(data);
}

export async function getUserByIdRepository(
  userId: string,
): Promise<PostgrestUserResponse> {
  const supabase = await createClient();

  return supabase.from(EBDTableName.USERS).select().eq('id', userId).single();
}

export async function getUsersByIdsRepository(
  userIds: string[],
): Promise<UserModel[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(EBDTableName.USERS)
    .select('*')
    .in('id', userIds);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getUsersBySearchWithoutCurrentUserRepository(
  search: string,
  currentUserId: string,
) {
  const supabase = await createClient();

  return supabase
    .from(EBDTableName.USERS)
    .select('*')
    .neq('id', currentUserId)
    .ilike('user_name', `%${search}%`);
}

export async function updateUserRepository(
  data: Partial<UserModel>,
): Promise<PostgrestUserResponse> {
  const supabase = await createClient();
  return supabase
    .from(EBDTableName.USERS)
    .update(data)
    .eq('id', data.id)
    .select()
    .single();
}
