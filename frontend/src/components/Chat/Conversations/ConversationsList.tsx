import { useMutation } from '@apollo/client';
import { ConversationPopulated } from '@backend/types/conversation';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import { useState } from 'react';
import ConversationOperations from 'src/graphql/operations/conversation';
import {
  DeleteConversationArgs,
  DeleteConversationData,
} from 'src/types/conversation';
import ConversationItem from './ConversationItem';
import ConversationsModal from './Modal';

export interface ConversationsListProps {
  conversations?: ConversationPopulated[];
  onSelectConversation: (
    conversationId: string,
    seenLatestMessage: boolean | undefined
  ) => void;
}

const ConversationsList: React.FunctionComponent<ConversationsListProps> = ({
  conversations,
  onSelectConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const session = useSession();

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [
    deleteConversation,
    { loading: deleteConversationLoading, error: deleteConversationError },
  ] = useMutation<DeleteConversationData, DeleteConversationArgs>(
    ConversationOperations.Mutations.deleteConversation
  );

  const onDeleteConversation = async (convId: string) => {
    await deleteConversation({
      variables: {
        conversationId: convId,
      },
    });

    router.push('/');
  };

  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      position="relative"
      height="100%"
      overflow="hidden"
    >
      <Box
        py={2}
        px={4}
        mb={4}
        bg={'blackAlpha.300'}
        borderRadius={4}
        cursor={'pointer'}
        onClick={onOpen}
      >
        <Text textAlign={'center'} color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Box>
      <ConversationsModal isOpen={isOpen} onClose={onClose} />
      {conversations?.length !== 0 ? (
        <Stack gap={1}>
          {conversations?.map((convo) => {
            // const participant = conversations.participants.find(
            //   (p) => p.user.id === userId
            // );

            return (
              <ConversationItem
                currentUserId={session.data?.user.id as string}
                key={convo.id}
                conversation={convo}
                onDeleteConversation={onDeleteConversation}
                isSelected={convo.id === router.query.conversationId}
                // TODO seenLastMessage:
                onClick={() => onSelectConversation(convo.id, true)}
                seenLatestMessage={false}
              />
            );
          })}
        </Stack>
      ) : (
        <>You have no conversations</>
      )}
    </Box>
  );
};

export default ConversationsList;
