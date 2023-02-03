import { useQuery } from '@apollo/client';
import { Button, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ConversationOperations from '../../../../graphql/operations/conversation';
import { formatUsernames } from '../../../../util/functions';
import { GetConversationsData } from '../../../../types/Conversation';
// import SkeletonLoader from "../../../common/SkeletonLoader";

interface MessageHeaderProps {
  userId: string;
  currentConversationId: string;
}

const MessageHeader: React.FunctionComponent<MessageHeaderProps> = ({
  userId,
  currentConversationId,
}) => {
  const router = useRouter();
  const { data, loading } = useQuery<GetConversationsData, null>(
    ConversationOperations.Queries.getConversations
  );

  const currentConversation = data?.conversations.find(
    (conversation) => conversation.id === currentConversationId
  );

  if (data?.conversations && !loading && !currentConversation) {
    router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  }

  return (
    <Stack
      direction={'row'}
      align="center"
      spacing={6}
      py={5}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor={'whiteAlpha.200'}
    >
      <Button
        display={{ md: 'none' }}
        onClick={() => {
          router.replace('?conversationId', '/', { shallow: true });
        }}
      >
        Back
      </Button>
      {!currentConversation && !loading && <Text>No conversation found</Text>}
      {currentConversation && (
        <Stack direction={'row'}>
          <Text color="whatsapp.600">To: </Text>
          <Text fontWeight={600}>
            {formatUsernames(currentConversation.participants, userId)}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default MessageHeader;
