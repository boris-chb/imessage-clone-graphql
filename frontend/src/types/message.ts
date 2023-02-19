import { MessagePopulated } from '@backend/types/message';

export interface GetMessagesData {
  messages: MessagePopulated[];
}

export interface GetMessagesVariables {
  conversationId: string;
}
