import { getConversationDetails } from '@core/services';
import { getAuthData, getMessages } from '@infrastructure/supabase';
import type { Metadata } from 'next';

import {
  ConversationFooter,
  ConversationHeader,
  ConversationMessages,
} from './components';
import { ConversationIdStyles } from './conversationId.styles';

type props = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function generateMetadata({ params }: props): Promise<Metadata> {
  const { conversationId } = await params;
  const conversationDetails = await getConversationDetails(conversationId);

  const title = conversationDetails?.title
    ? `${conversationDetails.title} | LinkUp Chat`
    : 'Chat | LinkUp Chat';

  return { title };
}

export default async function ChatPage({ params }: props) {
  const { conversationId } = await params;

  const [messages, conversationDetails, authUser] = await Promise.all([
    getMessages(conversationId),
    getConversationDetails(conversationId),
    getAuthData(),
  ]);

  const styles = ConversationIdStyles;

  if (!conversationDetails) {
    return <div>Conversation not found</div>;
  }

  return (
    <section className={styles.page}>
      <header className={styles.page_header}>
        <ConversationHeader conversationDetails={conversationDetails} />
      </header>
      <main className={styles.page_main}>
        <ConversationMessages
          initialMessages={messages}
          conversationId={conversationId}
          authUserId={authUser!.id}
        />
      </main>
      <footer className={styles.page_footer}>
        <ConversationFooter conversationId={conversationId} />
      </footer>
    </section>
  );
}
