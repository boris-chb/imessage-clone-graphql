import { useQuery } from '@apollo/client';
import { ConversationPopulated } from '@backend/types/conversation';
import { Box, Button, Stack } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
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
    subscribeToMore,
  } = useQuery<GetConversationsData, null>(
    ConversationOperations.Queries.getConversations,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData?: {
            data: {
              conversationCreated: ConversationPopulated;
            };
          };
        }
      ) => {
        console.log(
          '=== subscriptionData ConversationsWrapper.tsx [48] ===',
          subscriptionData
        );
        if (!subscriptionData) return prev;
        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);
  console.log(
    '[📁ConversationsWrapper.tsx:65] getConversationsData?.conversations  === ',
    getConversationsData?.conversations
  );

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
