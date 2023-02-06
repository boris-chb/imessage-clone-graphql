import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws";
import { ISODateString } from "next-auth";
import { User } from "./user";

export interface Session {
  user: User;
  expires: ISODateString;
}

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface TransactionResult {
  success?: boolean;
  error?: string;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}
