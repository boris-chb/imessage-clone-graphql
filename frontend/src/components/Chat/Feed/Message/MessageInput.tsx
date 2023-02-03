import { Box, Input } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface MessageInputProps {
  conversationId: string;
}

const MessageInput: React.FunctionComponent<MessageInputProps> = ({
  conversationId,
}: MessageInputProps) => {
  const [messageBody, setMessageBody] = useState('');
  const session = useSession();

  return (
    <Box px={4} py={6} w="100%">
      <form onSubmit={() => {}}>
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Type your message"
          size="md"
          resize={'none'}
          _focus={{
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'whiteAlpha.300',
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
