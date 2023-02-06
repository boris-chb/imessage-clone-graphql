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
import { formatUsernames } from 'src/util/functions';

const formatRelativeLocale = {
  lastWeek: 'eeee',
  yesterday: "'Yesterday",
  today: 'p',
  other: 'MM/dd/yy',
};

interface ConversationItemProps {
  currentUserId: string;
  conversation: ConversationPopulated;
  isSelected: Boolean;
  seenLatestMessage: boolean | undefined;
  onDeleteConversation: (conversationId: string) => void;
  onClick: () => void;
  // onEditConversation: (conversationId: string) => void;
  // onLeaveConversation: (conversation: ConversationPopulated) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  currentUserId,
  conversation,
  onDeleteConversation,
  isSelected,
  seenLatestMessage,
  onClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === 'click') {
      onClick();
    } else if (event.type === 'contextmenu') {
      // right click
      event.preventDefault();
      console.log(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setMousePosition(() => ({
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      }));
      setMenuOpen(true);
    }
  };

  const dateText = formatRelative(
    new Date(conversation.updatedAt),
    new Date(),
    {
      locale: {
        ...enUS,
        formatRelative: (token) =>
          formatRelativeLocale[token as keyof typeof formatRelativeLocale],
      },
    }
  );

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
      onClick={handleClick}
      onContextMenu={handleClick}
      position="relative"
      overflow="visible"
    >
      {/* Options Menu */}
      <Box
        position={'absolute'}
        left={`${mousePosition.x}px`}
        top={`${mousePosition.y}px`}
      >
        <Menu
          computePositionOnMount={true}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        >
          {/* Edit Panel */}
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
      </Box>

      {/* Chat List */}
      <Flex position={'absolute'} left="-6px">
        {!seenLatestMessage && <GoPrimitiveDot fontSize={18} color="6B47C1" />}
      </Flex>
      <Avatar />
      <Flex justify={'space-between'} width="80%" height={'100%'}>
        <Flex direction={'column'} width="70%" height={'100%'}>
          <Text
            fontWeight={600}
            whiteSpace="nowrap"
            overflow={'hidden'}
            textOverflow="ellipsis"
          >
            {formatUsernames(conversation.participants, currentUserId)}
          </Text>
          {conversation.latestMessage && (
            <Box width={'140%'} maxWidth="360px">
              <Text
                color="whiteAlpha.700"
                whiteSpace={'nowrap'}
                overflow="hidden"
                textOverflow={'ellipsis'}
              >
                {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text
          color="whiteAlpha.700"
          textAlign={'right'}
          position="absolute"
          right={4}
        >
          {dateText}
        </Text>
      </Flex>
    </Stack>
  );
};

export default ConversationItem;
