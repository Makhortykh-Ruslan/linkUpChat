'use server';

import { EStorageBucketName } from '@core/enums';
import { createClient } from '@infrastructure/supabase/server.supabase';

export async function uploadAvatarRepository(
  userId: string,
  file: File,
): Promise<{ publicUrl: string } | { error: string }> {
  const supabase = await createClient();
  const path = `${userId}/avatar.png`;

  const { error } = await supabase.storage
    .from(EStorageBucketName.AVATARS)
    .upload(path, file, { upsert: true });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(EStorageBucketName.AVATARS).getPublicUrl(path);

  return { publicUrl };
}

export async function removeAvatarRepository(
  userId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const path = `${userId}/avatar.png`;

  const { error } = await supabase.storage
    .from(EStorageBucketName.AVATARS)
    .remove([path]);

  if (error) {
    return { error: error.message };
  }
  return {};
}
