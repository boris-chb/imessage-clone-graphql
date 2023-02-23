import { gql } from '@apollo/client';

export const GetMessageFields = `
    id
    sender {
        id
        username
    }
    body
    createdAt
`;

export const MessageOperations = {
  Query: {
    getMessages: gql`
            query Messages($conversationId: String!) {
                messages(conversationId: $conversationId) {
                    ${GetMessageFields}
                }
                
            } 
        `,
  },
  Mutation: {
    sendMessage: gql`
      mutation SendMessage(
        $id: String!
        $conversationId: String!
        $senderId: String!
        $body: String!
      ) {
        sendMessage(
          id: $id
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
  Subscription: {
    messageSent: gql`
        subscription MessageSent($conversationId: String!) {
            messageSent(conversationId: $conversationId) {
                ${GetMessageFields}
            }
        }

    `,
  },
};
