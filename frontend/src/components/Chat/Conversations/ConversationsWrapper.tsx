import { gql, useMutation, useQuery } from '@apollo/client';
import {
  ConversationPopulated,
  ParticipantPopulated,
} from '@backend/types/conversation';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SkeletonLoader from 'src/components/Helper/SkeletonLoader';
import ConversationOperations from 'src/graphql/operations/conversation';
import { GetConversationsData } from 'src/types/conversation';
import ConversationsList from './ConversationsList';

interface ConversationWrapperProps {}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({}) => {
  const session = useSession();
  const router = useRouter();

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

  const [markAsRead] = useMutation<
    { markAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markAsRead);

  const onViewConversation = async (
    conversationId: string,
    seenLatestMessage: boolean | undefined
  ) => {
    // 1. Push convo to router query params
    router.push({ query: { conversationId } });

    // 2. Mark conversation as "Read"
    // if (seenLatestMessage) return;

    // TODO Mark conversation as read Mutation
    try {
      if (!session.data?.user) return;

      await markAsRead({
        variables: { userId: session.data.user.id, conversationId },
        optimisticResponse: { markAsRead: true },
        update: (cache) => {
          // Get conversation.participants from cache
          const participantsFragment = cache.readFragment<{
            participants: ParticipantPopulated[];
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  seenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;
          const participants = [...participantsFragment.participants];
          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === session.data.user.id
          );

          const userParticipant = participants[userParticipantIdx];

          // Update seenLatestMessage to true on participant object
          participants[userParticipantIdx] = {
            ...userParticipant,
            seenLatestMessage: true,
          };

          // Update cache
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.error('onViewConversation error', error);
      toast.error('Could not mark conversation as read');
    }
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
          onViewConversation={onViewConversation}
        />
      )}
      <Button onClick={() => signOut()}>Logout</Button>
    </Box>
  );
};

export default ConversationWrapper;
