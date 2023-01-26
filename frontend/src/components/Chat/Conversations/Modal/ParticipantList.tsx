import { Flex, Stack, Text } from '@chakra-ui/react';
import { SearchedUser } from 'src/types/User';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Participant from './Participant';

interface ParticipantListProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const ParticipantList: React.FunctionComponent<ParticipantListProps> = ({
  participants,
  removeParticipant,
}) => {
  return (
    <Flex mt={8} gap="10px" flexWrap={'wrap'} border="1px solid red">
      {participants.map((participant) => (
        <Participant
          key={participant.id}
          participant={participant}
          removeParticipant={removeParticipant}
        />
      ))}
    </Flex>
  );
};

export default ParticipantList;
