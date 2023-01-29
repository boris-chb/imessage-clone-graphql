import { useQuery } from '@apollo/client';
import { Box, Button, Stack } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import ConversationOperations from 'src/graphql/operations/conversation';
import { GetConversationsData } from 'src/types/Conversation';
import ConversationsList from './ConversationsList';

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const {
    data: getConversationsData,
    loading: getConversationsLoading,
    error: getConversationsError,
  } = useQuery<GetConversationsData, null>(
    ConversationOperations.Queries.getConversations,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  console.log('conversations: ', getConversationsData?.conversations);

  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={6} px={3}>
      {/* Skeleton loader */}
      <Stack direction={'column'} height="100%">
        {getConversationsData?.conversations ? (
          <ConversationsList
            conversations={getConversationsData?.conversations}
          />
        ) : (
          <>Select a conversation</>
        )}
        <Button onClick={() => signOut()}>Logout</Button>
      </Stack>
    </Box>
  );
};

export default ConversationWrapper;
