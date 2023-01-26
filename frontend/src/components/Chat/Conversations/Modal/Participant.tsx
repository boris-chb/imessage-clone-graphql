import { Stack, Text } from '@chakra-ui/react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { SearchedUser } from 'src/types/User';

interface ParticipantProps {
  participant: SearchedUser;
  removeParticipant: (userId: string) => void;
}

const Participant: React.FunctionComponent<ParticipantProps> = ({
  participant,
  removeParticipant,
}) => {
  return (
    <Stack
      border="1px solid red"
      key={participant.id}
      align={'center'}
      direction={'row'}
      bg="whiteAlpha.200"
      borderRadius={4}
      p={2}
    >
      <Text>{participant.username}</Text>
      <IoIosCloseCircleOutline
        size={20}
        cursor={'pointer'}
        onClick={() => removeParticipant(participant.id)}
      />
    </Stack>
  );
};

export default Participant;
