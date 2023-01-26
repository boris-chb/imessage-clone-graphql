import { Button } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<FeedWrapperProps> = ({
  session,
}) => {
  return <Button onClick={() => signOut()}>Logout</Button>;
};

export default FeedWrapper;
