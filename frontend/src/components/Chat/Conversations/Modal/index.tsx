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
import { toast } from 'react-hot-toast';
import UserOperations from 'src/graphql/operations/user';
import {
  SearchedUser,
  SearchUsersData,
  SearchUsersInput,
} from 'src/util/types';
import ParticipantList from './ParticipantList';
import Participants from './ParticipantList';
import UserSearchList from './UserSearchList';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationsModal: React.FunctionComponent<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  console.log('SEARCH DATA', data);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // searchUsers Query
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    if (participants.includes(user)) return;
    setParticipants((currentParticipants) => [...currentParticipants, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const onCreateConversation = async () => {
    try {
      // createConversation Mutation
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Start a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  type="submit"
                  isDisabled={!username}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <ParticipantList
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width={'100%'}
                  mt={6}
                  _hover={{ bg: 'brand.100' }}
                  onClick={onCreateConversation}
                >
                  Start conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationsModal;
