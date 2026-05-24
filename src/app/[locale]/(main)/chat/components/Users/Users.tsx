'use client';

import type { UserModel } from '@core/models';
import { findOrCreateConversation } from '@core/services/conversation.service';
import { useRouter } from 'next/navigation';

type UsersProps = {
  data: UserModel[];
};

export function Users({ data }: UsersProps) {
  const router = useRouter();

  const handleClick = async (user: UserModel): Promise<void> => {
    const conversation_id = await findOrCreateConversation(user.id);
    router.push(`/main/chat/${conversation_id}`);
  };

  return (
    <div data-component="Users">
      {data.map((user) => (
        <div key={user.id} onClick={() => handleClick(user)}>
          {user.user_name}
        </div>
      ))}
    </div>
  );
}
