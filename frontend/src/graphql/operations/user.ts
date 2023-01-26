import { gql } from '@apollo/client';

const UserOperations = {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUser(username: $username) {
          id
          username
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
};

export default UserOperations;
