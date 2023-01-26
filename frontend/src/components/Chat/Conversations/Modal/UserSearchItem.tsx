import { Avatar, Button, Flex, Stack, Text } from '@chakra-ui/react';
import user from 'src/graphql/operations/user';
import { SearchedUser } from 'src/util/types';

interface UserSearchItemProps {
  user: SearchedUser;
  addParticipant: (user: SearchedUser) => void;
}

const UserSearchItem: React.FunctionComponent<UserSearchItemProps> = ({
  user,
  addParticipant,
}) => {
  return (
    <Stack
      key={user.id}
      direction={'row'}
      align={'center'}
      spacing={4}
      py={2.5}
      px={5}
      borderRadius={4}
      _hover={{ bg: 'whiteAlpha.200' }}
    >
      <Avatar />
      <Flex justify={'space-between'} align="center" width="100%">
        <Text color={'whiteAlpha.700'}>{user.username}</Text>
        <Button
          bg={'brand.100'}
          _hover={{ bg: 'brand.100' }}
          onClick={() => addParticipant(user)}
        >
          Select
        </Button>
      </Flex>
    </Stack>
  );
};

export default UserSearchItem;
