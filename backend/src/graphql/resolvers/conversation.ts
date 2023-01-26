import { GraphQLContext } from "./../../util/types";

const resolvers = {
  Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ) => {
      console.log("conversation resolver backend", args);

      // TODO call prisma to create a conversation in mongodb
      return { conversationId: "1" };
    },
  },
  // Subscriptions: {}
};

export default resolvers;
