import { ApolloError } from "apollo-server-core";
import { Prisma } from "@prisma/client";
import { GraphQLContext, TransactionResult } from "../../types";
import { ConversationPopulated } from "src/types/conversation";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { prisma, session } = context;

      if (!session?.user) throw new ApolloError("Not authorized");

      const {
        user: { id: userId },
      } = session;
      try {
        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: userId,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        // let filteredConversations = conversations.filter(
        //   (conversation) =>
        //     !!conversation.participants.find((p) => p.userId === userId)
        // );

        console.log(
          "[📁conversation.ts:40] conversations  === ",
          conversations
        );
        return conversations;
      } catch (error: any) {
        console.error(error);
        throw new GraphQLError("Could not get conversations");
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { session, prisma, pubsub } = context;
      const { participantIds } = args;

      if (!session?.user) {
        throw new ApolloError("Not Authorized");
      }

      const {
        user: { id: userId },
      } = session;
      console.log(
        "[📁conversation.ts:67] participantIds  === ",
        participantIds
      );
      // Call db
      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  seenLatestMessage: id === userId,
                })),
              },
            },
          },
          // data to get back after creating a conversation
          include: conversationPopulated,
        });

        // emit a CONVERSATION_CREATED event using pubsub
        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });

        console.log("CONVERSATION_CREATED published", conversation);

        return {
          conversationId: conversation.id,
        };
      } catch (error) {
        console.error("createConversation error", error);
        throw new ApolloError("Error creating conversation");
      }
    },
    deleteConversation: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<TransactionResult> => {
      const { prisma } = context;
      const { conversationId } = args;

      try {
        // find conversation to delete
        // const conversation = await prisma.conversation.findUnique({
        //   where: { id: conversationId },
        //   // TODO: protect route
        // });
        // delete conversation

        const deletedConversation = await prisma.conversation.delete({
          where: { id: conversationId },
        });

        if (!deletedConversation)
          return { success: false, error: "Error deleting conversation" };

        console.log(
          "[📁conversation.ts:125] deletedConversation  === ",
          deletedConversation
        );
        return { success: true };
      } catch (err: any) {
        console.error("delete Conversation resolver error", err.message);
        return {
          error: err?.message,
        };
      }
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;

        return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
      },
    },
  },
};

// Generate TypeScript Types
export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: { select: { id: true, username: true } },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: { sender: { select: { id: true, username: true } } },
    },
  });

export default resolvers;
