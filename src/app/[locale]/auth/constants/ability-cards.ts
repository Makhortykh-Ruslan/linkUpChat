import type { TAbilityCardProps } from '@app/[locale]/auth/components/AbilityCard/types/t-ability.props';

export const ABILITY_CARDS: TAbilityCardProps[] = [
  {
    iconName: 'message',
    title: 'realTimeChat',
    description: 'instantMessaging',
    id: 'message',
  },
  {
    iconName: 'users',
    title: 'groupChats',
    description: 'collaborateTogether',
    id: 'users',
  },
  {
    iconName: 'secure',
    title: 'secure',
    description: 'endToEndEncrypted',
    id: 'secure',
  },
  {
    iconName: 'flesh',
    title: 'flesh',
    description: 'lightingQuick',
    id: 'flesh',
  },
];
