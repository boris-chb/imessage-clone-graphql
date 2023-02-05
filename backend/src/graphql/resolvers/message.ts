import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { useSession } from "next-auth/react";
import { GraphQLContext } from "src/types";
import {
  MessageSentSubscriptionPayload,
  SendMessageArgs,
} from "src/types/message";

const messageResolvers = {
  Query: {
    // Get messages
    messages: () => {},
  },
  Mutatuion: {
    sendMessage: async (
      _: any,
      args: SendMessageArgs,
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = context;

      // Not signed in
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: currentUserId } = session.user;
      const { id: messageId, conversationId, messageBody, senderId } = args;

      // Can't send messages on behalf of other users
      if (currentUserId !== senderId) {
        throw new GraphQLError("Not authorized");
      }

      try {
        // create new message entity
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body: messageBody,
          },
          include: messagePopulated,
        });

        // update conversation
        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: senderId,
                },
                data: {
                  seenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: senderId,
                  },
                },
                data: {
                  seenLatestMessage: false,
                },
              },
            },
          },
        });

        pubsub.publish("MESSAGE_SENT", { messageSent: newMessage });
        // pubsub.publish("CONVERSATION_UPDATED", {
        //   conversation,
        // });
      } catch (error) {
        throw new GraphQLError("Error creating message", error || undefined);
      }

      return Promise.resolve(true);
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["MESSAGE_SENT"]);
        },
        (
          payload: MessageSentSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export default messageResolvers;
