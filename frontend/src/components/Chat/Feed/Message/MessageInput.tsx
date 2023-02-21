import { useMutation } from '@apollo/client';
import { SendMessageArgs } from '@backend/types/message';
import { Box, Input } from '@chakra-ui/react';
import ObjectID from 'bson-objectid';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import MessageOperations from 'src/graphql/operations/message';

interface MessageInputProps {
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [messageBody, setMessageBody] = useState('');
  const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessageArgs>(
    MessageOperations.Mutation.sendMessage,
    {
      onError: (e) => {
        toast.error('sendMessage useMutation failed');
        console.error(e);
      },
    }
  );

  const session = useSession();

  if (!session.data?.user) return null;

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // call sendMessage mutation
      const senderId = session.data?.user.id;
      const newMessage: SendMessageArgs = {
        senderId: session.data?.user.id,
        id: new ObjectID().toString(),
        conversationId,
        body: messageBody,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
      });

      console.log('[📁MessageInput.tsx:50] errors:', errors);
      console.log('[📁MessageInput.tsx:51] data:', data);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
    }
  };

  return (
    <Box px={4} py={6} w="100%">
      <form onSubmit={onSendMessage}>
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
