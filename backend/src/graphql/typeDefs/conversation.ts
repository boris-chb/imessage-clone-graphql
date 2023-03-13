import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Mutation {
    createConversation(participantIds: [String]!): CreateConversationResult
  }

  type Mutation {
    markAsRead(userId: String!, conversationId: String!): Boolean
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

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
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

  type Subscription {
    conversationCreated: Conversation
  }

  type Subscription {
    conversationUpdated: ConversationUpdatedSubscriptionPayload
  }
`;

export default typeDefs;
