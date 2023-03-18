"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = require("graphql-tag");
var typeDefs = (0, graphql_tag_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  scalar Date\n\n  type Mutation {\n    createConversation(participantIds: [String]!): CreateConversationResult\n  }\n\n  type Mutation {\n    markAsRead(userId: String!, conversationId: String!): Boolean\n  }\n\n  type CreateConversationResult {\n    conversationId: String\n  }\n\n  type Message {\n    id: String\n  }\n\n  type Conversation {\n    id: String\n    latestMessage: Message\n    participants: [Participant]\n    createdAt: Date\n    updatedAt: Date\n  }\n\n  type ConversationUpdatedSubscriptionPayload {\n    conversation: Conversation\n  }\n\n  type Participant {\n    id: String\n    user: User\n    seenLatestMessage: Boolean\n  }\n\n  type Query {\n    conversations: [Conversation]\n  }\n\n  type Mutation {\n    deleteConversation(conversationId: String!): TransactionResult\n  }\n\n  type Subscription {\n    conversationCreated: Conversation\n  }\n\n  type Subscription {\n    conversationUpdated: ConversationUpdatedSubscriptionPayload\n  }\n"], ["\n  scalar Date\n\n  type Mutation {\n    createConversation(participantIds: [String]!): CreateConversationResult\n  }\n\n  type Mutation {\n    markAsRead(userId: String!, conversationId: String!): Boolean\n  }\n\n  type CreateConversationResult {\n    conversationId: String\n  }\n\n  type Message {\n    id: String\n  }\n\n  type Conversation {\n    id: String\n    latestMessage: Message\n    participants: [Participant]\n    createdAt: Date\n    updatedAt: Date\n  }\n\n  type ConversationUpdatedSubscriptionPayload {\n    conversation: Conversation\n  }\n\n  type Participant {\n    id: String\n    user: User\n    seenLatestMessage: Boolean\n  }\n\n  type Query {\n    conversations: [Conversation]\n  }\n\n  type Mutation {\n    deleteConversation(conversationId: String!): TransactionResult\n  }\n\n  type Subscription {\n    conversationCreated: Conversation\n  }\n\n  type Subscription {\n    conversationUpdated: ConversationUpdatedSubscriptionPayload\n  }\n"])));
exports.default = typeDefs;
var templateObject_1;