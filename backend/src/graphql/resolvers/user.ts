import { GraphQLContext, TransactionResult } from "../../types";
import { ApolloError } from "apollo-server-core";
import { User } from "@prisma/client";

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> => {
      const { username: searchedUsername } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        throw new ApolloError("Not authorized");
      }

      // get the currently signed in user to filter out during search
      const {
        user: { username: currentUsername },
      } = session;

      // query db
      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: currentUsername,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error: any) {
        console.error("searchUser backend resolver", error);
        throw new ApolloError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<TransactionResult> => {
      const { username } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const { id: userId } = session.user;

      try {
        // Check that username is not taken
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser)
          return { error: "Username already taken. Please try another" };

        // Update username

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return { success: true };
      } catch (err: any) {
        console.error(err);
        return {
          error: err?.message,
        };
      }
    },
  },
  //   Subscription: {},
};

export default resolvers;
