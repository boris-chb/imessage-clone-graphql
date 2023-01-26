import { gql } from '@apollo/client';

const ConversationOperations = {
  Queries: {},
  Mutations: {
    createConversation: gql`
      mutation CreateConversation() {}
    `,
  },
};

export default ConversationOperations;
