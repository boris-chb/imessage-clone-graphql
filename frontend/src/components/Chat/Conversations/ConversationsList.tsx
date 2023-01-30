import { useMutation } from '@apollo/client';
import { ConversationPopulated } from '@backend/types/conversation';
import { Box, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConversationOperations from 'src/graphql/operations/conversation';
import {
  DeleteConversationArgs,
  DeleteConversationData,
} from 'src/types/Conversation';
import ConversationItem from './ConversationItem';
import ConversationsModal from './Modal';

export interface ConversationsListProps {
  conversations?: ConversationPopulated[];
}

const ConversationsList: React.FunctionComponent<ConversationsListProps> = ({
  conversations,
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
    <Box width={'100%'}>
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
        <>
          {conversations?.map((convo) => (
            <ConversationItem
              userId={session.data?.user.id}
              key={convo.id}
              conversation={convo}
              onDeleteConversation={onDeleteConversation}
            />
          ))}
        </>
      ) : (
        <>You have no conversations</>
      )}
    </Box>
  );
};

export default ConversationsList;
