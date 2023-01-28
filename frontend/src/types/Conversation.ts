// export interface Conversation {}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
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
