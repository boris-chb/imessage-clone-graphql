import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationsList from './ConversationsList';

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={6} px={3}>
      {/* Skeleton loader */}
      <ConversationsList session={session} />
    </Box>
  );
};

export default ConversationWrapper;
