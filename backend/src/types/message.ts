import { Prisma } from "@prisma/client";
import { messagePopulated } from "src/graphql/resolvers/message";

export interface SendMessageArgs {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessageSentSubscriptionPayload {
  messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
