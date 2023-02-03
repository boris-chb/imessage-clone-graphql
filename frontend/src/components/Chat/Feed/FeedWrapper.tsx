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
import MessageHeader from './Message/MessageHeader';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<FeedWrapperProps> = ({
  session,
}) => {
  const router = useRouter();

  const { conversationId: currentConversationId } = router.query;

  console.log('typeof currentConversationId', typeof currentConversationId);

  return (
    <Flex
      display={{ base: currentConversationId ? 'flex' : 'none', md: 'flex' }}
      width={'100%'}
      direction="column"
    >
      {currentConversationId && typeof currentConversationId === 'string' ? (
        <Flex
          direction={'column'}
          justifyContent="space-between"
          overflow={'hidden'}
          flexGrow={1}
        >
          <MessageHeader
            currentConversationId={currentConversationId}
            userId={session.user.id}
          />
          {/* <Messages /> */}
        </Flex>
      ) : (
        <Text align="center">No conversation selected</Text>
      )}
    </Flex>
  );
};

export default FeedWrapper;
