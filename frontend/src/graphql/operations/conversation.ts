import { gql } from '@apollo/client';

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
        id
        sender {
          id
          username
        }
        body
        createdAt
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
  },
  Subscriptions: {},
};

export default ConversationOperations;
