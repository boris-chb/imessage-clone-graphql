import { useQuery } from '@apollo/client';
import { Flex, Text } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';
import MessageOperations from 'src/graphql/operations/message';
import { GetMessagesData, GetMessagesVariables } from 'src/types/message';

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

  console.log('messages data', data);

  return (
    <Flex direction={'column'} justify="flex-end" overflow={'hidden'}>
      {loading && <Text>Loading messages...</Text>}
      {data?.messages && (
        <Flex direction={'column-reverse'} overflowY="scroll" height={'100%'}>
          {data.messages.map((message) => (
            <div key={message.id}>{message.body}</div>
            // <MessageItem />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default MessageList;
