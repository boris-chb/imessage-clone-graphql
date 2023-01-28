import { useQuery } from '@apollo/client';
import { Box, Button, Stack } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import ConversationOperations from 'src/graphql/operations/conversation';
import ConversationsList from './ConversationsList';

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  // const {
  //   data: getConversationsData,
  //   loading: getConversationsLoading,
  //   error: getConversationsError,
  // } = useQuery(ConversationOperations.Queries.getConversations);

  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={6} px={3}>
      {/* Skeleton loader */}
      <Stack direction={'column'} height="100%">
        <ConversationsList />
        <Button onClick={() => signOut()}>Logout</Button>
      </Stack>
    </Box>
  );
};

export default ConversationWrapper;
