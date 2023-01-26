import { GraphQLContext } from "./../../util/types";

const resolvers = {
  Query: {},
  Mutation: {
    createConversation: async () => {
      console.log("conversation resolver backend");
    },
  },
  // Subscriptions: {}
};

export default resolvers;
