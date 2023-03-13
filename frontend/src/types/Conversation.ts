import { MessagePopulated } from '@backend/types/message';
import { ConversationPopulated } from '../../../backend/src/types/conversation';

export interface GetConversationsData {
  conversations: Array<ConversationPopulated>;
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    // conversation: Omit<ConversationPopulated, 'latestMessage'> & {
    //   latestMessage: MessagePopulated;
    // };
    conversation: ConversationPopulated;
  };
}

export interface DeleteConversationData {
  deleteConversation: {
    success?: boolean;
    error?: string;
  };
}

export interface DeleteConversationArgs {
  conversationId: string;
}
