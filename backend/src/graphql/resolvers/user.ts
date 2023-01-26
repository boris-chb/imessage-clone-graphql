interface GraphQLContext {}

const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ) => {
      const { username } = args;
      console.log(username);
      console.log(context);
      return { success: true };
    },
  },
  //   Subscription: {},
};

export default resolvers;
