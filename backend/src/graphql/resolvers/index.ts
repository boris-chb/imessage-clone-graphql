import userResolvers from "./user";
import conversationResolvers from "./conversation";

import merge from "lodash.merge";
import messageResolvers from "./message";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers
);

export default resolvers;
