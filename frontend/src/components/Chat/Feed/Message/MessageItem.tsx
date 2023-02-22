import { MessagePopulated } from '@backend/types/message';
import { Avatar, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { formatRelative } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

interface MessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: 'p',
  other: 'MM/dd/yy',
};

const MessageItem: React.FunctionComponent<MessageItemProps> = ({
  message,
  sentByMe,
}) => {
  return (
    <Stack
      direction={'row'}
      padding={4}
      spacing={4}
      wordBreak="break-word"
      _hover={{ bg: 'whiteAlpha.200' }}
    >
      {!sentByMe && (
        <Flex align={'flex-end'}>
          <Avatar size="sm" />
        </Flex>
      )}

      <Stack spacing={1} width="100%">
        {!sentByMe && <Text>{message.sender.username}</Text>}
        <Stack
          direction={'row'}
          align="center"
          justify={sentByMe ? 'flex-end' : 'flex-start'}
        >
          {/* Sent Time */}
          <Text fontSize={14} color="whiteAlpha.700">
            {formatRelative(message.createdAt, new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })}
          </Text>
        </Stack>

        {/* Message bubble */}
        <Flex justify={sentByMe ? 'flex-end' : 'flex-start'}>
          <Box
            bg={sentByMe ? 'brand.100' : 'whiteAlpha.300'}
            px={2}
            py={1}
            borderRadius={14}
            maxWidth="65%"
          >
            <Text>{message.body}</Text>
          </Box>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
