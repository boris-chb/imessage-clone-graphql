import { gql } from '@apollo/client';
import { GetMessageFields } from './message';

const GetConversationsFileds = `
      id
      participants {
        user {
          id
          username
        }
        seenLatestMessage
      }
      latestMessage {
        ${GetMessageFields}
      }
      updatedAt
`;

const ConversationOperations = {
  Queries: {
    getConversations: gql`
      query getConversations {
        conversations {
          ${GetConversationsFileds}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
    deleteConversation: gql`
      mutation DeleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId) {
          success
          error
        }
      }
    `,
    markAsRead: gql`
      mutation MarkAsRead($userId: String!, $conversationId: String!) {
        markAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription conversationCreated {
      conversationCreated
       {
       ${GetConversationsFileds}
       }
      }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
      conversationUpdated {
        conversation {
        ${GetConversationsFileds}
        }
      }
    }
    `,
  },
};

export default ConversationOperations;
