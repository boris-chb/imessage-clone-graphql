import { Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

interface ChatProps {}

const Chat: React.FC<ChatProps> = (props) => {
  return <Button onClick={() => signOut()}>Logout</Button>;
};

export default Chat;
