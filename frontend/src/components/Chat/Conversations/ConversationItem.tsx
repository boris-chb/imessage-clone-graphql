import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { formatRelative } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import React, { useState } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { ConversationPopulated } from '@backend/types/conversation';
interface ConversationItemProps {
  userId: string;
  conversation: ConversationPopulated;
  onDeleteConversation: (conversationId: string) => void;
  isSelected: Boolean;
  seenLatestMessage: boolean | undefined;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onDeleteConversation,
  isSelected,
  seenLatestMessage,
  onClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(true);

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === 'click') {
      onClick();
    } else if (event.type === 'contextmenu') {
      event.preventDefault();
      setMenuOpen(true);
    }
  };
  return (
    <Stack
      direction={'row'}
      align="center"
      justify={'space-between'}
      p={4}
      cursor="pointer"
      borderRadius={4}
      bg={isSelected ? 'whiteAlpha.200' : 'none'}
      _hover={{ bg: 'whiteAlpha.200' }}
      border="1px solid blue"
    >
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuList bg="darkBg.100">
          {/* Edit icon */}
          <MenuItem
            icon={<AiOutlineEdit fontSize={20} />}
            onClick={(event) => {
              event.stopPropagation();
              //   onEditConversation();
            }}
            bg="#2d2d2d"
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            Edit
          </MenuItem>
          {/* Delete Icon */}
          <MenuItem
            icon={<MdDeleteOutline fontSize={20} />}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
            bg="darkBg.100"
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      <Text border="1px solid red">{conversation.id}</Text>
    </Stack>
  );
};

export default ConversationItem;
