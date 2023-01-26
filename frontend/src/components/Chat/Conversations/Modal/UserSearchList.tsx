import { Avatar, Button, Flex, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';
import { SearchedUser } from 'src/util/types';
import UserSearchItem from './UserSearchItem';

interface UserSearchListProps {
  users: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}

const UserSearchList: React.FunctionComponent<UserSearchListProps> = ({
  users,
  addParticipant,
}) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify={'center'}>
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <UserSearchItem
              key={user.id}
              user={user}
              addParticipant={addParticipant}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserSearchList;
