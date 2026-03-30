import { getSidebarConversations } from '@/src/core/services/conversation.service';
import { getAuthData } from '@/src/infrastructure/supabase';

import { Conversations, SideBarHeader } from './components';

export async function SideBar() {
  const [conversations, authUser] = await Promise.all([
    getSidebarConversations(),
    getAuthData(),
  ]);

  return (
    <>
      <SideBarHeader />
      <Conversations conversations={conversations} userId={authUser!.id} />
    </>
  );
}
