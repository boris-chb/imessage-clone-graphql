import { useLazyQuery } from '@apollo/client';
import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  Text,
  Stack,
  Input,
} from '@chakra-ui/react';
import React, { use, useState } from 'react';
import UserOperations from 'src/graphql/operations/user';
import { SearchUsersData, SearchUsersInput } from 'src/util/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationsModal: React.FunctionComponent<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [username, setUsername] = useState('');
  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('inside onsubmit', username);
    // searchUsers Query
    searchUsers({ variables: { username } });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Find users</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button type="submit" disabled={!username}>
                  Search
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationsModal;
