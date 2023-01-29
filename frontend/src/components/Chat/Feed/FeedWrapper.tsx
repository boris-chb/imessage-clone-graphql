import { useMutation } from '@apollo/client';
import { Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { IoIosCloseCircleOutline } from 'react-icons/io';
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
  const router = useRouter();

  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      width={'100%'}
      direction="column"
      justify={'center'}
      align="center"
    >
      {conversationId ? (
        <Flex>{conversationId}</Flex>
      ) : (
        <Text align="center">No conversation selected</Text>
      )}
    </Flex>
  );
};

export default FeedWrapper;
