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

        console.log("getConversations query resolver:", conversations);
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
      const { session, prisma } = context;
      const { participantIds } = args;
      console.log(`createConversation(${participantIds} resolver`);

      if (!session?.user) {
        throw new ApolloError("Not Authorized");
      }

      const {
        user: { id: userId },
      } = session;

      console.log("participants Ids", participantIds);
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

        console.log("createConversation mutation resolver", conversation);

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

        console.log("Conversation deleted", deletedConversation);
        console.log(`deleteConversation(${conversationId}) resolver`);
        return { success: true };
      } catch (err: any) {
        console.error("delete Conversation resolver error", err.message);
        return {
          error: err?.message,
        };
      }
    },
  },
  // Subscriptions: {
  // conversationCreated
  // }
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
