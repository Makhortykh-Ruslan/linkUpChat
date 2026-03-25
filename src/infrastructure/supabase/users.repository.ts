'use server';

import { EBDTableName } from '@/src/core/enums';
import type { UserModel } from '@/src/core/models';
import type { PostgrestUserResponse } from '@/src/core/types';
import { createClient } from '@/src/infrastructure/supabase/server.supabase';

export async function insertUserRepository(data: UserModel) {
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
