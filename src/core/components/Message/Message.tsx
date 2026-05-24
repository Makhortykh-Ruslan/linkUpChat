import type { MessageDTO } from '@core/dto';
import { formatMessageTime } from '@core/utils';
import { useLocale } from 'next-intl';

import { MessageStyles } from './Message.styles';

type MessageProps = {
  isMine: boolean;
} & MessageDTO;

export const Message = ({ content, createdAt, isMine }: MessageProps) => {
  const local = useLocale();
  const styles = MessageStyles(isMine);

  const time = formatMessageTime(createdAt, local as 'uk' | 'en');

  return (
    <div data-component="Message" className={styles.component}>
      <p className={styles.component_title}>{content}</p>
      <p className={styles.component_time} suppressHydrationWarning>
        {time}
      </p>
    </div>
  );
};
