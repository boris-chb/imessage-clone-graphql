import { GraphQLContext, TransactionResult } from "./../../util/types";

const resolvers = {
  Query: {
    searchUsers: () => {},
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
