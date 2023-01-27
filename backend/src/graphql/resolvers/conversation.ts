import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { GraphQLContext } from "./../../util/types";

const resolvers = {
  Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { session, prisma } = context;
      const { participantIds } = args;
      console.log("conversation resolver, participants:", participantIds);

      if (!session?.user) {
        throw new ApolloError("Not Authorized");
      }

      const {
        user: { id: userId },
      } = session;

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

        return {
          conversationId: conversation.id,
        };
      } catch (error) {
        console.error("createConversation error", error);
        throw new ApolloError("Error creating conversation");
      }
    },
  },
  // Subscriptions: {
  // conversationCreated
  // }
};

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
