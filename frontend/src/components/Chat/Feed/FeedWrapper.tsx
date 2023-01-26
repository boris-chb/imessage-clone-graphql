import { Session } from 'next-auth';

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FunctionComponent<FeedWrapperProps> = ({
  session,
}) => {
  return <>Feed wrapper</>;
};

export default FeedWrapper;
