import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<FeedWrapperProps> = ({
  session,
}) => {
  return <Box border="1px solid red">FeedWrapper</Box>;
};

export default FeedWrapper;
