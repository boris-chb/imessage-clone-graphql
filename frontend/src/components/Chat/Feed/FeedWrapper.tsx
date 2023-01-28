import { Box, Flex, Text } from '@chakra-ui/react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import UserOperations from 'src/graphql/operations/user';
import ConversationOperations from 'src/graphql/operations/conversation';
import {
  DeleteConversationArgs,
  DeleteConversationData,
} from 'src/types/Conversation';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<FeedWrapperProps> = ({
  session,
}) => {
  const [deleteConversation, { loading, error }] = useMutation<
    DeleteConversationData,
    DeleteConversationArgs
  >(ConversationOperations.Mutations.deleteConversation);

  const router = useRouter();

  const { conversationId } = router.query;
  console.log(conversationId);

  const onDeleteConversation = async () => {
    await deleteConversation({
      variables: {
        conversationId: conversationId as string,
      },
    });

    router.push('/');
  };

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      width={'100%'}
      direction="column"
      justify={'center'}
      align="center"
    >
      {conversationId ? (
        <Flex>
          {conversationId}{' '}
          <IoIosCloseCircleOutline
            size={20}
            cursor={'pointer'}
            onClick={onDeleteConversation}
          />
        </Flex>
      ) : (
        <Text align="center">No conversation selected</Text>
      )}
    </Flex>
  );
};

export default FeedWrapper;
