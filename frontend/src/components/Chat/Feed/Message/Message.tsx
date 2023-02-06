import { Flex } from '@chakra-ui/react';

interface MessageProps {}

const Message: React.FC<MessageProps> = (props) => {
  return (
    <Flex direction={'column'} justify="flex-end" overflow={'hidden'}></Flex>
  );
};

export default Message;
