import { ConversationPopulated } from '@backend/types/conversation';
import { Box, Flex, Text } from '@chakra-ui/react';
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
    <Flex alignItems={'center'}>
      <Text>{conversation.id}</Text>
      <IoIosCloseCircleOutline
        size={20}
        cursor={'pointer'}
        onClick={() => onDelete(conversation.id)}
      />
    </Flex>
  );
};

export default ConversationItem;
