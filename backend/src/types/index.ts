import { PrismaClient } from "/Users/boris/Code/Projects/iMessage-clone/backend/node_modules/@prisma/client";
import { Session } from "./user";

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub:,
}

export interface TransactionResult {
  success?: boolean;
  error?: string;
}
