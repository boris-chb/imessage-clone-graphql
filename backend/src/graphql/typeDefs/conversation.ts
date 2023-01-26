import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResult
  }

  type CreateConversationResult {
    conversationId: String
  }
`;

export default typeDefs;
