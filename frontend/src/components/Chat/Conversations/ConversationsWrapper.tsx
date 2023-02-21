import { useQuery } from '@apollo/client';
import { ConversationPopulated } from '@backend/types/conversation';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SkeletonLoader from 'src/components/Helper/SkeletonLoader';
import ConversationOperations from 'src/graphql/operations/conversation';
import { GetConversationsData } from 'src/types/conversation';
import ConversationsList from './ConversationsList';

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const {
    data: getConversationsData,
    loading: conversationsLoading,
    error: getConversationsError,
    subscribeToMore,
  } = useQuery<GetConversationsData, { readonly: true }>(
    ConversationOperations.Queries.getConversations,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const router = useRouter();

  const onSelectConversation = async (
    conversationId: string,
    seenLatestMessage: boolean | undefined
  ) => {
    // 1. Push convo to router query params
    router.push({ query: { conversationId } });

    // 2. Mark conversation as "Read"
    if (seenLatestMessage) return;

    // TODO Mark conversation as read Mutation
  };

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
        if (!subscriptionData) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        console.log('New conversation!:', subscriptionData);

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
    '[📁ConversationsWrapper] Conversations:',
    getConversationsData?.conversations
  );

  return (
    <Box
      display={{
        base: router.query.conversationId ? 'none' : 'flex',
        md: 'flex',
      }}
      flexDirection="column"
      width={{ base: '100%', md: '430px' }}
      bg="whiteAlpha.50"
      gap={4}
      py={6}
      px={3}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={5} height="80px" width="360px" />
      ) : (
        <ConversationsList
          conversations={getConversationsData?.conversations}
          onSelectConversation={onSelectConversation}
        />
      )}
    </Box>
  );
};

export default ConversationWrapper;
