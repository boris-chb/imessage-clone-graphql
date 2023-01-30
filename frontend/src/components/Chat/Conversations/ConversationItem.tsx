import { ConversationPopulated } from '@backend/types/conversation';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface ConversationItemProps {
  conversation: ConversationPopulated;
  onDelete: (conversationId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onDelete,
}) => {
  return (
    <Stack p={4} _hover={{ bg: 'whiteAlpha.200' }} borderRadius={4}>
      <Text>
        {conversation.id}
        <IoIosCloseCircleOutline
          size={20}
          cursor={'pointer'}
          onClick={() => onDelete(conversation.id)}
        />
      </Text>
    </Stack>
  );
};

export default ConversationItem;
