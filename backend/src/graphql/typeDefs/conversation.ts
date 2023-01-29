import { gql } from "apollo-server-core";

const typeDefs = gql`
  scalar Date

  type Mutation {
    createConversation(participantIds: [String]!): CreateConversationResult
  }

  type CreateConversationResult {
    conversationId: String
  }

  type Message {
    id: String
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    seenLatestMessage: Boolean
  }

  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    deleteConversation(conversationId: String!): TransactionResult
  }
`;

export default typeDefs;
