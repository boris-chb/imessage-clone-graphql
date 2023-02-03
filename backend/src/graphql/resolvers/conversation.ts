import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { GraphQLContext, TransactionResult } from "../../types";
import { ConversationPopulated } from "src/types/conversation";
import { withFilter } from "graphql-subscriptions";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { prisma, session } = context;

      if (!session?.user) throw new GraphQLError("Not authorized");

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
        throw new GraphQLError("Not Authorized");
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
        throw new GraphQLError("Error creating conversation");
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
        console.log(
          "[📁conversation.ts:132] conversationPopulated after deleting:",
          conversationPopulated
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
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          // Access pubsub to emit event
          const { pubsub } = context;

          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _,
          context: GraphQLContext
        ) => {
          // Filter which users to emit event to
          const { session } = context;
          const {
            conversationCreated: { participants },
          } = payload;

          const isConversationParticipant = !!participants.find(
            (p) => p.userId === session?.user.id
          );

          return isConversationParticipant;
        }
      ),
    },
  },
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

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
