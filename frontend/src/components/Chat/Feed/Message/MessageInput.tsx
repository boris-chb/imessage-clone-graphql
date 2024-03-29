import { useMutation } from '@apollo/client';
import { SendMessageArgs } from '@backend/types/message';
import { Box, Input } from '@chakra-ui/react';
import ObjectID from 'bson-objectid';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MessageOperations } from '../../../../graphql/operations/message';
import { GetMessagesData } from '../../../../types/message';

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
      let newMessageId = new ObjectID().toString();
      const newMessage: SendMessageArgs = {
        senderId: session.data.user.id,
        id: newMessageId,
        conversationId,
        body: messageBody,
      };

      setMessageBody('');

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: { sendMessage: true },
        update: (cache) => {
          const currentCache = cache.readQuery<GetMessagesData>({
            query: MessageOperations.Query.getMessages,
            variables: { conversationId },
          }) as GetMessagesData;

          cache.writeQuery<GetMessagesData, { conversationId: string }>({
            query: MessageOperations.Query.getMessages,
            variables: { conversationId },
            data: {
              ...currentCache,
              messages: [
                {
                  id: newMessageId,
                  body: messageBody,
                  senderId: session.data.user.id,
                  conversationId,
                  sender: {
                    id: session.data.user.id,
                    username: session.data.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...currentCache.messages,
              ],
            },
          });
        },
      });

      if (errors) {
        toast.error(`Error sending message`);
        console.log(errors);
      }
      if (data) console.log('[📁MessageInput.tsx:50] sendMessage data:', data);
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
