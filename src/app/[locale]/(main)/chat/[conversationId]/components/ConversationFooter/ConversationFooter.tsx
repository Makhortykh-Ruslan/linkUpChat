'use client';

import { Button, Icon, Input } from '@core/components';
import { Loader } from '@core/components/Loader/Loader';
import { useActionInterceptor } from '@core/hooks';
import { sendMessageServer } from '@core/services';
import { useTranslations } from 'next-intl';
import React, { startTransition, useState } from 'react';

import { ConversationFooterStyles } from './ConversationFooter.styles';

type Props = {
  conversationId: string;
};

export const ConversationFooter = ({ conversationId }: Props) => {
  const [content, setContent] = useState('');
  const { execute, isPending } = useActionInterceptor(sendMessageServer, {
    onSuccess: () => setContent(''),
  });
  const placeholders = useTranslations('placeholders');
  const styles = ConversationFooterStyles;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    startTransition(() =>
      execute({ content, conversation_id: conversationId }),
    );
  };

  return (
    <form
      data-component="ConversationFooter"
      onSubmit={handleSubmit}
      className={styles.component}
    >
      <Input
        className={styles.component_input}
        id="message"
        placeholder={placeholders('typeMessage')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button
        type="submit"
        disabled={isPending}
        className={styles.component_btn}
      >
        {isPending ? (
          <Loader />
        ) : (
          <Icon className={styles.component_btn_icon} name="message" />
        )}
      </Button>
    </form>
  );
};
