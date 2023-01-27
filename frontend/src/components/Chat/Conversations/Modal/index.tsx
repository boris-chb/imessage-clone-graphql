import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ConversationOperations from 'src/graphql/operations/conversation';
import UserOperations from 'src/graphql/operations/user';
import {
  CreateConversationData,
  CreateConversationInput,
} from 'src/types/Conversation';
import {
  SearchedUser,
  SearchUsersData,
  SearchUsersInput,
} from 'src/types/User';
import ParticipantList from './ParticipantList';
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
  const session = useSession();
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutations.createConversation
    );

  //
  console.log('SEARCH DATA', data);
  //

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // searchUsers Queryxxl
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
      const participantIds = [
        ...participants.map((p) => p.id),
        session.data?.user.id as string,
      ];

      const { data, errors } = await createConversation({
        variables: {
          participantIds,
        },
      });

      if (errors) {
        console.error(errors);
      }

      console.log('onCreateConversation', data);
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
                  isLoading={createConversationLoading}
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
