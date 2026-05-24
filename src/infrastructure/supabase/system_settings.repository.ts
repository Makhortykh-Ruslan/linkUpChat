'use server';

import { EBDTableName } from '@core/enums';
import type { SystemSettingsModel } from '@core/models';
import type { PostgrestSystemResponse } from '@core/types';
import { createClient } from '@infrastructure/supabase/server.supabase';

export async function insertSystemSettingsRepository(
  model: SystemSettingsModel,
) {
  const supabase = await createClient();

  return supabase.from(EBDTableName.SYSTEM_SETTINGS).insert(model);
}

export async function getSystemSettingByUserIdRepository(
  userId: string,
): Promise<PostgrestSystemResponse> {
  const supabase = await createClient();

  return supabase
    .from(EBDTableName.SYSTEM_SETTINGS)
    .select('*')
    .eq('user_id', userId)
    .single();
}

export async function updateSystemSettingsRepository(
  data: SystemSettingsModel,
) {
  const supabase = await createClient();

  const { user_id, ...updatePayload } = data;

  return supabase
    .from(EBDTableName.SYSTEM_SETTINGS)
    .update(updatePayload)
    .eq('user_id', user_id)
    .select()
    .single();
}
