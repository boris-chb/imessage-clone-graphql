import { gql } from "apollo-server-core";

const typeDefs = gql`
  type SearchedUser {
    id: String
    username: String
  }

  type Query {
    searchUsers(username: String): [SearchedUser]
  }

  type Mutation {
    createUsername(username: String): TransactionResult
  }

  type TransactionResult {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
