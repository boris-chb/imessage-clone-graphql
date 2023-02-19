import { Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

import MessageHeader from './Message/MessageHeader';
import MessageInput from './Message/MessageInput';
import MessageList from './Message/MessageList';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<FeedWrapperProps> = ({
  session,
}) => {
  const router = useRouter();

  const { conversationId: currentConversationId } = router.query;
  const {
    user: { id: currentUserId },
  } = session;

  console.log('typeof currentConversationId', typeof currentConversationId);

  return (
    <Flex
      display={{ base: currentConversationId ? 'flex' : 'none', md: 'flex' }}
      width={'100%'}
      direction="column"
    >
      {currentConversationId && typeof currentConversationId === 'string' ? (
        <>
          <Flex
            direction={'column'}
            justifyContent="space-between"
            overflow={'hidden'}
            flexGrow={1}
          >
            <MessageHeader
              currentConversationId={currentConversationId}
              userId={currentUserId}
            />
            <MessageList
              conversationId={currentConversationId}
              userId={currentUserId}
            />
          </Flex>
          <MessageInput conversationId={currentConversationId} />
        </>
      ) : (
        <Text align="center">No conversation selected</Text>
      )}
    </Flex>
  );
};

export default FeedWrapper;
