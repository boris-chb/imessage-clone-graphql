import { useQuery } from '@apollo/client';
import { Flex, Stack, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SkeletonLoader from 'src/components/Helper/SkeletonLoader';
import { MessageOperations } from 'src/graphql/operations/message';
import {
  GetMessagesData,
  GetMessagesVariables,
  MessageSubscriptionData,
} from 'src/types/message';
import MessageItem from './MessageItem';

interface MessageListProps {
  userId: string;
  conversationId: string;
}

const MessageList: React.FC<MessageListProps> = ({
  userId,
  conversationId,
}) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    GetMessagesData,
    GetMessagesVariables
  >(MessageOperations.Query.getMessages, {
    variables: { conversationId },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

    return () => unsubscribe();
  }, [conversationId]);

  const subscribeToMoreMessages = (conversationId: string) =>
    subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
      variables: { conversationId },
    });

  return (
    <Flex direction={'column'} justify="flex-end" overflow={'hidden'}>
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        // Make message container scrollable vertically
        <Flex direction={'column-reverse'} overflowY="scroll" height={'100%'}>
          {data.messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default MessageList;
